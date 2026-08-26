import { Mic, MicOff, PhoneOff, Volume2, Waves } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VoiceTranscriptState, VoiceUiState } from '../voiceTypes'
import { VoiceWaveform } from './VoiceWaveform'

interface VoiceModeProps {
  state: VoiceUiState
  transcript: VoiceTranscriptState
  errorMessage: string | null
  isMicMuted: boolean
  inputLevel: number
  onClose: () => void
  onToggleMicrophone: () => void
}

export const VoiceMode = ({
  state,
  transcript,
  errorMessage,
  isMicMuted,
  inputLevel,
  onClose,
  onToggleMicrophone,
}: VoiceModeProps) => {
  const status = getStatus(state, isMicMuted)

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 sm:px-6 py-5 sm:py-8 overflow-hidden">
      <div className="w-full max-w-3xl flex flex-col items-center gap-5 sm:gap-6">
        <div
          className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium"
          aria-live="polite"
        >
          {state === 'speaking' ? <Volume2 size={16} /> : <Waves size={16} />}
          <span>{status}</span>
        </div>

        <VoiceWaveform state={state} inputLevel={isMicMuted ? 0 : inputLevel} />

        <div className="w-full min-h-28 sm:min-h-32 rounded-2xl border border-white/50 bg-white/55 backdrop-blur-xl shadow-sm px-4 sm:px-5 py-4 overflow-hidden">
          {errorMessage ? (
            <p className="text-sm text-red-600 leading-relaxed">{errorMessage}</p>
          ) : (
            <div className="space-y-3">
              <TranscriptLine label="You" text={transcript.partial || transcript.lastUser} />
              <TranscriptLine label="AK" text={transcript.assistantDraft} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMicrophone}
            className={cn(
              'h-11 w-11 rounded-full flex items-center justify-center border shadow-sm transition-all active:scale-95',
              isMicMuted
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white/70 text-slate-700 border-white/70 hover:bg-white/90'
            )}
            title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
            aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-11 w-11 rounded-full flex items-center justify-center bg-white/70 text-slate-700 border border-white/70 shadow-sm transition-all hover:bg-white/90 active:scale-95"
            title="Close voice mode"
            aria-label="Close voice mode"
          >
            <PhoneOff size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

interface TranscriptLineProps {
  label: string
  text: string
}

const TranscriptLine = ({ label, text }: TranscriptLineProps) => (
  <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 text-sm leading-relaxed">
    <span className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold pt-0.5">
      {label}
    </span>
    <p className="text-slate-700 min-h-5 break-words">
      {text || <span className="text-slate-400">...</span>}
    </p>
  </div>
)

const getStatus = (state: VoiceUiState, isMicMuted: boolean) => {
  if (isMicMuted && state !== 'closing') return 'Microphone muted'

  switch (state) {
    case 'connecting':
      return 'Connecting voice'
    case 'connected':
      return 'Connected'
    case 'listening':
      return 'Listening'
    case 'processing':
      return 'Thinking'
    case 'speaking':
      return 'Speaking'
    case 'interrupted':
      return 'Interrupted'
    case 'reconnecting':
      return 'Reconnecting'
    case 'error':
      return 'Voice unavailable'
    case 'closing':
      return 'Closing'
    default:
      return 'Voice mode'
  }
}
