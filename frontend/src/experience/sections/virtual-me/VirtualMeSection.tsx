import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChatSidebar } from './components/ChatSidebar'
import { ChatWindow } from './components/ChatWindow'
import { useChatManager } from './hooks/useChatManager'

export const VirtualMeSection = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const {
    visitorId,
    threads,
    activeThreadId,
    setActiveThreadId,
    startNewThread,
    isCreatingThread,
  } = useChatManager()

  return (
    <section className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 pt-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full w-full max-w-6xl glass-panel overflow-hidden rounded-3xl border border-white/30 shadow-2xl bg-white/10 backdrop-blur-xl relative"
      >
        <ChatSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          threads={threads}
          activeThreadId={activeThreadId}
          onSelectThread={setActiveThreadId}
          onNewChat={() => startNewThread(undefined)}
          isCreating={isCreatingThread}
          visitorId={visitorId}
        />
        <ChatWindow setIsSidebarOpen={setIsSidebarOpen} />
      </motion.div>
    </section>
  )
}
