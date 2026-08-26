export type VoiceUiState =
  | 'inactive'
  | 'connecting'
  | 'connected'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'interrupted'
  | 'reconnecting'
  | 'error'
  | 'closing'

export interface VoiceSessionResponse {
  id: string
  provider: string
  provider_session_id?: string | null
  state: string
  sdp: string
  model: string
  voice: string
}

export interface VoiceTranscriptState {
  partial: string
  lastUser: string
  assistantDraft: string
}

export interface VoiceClientEvent {
  event_name: string
  turn_id?: string
  metadata?: Record<string, unknown>
}

