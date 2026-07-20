import { useEffect, useRef } from 'react'
import { PanelLeftOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChatManager } from '../hooks/useChatManager'
import type {
  ChatMessage,
  AttachmentMetadata,
} from '../services/virtualMeService'
import { ResumeCard } from './ResumeCard'
import { ChatInput } from './ChatInput'

interface ChatWindowProps {
  setIsSidebarOpen: (isOpen: boolean) => void
}

export const ChatWindow = ({ setIsSidebarOpen }: ChatWindowProps) => {
  const {
    messages,
    isLoadingMessages,
    sendMessage,
    isSendingMessage,
    activeThreadId,
  } = useChatManager()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the bottom whenever messages change or generate
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSendingMessage])

  const handleSend = (text: string) => {
    if (!text.trim() || isSendingMessage || !activeThreadId) return
    sendMessage(text)
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white/20 relative min-w-0">
      <header className="h-14 border-b border-white/20 flex items-center px-4 md:px-6 backdrop-blur-xs shrink-0 z-10">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden mr-3 p-1.5 text-slate-600 hover:bg-white/40 rounded-lg transition-colors"
        >
          <PanelLeftOpen size={20} />
        </button>
        <h2 className="text-slate-800 font-semibold text-sm md:text-base truncate">
          {activeThreadId ? 'Conversation' : 'New Chat'}
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-none flex flex-col">
        {isLoadingMessages ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm font-mono text-slate-400 animate-pulse">
              Loading messages...
            </span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-70">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#FF6B00]/20 to-orange-500/20 flex items-center justify-center mb-4">
              <span className="text-[#FF6B00] text-xl font-bold">AK</span>
            </div>
            <p className="text-slate-600 text-sm font-medium">
              Ask me anything about Atharva's experience or projects!
            </p>
          </div>
        ) : (
          messages.map((msg: ChatMessage) => {
            // Type cast metadata safely
            const metadata = msg.metadata as AttachmentMetadata | undefined

            return (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-3xl w-full ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-slate-800'
                      : 'bg-linear-to-br from-[#FF6B00] to-orange-500'
                  }`}
                >
                  <span className="text-white text-xs font-bold tracking-wider">
                    {msg.role === 'user' ? 'U' : 'AK'}
                  </span>
                </div>

                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm border ${
                    msg.role === 'user'
                      ? 'bg-white/70 backdrop-blur-xs border-white/60 rounded-tr-none'
                      : 'bg-white/90 border-white/80 rounded-tl-none'
                  }`}
                >
                  <div className="text-slate-800 text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>

                    {/* Render Attachment if present */}
                    {msg.message_type === 'attachment' &&
                      metadata?.type === 'resume' && (
                        <ResumeCard
                          title={metadata.title}
                          url={metadata.url}
                          version={metadata.version}
                        />
                      )}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {/* Animated Typing Indicator */}
        {isSendingMessage && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-4 max-w-3xl w-full mr-auto">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-linear-to-br from-[#FF6B00] to-orange-500">
              <span className="text-white text-xs font-bold tracking-wider">
                AK
              </span>
            </div>
            <div className="px-5 py-4 rounded-2xl shadow-sm border bg-white/90 border-white/80 rounded-tl-none flex items-center">
              <span className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              </span>
            </div>
          </div>
        )}

        {/* Invisible div to anchor the auto-scroll */}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <div className="p-4 md:p-6 bg-linear-to-t from-white/40 to-transparent shrink-0 pointer-events-auto">
        <ChatInput
          onSend={handleSend}
          disabled={!activeThreadId || isSendingMessage}
        />
        <div className="text-center mt-3 pointer-events-auto">
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">
            AI generated. Can make mistakes. Validated by Atharva.
          </p>
        </div>
      </div>
    </div>
  )
}
