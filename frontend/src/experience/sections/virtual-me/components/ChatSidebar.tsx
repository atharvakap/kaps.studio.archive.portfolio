import { Plus, MessageSquare, PanelLeftClose, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatThread } from '../services/virtualMeService'

interface ChatSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  threads: ChatThread[]
  activeThreadId: string | null
  onSelectThread: (id: string) => void
  onNewChat: () => void
  isCreating: boolean
  visitorId: string | null
}

export const ChatSidebar = ({
  isOpen,
  setIsOpen,
  threads,
  activeThreadId,
  onSelectThread,
  onNewChat,
  isCreating,
}: ChatSidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/25 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          'absolute md:relative z-20 h-full w-[min(18rem,86vw)] md:w-64 shrink-0 border-r border-white/20 bg-white/40 backdrop-blur-md flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <button
            onClick={onNewChat}
            disabled={isCreating}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isCreating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Plus size={18} /> New Chat
              </>
            )}
          </button>

          <button
            className="md:hidden ml-2 p-2 text-slate-600 hover:bg-white/50 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <PanelLeftClose size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-2 space-y-1 scrollbar-none">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-2">
            Conversations
          </div>

          {threads.length === 0 ? (
            <p className="text-xs text-slate-400 px-3 py-2">No history yet.</p>
          ) : (
            threads.map((thread) => {
              const isActive = thread.id === activeThreadId
              return (
                <button
                  key={thread.id}
                  onClick={() => {
                    onSelectThread(thread.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all border',
                    isActive
                      ? 'text-slate-800 bg-white/60 border-white/50 shadow-sm font-medium'
                      : 'text-slate-600 hover:bg-white/40 border-transparent'
                  )}
                >
                  <MessageSquare
                    size={16}
                    className={isActive ? 'text-[#FF6B00]' : 'text-slate-400'}
                  />
                  <span className="truncate">
                    {thread.title || 'New Conversation'}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
