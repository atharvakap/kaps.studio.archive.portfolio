import type { VoiceUiState } from '../voiceTypes'

interface VoiceWaveformProps {
  state: VoiceUiState
  inputLevel: number
}

const bars = Array.from({ length: 21 }, (_, index) => index)

export const VoiceWaveform = ({ state, inputLevel }: VoiceWaveformProps) => {
  const stateScale = getStateScale(state)

  return (
    <div
      className="h-28 sm:h-32 w-full max-w-xl flex items-center justify-center gap-1.5"
      aria-hidden="true"
    >
      {bars.map((bar) => {
        const centerWeight = 1 - Math.abs(bar - 10) / 14
        const liveScale =
          state === 'listening' ? Math.max(inputLevel, 0.08) : stateScale
        const height = 18 + centerWeight * 74 * liveScale

        return (
          <span
            key={bar}
            className={getBarClassName(state)}
            style={{
              height: `${height}px`,
              animationDelay: `${bar * 45}ms`,
            }}
          />
        )
      })}
    </div>
  )
}

const getStateScale = (state: VoiceUiState) => {
  switch (state) {
    case 'connecting':
    case 'connected':
      return 0.18
    case 'processing':
      return 0.32
    case 'speaking':
      return 0.72
    case 'interrupted':
      return 0.45
    case 'error':
      return 0.14
    default:
      return 0.2
  }
}

const getBarClassName = (state: VoiceUiState) => {
  const base =
    'w-1.5 sm:w-2 rounded-full transition-[height,background-color,opacity] duration-150'

  switch (state) {
    case 'speaking':
      return `${base} bg-[#FF6B00]/80 animate-pulse`
    case 'processing':
      return `${base} bg-slate-500/50 animate-pulse`
    case 'interrupted':
      return `${base} bg-amber-500/70`
    case 'error':
      return `${base} bg-red-400/70`
    case 'listening':
      return `${base} bg-[#FF6B00]/70`
    default:
      return `${base} bg-slate-400/40 animate-pulse`
  }
}

