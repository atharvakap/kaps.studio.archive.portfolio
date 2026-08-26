import { useCallback, useEffect, useRef, useState } from 'react'
import {
  closeVoiceSession as closeVoiceSessionRequest,
  createVoiceSession,
  interruptVoiceTurn,
  recordVoiceEvent,
  streamVoiceTurn,
} from '../services/voiceService'
import type {
  VoiceClientEvent,
  VoiceTranscriptState,
  VoiceUiState,
} from '../voiceTypes'

interface UseVoiceSessionOptions {
  visitorId: string | null
  threadId: string | null
  onTurnCompleted: () => void
}

interface RealtimeEvent {
  type: string
  transcript?: string
  delta?: string
  item_id?: string
  response?: {
    id?: string
    status?: string
    metadata?: Record<string, unknown>
  }
  item?: {
    id?: string
  }
}

const INITIAL_TRANSCRIPT: VoiceTranscriptState = {
  partial: '',
  lastUser: '',
  assistantDraft: '',
}

export const useVoiceSession = ({
  visitorId,
  threadId,
  onTurnCompleted,
}: UseVoiceSessionOptions) => {
  const [voiceState, setVoiceState] = useState<VoiceUiState>('inactive')
  const [transcript, setTranscript] =
    useState<VoiceTranscriptState>(INITIAL_TRANSCRIPT)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [inputLevel, setInputLevel] = useState(0)

  const stateRef = useRef<VoiceUiState>('inactive')
  const peerRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const voiceSessionIdRef = useRef<string | null>(null)
  const currentVoiceTurnIdRef = useRef<string | null>(null)
  const turnAbortRef = useRef<AbortController | null>(null)
  const speechQueueRef = useRef<string[]>([])
  const speechBufferRef = useRef('')
  const ttsInFlightRef = useRef(false)
  const backendStreamDoneRef = useRef(true)
  const responseAudioStartedRef = useRef(false)
  const turnFirstAudioSeenRef = useRef(false)
  const pendingEventsRef = useRef<VoiceClientEvent[]>([])
  const cleanupMeterRef = useRef<(() => void) | null>(null)

  const updateState = useCallback((nextState: VoiceUiState) => {
    stateRef.current = nextState
    setVoiceState(nextState)
  }, [])

  const sendOrQueueEvent = useCallback((event: VoiceClientEvent) => {
    const voiceSessionId = voiceSessionIdRef.current
    if (!voiceSessionId) {
      pendingEventsRef.current.push(event)
      return
    }

    void recordVoiceEvent(voiceSessionId, event)
  }, [])

  const recordEvent = useCallback(
    (
      eventName: string,
      metadata: Record<string, unknown> = {},
      turnId?: string | null
    ) => {
      const event: VoiceClientEvent = {
        event_name: eventName,
        metadata,
      }

      if (turnId) {
        event.turn_id = turnId
      }

      sendOrQueueEvent(event)
    },
    [sendOrQueueEvent]
  )

  const recordTurnEvent = useCallback(
    (eventName: string, metadata: Record<string, unknown> = {}) => {
      recordEvent(eventName, metadata, currentVoiceTurnIdRef.current)
    },
    [recordEvent]
  )

  const flushPendingEvents = useCallback(() => {
    const voiceSessionId = voiceSessionIdRef.current
    if (!voiceSessionId) return

    const events = pendingEventsRef.current.splice(0)
    for (const event of events) {
      void recordVoiceEvent(voiceSessionId, event)
    }
  }, [])

  const sendProviderEvent = useCallback((event: Record<string, unknown>) => {
    const channel = dataChannelRef.current
    if (!channel || channel.readyState !== 'open') return
    channel.send(JSON.stringify(event))
  }, [])

  const handleError = useCallback(
    (message: string, state: VoiceUiState = 'error') => {
      setErrorMessage(message)
      updateState(state)
      recordEvent('voice_error', { message })
    },
    [recordEvent, updateState]
  )

  const muteRemoteAudioBriefly = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = true
    window.setTimeout(() => {
      if (audioRef.current && stateRef.current !== 'interrupted') {
        audioRef.current.muted = false
      }
    }, 120)
  }, [])

  const cleanupVoiceSession = useCallback(
    async (notifyBackend = true) => {
      const voiceSessionId = voiceSessionIdRef.current

      updateState(stateRef.current === 'inactive' ? 'inactive' : 'closing')
      turnAbortRef.current?.abort()
      turnAbortRef.current = null
      cleanupMeterRef.current?.()
      cleanupMeterRef.current = null

      localStreamRef.current?.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null

      dataChannelRef.current?.close()
      dataChannelRef.current = null

      peerRef.current?.close()
      peerRef.current = null

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.srcObject = null
      }
      audioRef.current = null

      speechQueueRef.current = []
      speechBufferRef.current = ''
      ttsInFlightRef.current = false
      backendStreamDoneRef.current = true
      responseAudioStartedRef.current = false
      turnFirstAudioSeenRef.current = false
      currentVoiceTurnIdRef.current = null
      setInputLevel(0)

      if (voiceSessionId && notifyBackend) {
        await recordVoiceEvent(voiceSessionId, {
          event_name: 'session_ended',
          metadata: {},
        }).catch(() => undefined)
        await closeVoiceSessionRequest(voiceSessionId)
      }

      pendingEventsRef.current = []
      voiceSessionIdRef.current = null
      updateState('inactive')
    },
    [updateState]
  )

  const stopProviderSpeech = useCallback(
    (reason: string) => {
      const voiceSessionId = voiceSessionIdRef.current
      const voiceTurnId = currentVoiceTurnIdRef.current
      turnAbortRef.current?.abort()
      turnAbortRef.current = null
      speechQueueRef.current = []
      speechBufferRef.current = ''
      ttsInFlightRef.current = false
      backendStreamDoneRef.current = true
      responseAudioStartedRef.current = false
      turnFirstAudioSeenRef.current = false

      sendProviderEvent({ type: 'response.cancel' })
      sendProviderEvent({ type: 'output_audio_buffer.clear' })
      muteRemoteAudioBriefly()

      if (voiceSessionId) {
        void interruptVoiceTurn(voiceSessionId, reason, voiceTurnId)
      }

      setTranscript((current) => ({ ...current, assistantDraft: '' }))
      updateState('interrupted')
      recordEvent('playback_stopped', { reason }, voiceTurnId)
    },
    [muteRemoteAudioBriefly, recordEvent, sendProviderEvent, updateState]
  )

  const drainSpeechQueue = useCallback(() => {
    if (ttsInFlightRef.current) return

    const channel = dataChannelRef.current
    if (!channel || channel.readyState !== 'open') return

    const nextText = speechQueueRef.current.shift()
    if (!nextText) {
      if (backendStreamDoneRef.current) {
        const voiceTurnId = currentVoiceTurnIdRef.current
        if (voiceTurnId) {
          recordEvent('playback_completed', {}, voiceTurnId)
        }
        currentVoiceTurnIdRef.current = null
        updateState('listening')
      }
      return
    }

    const audio = audioRef.current
    if (audio) {
      audio.muted = false
      void audio.play().catch(() => undefined)
    }

    ttsInFlightRef.current = true
    responseAudioStartedRef.current = false
    updateState('speaking')
    recordTurnEvent('tts_started', { characters: nextText.length })

    sendProviderEvent({
      type: 'response.create',
      response: {
        conversation: 'none',
        input: [
          {
            type: 'message',
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: nextText,
              },
            ],
          },
        ],
        output_modalities: ['audio'],
        tools: [],
        tool_choice: 'none',
        metadata: {
          source: 'virtual_me_voice',
          voice_turn_id: currentVoiceTurnIdRef.current,
        },
        instructions: [
          'Read the provided Virtual Me response exactly as spoken audio.',
          'Do not answer from your own knowledge.',
          'Do not add, remove, summarize, or reinterpret the words.',
        ].join(' '),
      },
    })
  }, [recordEvent, recordTurnEvent, sendProviderEvent, updateState])

  const flushSpeechBuffer = useCallback(
    (force = false) => {
      let buffer = speechBufferRef.current
      const chunks: string[] = []

      while (buffer.length > 120) {
        const match = buffer.match(/^([\s\S]{80,}?[.!?])\s+/)
        if (!match) break

        chunks.push(match[1].trim())
        buffer = buffer.slice(match[0].length)
      }

      if (force && buffer.trim()) {
        chunks.push(buffer.trim())
        buffer = ''
      }

      speechBufferRef.current = buffer
      speechQueueRef.current.push(...chunks.filter(Boolean))
      drainSpeechQueue()
    },
    [drainSpeechQueue]
  )

  const processTranscript = useCallback(
    async (finalTranscript: string, providerItemId?: string) => {
      const voiceSessionId = voiceSessionIdRef.current
      if (!voiceSessionId || !threadId) return

      const normalizedTranscript = finalTranscript.trim()
      if (!normalizedTranscript) {
        handleError('I did not catch that. Please try again.', 'listening')
        return
      }

      const abortController = new AbortController()
      currentVoiceTurnIdRef.current = null
      turnAbortRef.current = abortController
      backendStreamDoneRef.current = false
      speechBufferRef.current = ''
      speechQueueRef.current = []
      responseAudioStartedRef.current = false
      turnFirstAudioSeenRef.current = false

      setTranscript({
        partial: '',
        lastUser: normalizedTranscript,
        assistantDraft: '',
      })
      updateState('processing')
      recordEvent('transcription_completed', { provider_item_id: providerItemId })

      try {
        await streamVoiceTurn({
          voiceSessionId,
          threadId,
          transcript: normalizedTranscript,
          providerItemId,
          signal: abortController.signal,
          onTurnStarted: (turnId) => {
            currentVoiceTurnIdRef.current = turnId
            recordEvent('transcription_completed', { provider_item_id: providerItemId }, turnId)
          },
          onChunk: (chunk) => {
            setTranscript((current) => ({
              ...current,
              assistantDraft: current.assistantDraft + chunk,
            }))
            speechBufferRef.current += chunk
            flushSpeechBuffer(false)
          },
        })

        backendStreamDoneRef.current = true
        flushSpeechBuffer(true)
        onTurnCompleted()
      } catch (error) {
        if (abortController.signal.aborted) return

        handleError(
          error instanceof Error
            ? error.message
            : 'Voice mode had trouble processing that turn.',
          'error'
        )
      } finally {
        if (turnAbortRef.current === abortController) {
          turnAbortRef.current = null
        }
      }
    },
    [
      flushSpeechBuffer,
      handleError,
      onTurnCompleted,
      recordEvent,
      threadId,
      updateState,
    ]
  )

  const handleRealtimeEvent = useCallback(
    (event: RealtimeEvent) => {
      switch (event.type) {
        case 'session.created':
        case 'session.updated':
          updateState('listening')
          break

        case 'input_audio_buffer.speech_started':
          recordEvent('speech_started')
          if (stateRef.current === 'speaking' || !backendStreamDoneRef.current) {
            stopProviderSpeech('barge_in')
          } else {
            updateState('listening')
          }
          setTranscript((current) => ({ ...current, partial: '' }))
          break

        case 'input_audio_buffer.speech_stopped':
          recordEvent('speech_ended')
          recordEvent('transcription_started')
          updateState('processing')
          break

        case 'conversation.item.input_audio_transcription.delta':
          if (event.delta) {
            setTranscript((current) => ({
              ...current,
              partial: current.partial + event.delta,
            }))
          }
          break

        case 'conversation.item.input_audio_transcription.completed':
          void processTranscript(event.transcript ?? '', event.item_id)
          break

        case 'response.created':
          recordTurnEvent('provider_response_created', {
            response_id: event.response?.id,
          })
          break

        case 'response.output_item.added':
          recordTurnEvent('tts_output_item_added', { item_id: event.item?.id })
          break

        case 'response.output_audio.delta':
          if (!responseAudioStartedRef.current) {
            responseAudioStartedRef.current = true
            if (!turnFirstAudioSeenRef.current) {
              turnFirstAudioSeenRef.current = true
              recordTurnEvent('first_audio')
              recordTurnEvent('playback_started')
            }
            updateState('speaking')
          }
          break

        case 'response.output_audio.done':
          ttsInFlightRef.current = false
          recordTurnEvent('tts_completed')
          drainSpeechQueue()
          break

        case 'response.done':
          if (ttsInFlightRef.current) {
            ttsInFlightRef.current = false
            recordTurnEvent('tts_completed', {
              response_status: event.response?.status,
            })
            drainSpeechQueue()
          }
          break

        case 'output_audio_buffer.cleared':
        case 'output_audio_buffer.stopped':
          recordTurnEvent('playback_stopped', { source: event.type })
          updateState('interrupted')
          break

        case 'error':
          handleError('Voice mode hit a realtime connection error.')
          break

        default:
          break
      }
    },
    [
      drainSpeechQueue,
      handleError,
      processTranscript,
      recordEvent,
      recordTurnEvent,
      stopProviderSpeech,
      updateState,
    ]
  )

  const setupInputMeter = useCallback((stream: MediaStream) => {
    try {
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      const data = new Uint8Array(analyser.frequencyBinCount)
      let frameId = 0
      let lastUpdate = 0

      analyser.fftSize = 256
      source.connect(analyser)

      const tick = (now: number) => {
        analyser.getByteFrequencyData(data)
        if (now - lastUpdate > 80) {
          const average =
            data.reduce((total, value) => total + value, 0) / data.length
          setInputLevel(Math.min(1, average / 96))
          lastUpdate = now
        }
        frameId = window.requestAnimationFrame(tick)
      }

      frameId = window.requestAnimationFrame(tick)

      cleanupMeterRef.current = () => {
        window.cancelAnimationFrame(frameId)
        source.disconnect()
        analyser.disconnect()
        void audioContext.close()
      }
    } catch {
      cleanupMeterRef.current = null
    }
  }, [])

  const startVoiceSession = useCallback(async () => {
    if (!visitorId || !threadId || stateRef.current !== 'inactive') return

    if (!navigator.mediaDevices?.getUserMedia) {
      handleError('This browser does not support microphone access.')
      return
    }

    updateState('connecting')
    setErrorMessage(null)
    setTranscript(INITIAL_TRANSCRIPT)

    try {
      const peer = new RTCPeerConnection()
      peerRef.current = peer

      const audio = document.createElement('audio')
      audio.autoplay = true
      audio.playsInline = true
      audioRef.current = audio

      peer.ontrack = (event) => {
        audio.srcObject = event.streams[0]
        void audio.play().catch(() => {
          handleError('Audio playback was blocked by the browser.', 'error')
        })
      }

      peer.onconnectionstatechange = () => {
        if (peer.connectionState === 'connected') {
          updateState('connected')
          recordEvent('session_connected')
        }

        if (
          peer.connectionState === 'failed' ||
          peer.connectionState === 'disconnected'
        ) {
          handleError('Voice connection was lost. Text chat is still available.')
        }
      }

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      localStreamRef.current = localStream
      setupInputMeter(localStream)
      recordEvent('microphone_ready')

      for (const track of localStream.getAudioTracks()) {
        peer.addTrack(track, localStream)
      }

      const dataChannel = peer.createDataChannel('oai-events')
      dataChannelRef.current = dataChannel

      dataChannel.onopen = () => {
        updateState('listening')
        recordEvent('data_channel_open')
      }
      dataChannel.onmessage = (message) => {
        const parsed = parseRealtimeEvent(message.data)
        if (parsed) {
          handleRealtimeEvent(parsed)
        }
      }
      dataChannel.onerror = () => {
        handleError('Voice event channel failed.')
      }

      const offer = await peer.createOffer()
      await peer.setLocalDescription(offer)

      if (!offer.sdp) {
        throw new Error('Browser did not produce a WebRTC offer.')
      }

      const sessionAnswer = await createVoiceSession({
        visitorId,
        threadId,
        sdp: offer.sdp,
      })

      voiceSessionIdRef.current = sessionAnswer.id
      flushPendingEvents()
      await peer.setRemoteDescription({
        type: 'answer',
        sdp: sessionAnswer.sdp,
      })
    } catch (error) {
      handleError(classifyStartError(error))
      await cleanupVoiceSession(false)
    }
  }, [
    cleanupVoiceSession,
    flushPendingEvents,
    handleError,
    handleRealtimeEvent,
    recordEvent,
    setupInputMeter,
    threadId,
    updateState,
    visitorId,
  ])

  const toggleMicrophone = useCallback(() => {
    const nextMuted = !isMicMuted
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted
    })
    setIsMicMuted(nextMuted)
    recordEvent(nextMuted ? 'microphone_muted' : 'microphone_unmuted')
  }, [isMicMuted, recordEvent])

  useEffect(() => {
    return () => {
      void cleanupVoiceSession(true)
    }
  }, [cleanupVoiceSession])

  return {
    voiceState,
    transcript,
    errorMessage,
    isMicMuted,
    inputLevel,
    startVoiceSession,
    closeVoiceSession: cleanupVoiceSession,
    toggleMicrophone,
  }
}

