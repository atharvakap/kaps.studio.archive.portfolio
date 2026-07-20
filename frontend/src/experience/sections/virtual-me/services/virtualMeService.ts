const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export interface ChatVisitor {
  id: string
  name?: string
  email?: string
}

export interface ChatThread {
  id: string
  visitor_id: string
  title: string
  created_at: string
}

export interface ChatMessage {
  id: string
  thread_id: string
  role: 'user' | 'assistant'
  content: string
  message_type?: string
  metadata?: AttachmentMetadata | Record<string, unknown> // <-- Replaced 'any' with 'unknown'
  created_at: string
}

export interface AttachmentMetadata {
  type: 'resume' | 'image' | 'link'
  title: string
  url: string
  version?: string
}

export const createVisitor = async (): Promise<ChatVisitor> => {
  const res = await fetch(`${API_URL}/chat/visitor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Guest' }),
  })
  if (!res.ok) throw new Error('Failed to create visitor session')
  return res.json()
}

export const fetchThreads = async (
  visitorId: string
): Promise<ChatThread[]> => {
  const res = await fetch(`${API_URL}/chat/threads/${visitorId}`)
  if (!res.ok) throw new Error('Failed to fetch threads')
  return res.json()
}

export const createThread = async (
  visitorId: string,
  title = 'New Conversation'
): Promise<ChatThread> => {
  const res = await fetch(`${API_URL}/chat/thread`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitor_id: visitorId, title }),
  })
  if (!res.ok) throw new Error('Failed to create thread')
  return res.json()
}

export const fetchMessages = async (
  threadId: string
): Promise<ChatMessage[]> => {
  const res = await fetch(`${API_URL}/chat/thread/${threadId}/messages`)
  if (!res.ok) throw new Error('Failed to fetch messages')
  return res.json()
}

export const sendMessage = async (
  threadId: string,
  content: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  const res = await fetch(`${API_URL}/chat/thread/${threadId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Prevent FastAPI 422 Errors by sending a fully compliant Pydantic payload
    body: JSON.stringify({
      content: content,
      message_type: 'text',
      metadata: {},
      role: 'user',
    }),
  })

  if (!res.ok) {
    const errorDetails = await res.json().catch(() => ({}))
    console.error('FastAPI Error Details:', errorDetails)
    throw new Error('Failed to send message')
  }

  // Handle the StreamingResponse from FastAPI
  const reader = res.body?.getReader()
  if (!reader) return

  const decoder = new TextDecoder()
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    onChunk(chunk)
  }
}

export const trackResumeDownload = async (
  resumeId: string,
  name?: string,
  email?: string
): Promise<void> => {
  const res = await fetch(`${API_URL}/resume/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_id: resumeId, name, email }),
  })

  if (!res.ok) {
    console.error('Failed to track resume download')
  }
}


