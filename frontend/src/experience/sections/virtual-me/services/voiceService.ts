import { env } from '@/lib/env'
import type { VoiceClientEvent, VoiceSessionResponse } from '../voiceTypes'

interface CreateVoiceSessionRequest {
  visitorId: string
  threadId: string
  sdp: string
}

interface StreamVoiceTurnRequest {
  voiceSessionId: string
  threadId: string
  transcript: string
  providerItemId?: string
  signal: AbortSignal
  onTurnStarted?: (turnId: string | null) => void
  onChunk: (chunk: string) => void
}

const API_URL = env.apiUrl

export const createVoiceSession = async ({
  visitorId,
  threadId,
  sdp,
}: CreateVoiceSessionRequest): Promise<VoiceSessionResponse> => {
  const response = await fetch(`${API_URL}/voice/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitor_id: visitorId,
      thread_id: threadId,
      sdp,
    }),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Voice session failed'))
  }

  return response.json()
}

export const streamVoiceTurn = async ({
  voiceSessionId,
  threadId,
  transcript,
  providerItemId,
  signal,
  onTurnStarted,
  onChunk,
}: StreamVoiceTurnRequest): Promise<string> => {
  const response = await fetch(`${API_URL}/voice/sessions/${voiceSessionId}/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      thread_id: threadId,
      transcript,
      provider_item_id: providerItemId,
    }),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Voice turn failed'))
  }

  onTurnStarted?.(response.headers.get('X-Voice-Turn-Id'))

  const reader = response.body?.getReader()
  if (!reader) return ''

  const decoder = new TextDecoder()
  let fullResponse = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    fullResponse += chunk
    onChunk(chunk)
  }

  return fullResponse
}

export const recordVoiceEvent = async (
  voiceSessionId: string,
  event: VoiceClientEvent
): Promise<void> => {
  await fetch(`${API_URL}/voice/sessions/${voiceSessionId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(() => undefined)
}

export const interruptVoiceTurn = async (
  voiceSessionId: string,
  reason: string,
  turnId?: string | null
): Promise<void> => {
  await fetch(`${API_URL}/voice/sessions/${voiceSessionId}/interrupt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason, turn_id: turnId }),
  }).catch(() => undefined)
}

export const closeVoiceSession = async (voiceSessionId: string): Promise<void> => {
  await fetch(`${API_URL}/voice/sessions/${voiceSessionId}`, {
    method: 'DELETE',
  }).catch(() => undefined)
}

const readErrorMessage = async (
  response: Response,
  fallback: string
): Promise<string> => {
  const payload: unknown = await response.json().catch(() => undefined)
  if (
    payload &&
    typeof payload === 'object' &&
    'detail' in payload &&
    typeof payload.detail === 'string'
  ) {
    return payload.detail
  }

  return fallback
}