const parseRealtimeEvent = (value: unknown): RealtimeEvent | null => {
  if (typeof value !== 'string') return null

  try {
    const parsed: unknown = JSON.parse(value)
    if (!isRecord(parsed) || typeof parsed.type !== 'string') return null

    return {
      type: parsed.type,
      transcript:
        typeof parsed.transcript === 'string' ? parsed.transcript : undefined,
      delta: typeof parsed.delta === 'string' ? parsed.delta : undefined,
      item_id: typeof parsed.item_id === 'string' ? parsed.item_id : undefined,
      response: isRecord(parsed.response)
        ? {
            id:
              typeof parsed.response.id === 'string'
                ? parsed.response.id
                : undefined,
            status:
              typeof parsed.response.status === 'string'
                ? parsed.response.status
                : undefined,
            metadata: isRecord(parsed.response.metadata)
              ? parsed.response.metadata
              : undefined,
          }
        : undefined,
      item: isRecord(parsed.item)
        ? {
            id: typeof parsed.item.id === 'string' ? parsed.item.id : undefined,
          }
        : undefined,
    }
  } catch {
    return null
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const classifyStartError = (error: unknown): string => {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') {
      return 'Microphone permission was denied. Text chat is still available.'
    }
    if (error.name === 'NotFoundError') {
      return 'No microphone was found. Text chat is still available.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Voice mode could not start. Text chat is still available.'
}
