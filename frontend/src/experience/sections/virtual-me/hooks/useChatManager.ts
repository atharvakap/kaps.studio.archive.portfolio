import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createVisitor,
  fetchThreads,
  createThread,
  fetchMessages,
  sendMessage as sendApiMessage,
} from '../services/virtualMeService'
import type { ChatMessage, ChatThread } from '../services/virtualMeService'

export const useChatManager = () => {
  const queryClient = useQueryClient()

  // Clear visitor session details from sessionStorage upon browser refresh/unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('virtual_me_visitor_id')
      sessionStorage.removeItem('virtual_me_visitor_name')
      sessionStorage.removeItem('virtual_me_visitor_email')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Visitor identity state stored in sessionStorage
  const [visitorId, setVisitorId] = useState<string | null>(() =>
    sessionStorage.getItem('virtual_me_visitor_id')
  )
  const [visitorName, setVisitorName] = useState<string | null>(() =>
    sessionStorage.getItem('virtual_me_visitor_name')
  )
  const [visitorEmail, setVisitorEmail] = useState<string | null>(() =>
    sessionStorage.getItem('virtual_me_visitor_email')
  )

  // Control modal visibility if name/email are missing
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState<boolean>(
    !sessionStorage.getItem('virtual_me_visitor_id') ||
      !sessionStorage.getItem('virtual_me_visitor_name')
  )

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)

  // Function to register or login a visitor with Name and Email
  const registerVisitor = async (name: string, email: string) => {
    try {
      const visitor = await createVisitor(name, email)
      sessionStorage.setItem('virtual_me_visitor_id', visitor.id)
      sessionStorage.setItem('virtual_me_visitor_name', name)
      sessionStorage.setItem('virtual_me_visitor_email', email)

      setVisitorId(visitor.id)
      setVisitorName(name)
      setVisitorEmail(email)
      setIsVisitorModalOpen(false)

      // Invalidate and refetch threads for the newly registered visitor
      queryClient.invalidateQueries({ queryKey: ['chat-threads', visitor.id] })
    } catch (error) {
      console.error('Failed to create visitor session:', error)
    }
  }

  // 2. Fetch all threads for the authenticated visitor
  const { data: threads = [], isLoading: isLoadingThreads } = useQuery<
    ChatThread[]
  >({
    queryKey: ['chat-threads', visitorId],
    queryFn: () => fetchThreads(visitorId!),
    enabled: !!visitorId && !isVisitorModalOpen,
  })

  // Ensure activeThreadId defaults to the top thread if none is selected
  const resolvedActiveThreadId =
    activeThreadId ?? (threads.length > 0 ? threads[0].id : null)

  // 3. Mutation to create a fresh thread
  const { mutate: startNewThread, isPending: isCreatingThread } = useMutation({
    mutationFn: (title: string | undefined) =>
      createThread(visitorId!, title ?? 'New Conversation'),
    onSuccess: (newThread) => {
      queryClient.setQueryData(
        ['chat-threads', visitorId],
        (oldThreads: ChatThread[] = []) => [newThread, ...oldThreads]
      )
      setActiveThreadId(newThread.id)
      queryClient.setQueryData(['chat-messages', newThread.id], [])
      queryClient.invalidateQueries({ queryKey: ['chat-threads', visitorId] })
    },
  })

  // ---------------------------------------------------------
  // Auto-create a first thread if the user has 0 threads
  // ---------------------------------------------------------
  useEffect(() => {
    if (
      visitorId &&
      !isVisitorModalOpen &&
      !isLoadingThreads &&
      threads.length === 0 &&
      !isCreatingThread
    ) {
      startNewThread(undefined)
    }
  }, [
    visitorId,
    isVisitorModalOpen,
    isLoadingThreads,
    threads.length,
    isCreatingThread,
    startNewThread,
  ])

  // 4. Fetch messages for the currently active thread
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<
    ChatMessage[]
  >({
    queryKey: ['chat-messages', resolvedActiveThreadId],
    queryFn: () => fetchMessages(resolvedActiveThreadId!),
    enabled: !!resolvedActiveThreadId && !isVisitorModalOpen,
    staleTime: 1000 * 60,
  })

  // 5. Send Message & Handle Automatic Title Renaming
  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: async (content: string) => {
      const currentThreadId = resolvedActiveThreadId!
      const assistantMessageId = 'temp-assistant-' + Date.now()

      const currentThread = threads.find((t) => t.id === currentThreadId)
      if (currentThread && currentThread.title === 'New Conversation') {
        const newTitle =
          content.length > 30 ? content.substring(0, 30) + '...' : content
        queryClient.setQueryData(
          ['chat-threads', visitorId],
          (old: ChatThread[] = []) =>
            old.map((t) =>
              t.id === currentThreadId ? { ...t, title: newTitle } : t
            )
        )
      }

      return sendApiMessage(currentThreadId, content, (chunk) => {
        queryClient.setQueryData(
          ['chat-messages', currentThreadId],
          (old: ChatMessage[] = []) => {
            const lastMsg = old[old.length - 1]
            if (lastMsg && lastMsg.id === assistantMessageId) {
              return [
                ...old.slice(0, -1),
                { ...lastMsg, content: lastMsg.content + chunk },
              ]
            } else {
              return [
                ...old,
                {
                  id: assistantMessageId,
                  thread_id: currentThreadId,
                  role: 'assistant',
                  content: chunk,
                  message_type: 'text',
                  created_at: new Date().toISOString(),
                },
              ]
            }
          }
        )
      })
    },
    onMutate: async (newContent: string) => {
      const currentThreadId = resolvedActiveThreadId!
      await queryClient.cancelQueries({
        queryKey: ['chat-messages', currentThreadId],
      })
      const previousMessages = queryClient.getQueryData<ChatMessage[]>([
        'chat-messages',
        currentThreadId,
      ])

      queryClient.setQueryData(
        ['chat-messages', currentThreadId],
        (old: ChatMessage[] = []) => [
          ...old,
          {
            id: 'temp-user-' + Date.now(),
            thread_id: currentThreadId,
            role: 'user',
            content: newContent,
            message_type: 'text',
            created_at: new Date().toISOString(),
          },
        ]
      )
      return { previousMessages, currentThreadId }
    },
    onSuccess: () => {
      const currentThreadId = resolvedActiveThreadId!
      queryClient.invalidateQueries({
        queryKey: ['chat-messages', currentThreadId],
      })
      queryClient.invalidateQueries({ queryKey: ['chat-threads', visitorId] })
    },
    onError: (err, _newContent, context) => {
      console.error('Message send failed, rolling back UI:', err)
      if (context?.previousMessages && context?.currentThreadId) {
        queryClient.setQueryData(
          ['chat-messages', context.currentThreadId],
          context.previousMessages
        )
      }
    },
  })

  return {
    visitorId,
    visitorName,
    visitorEmail,
    isVisitorModalOpen,
    registerVisitor,
    threads,
    activeThreadId: resolvedActiveThreadId,
    setActiveThreadId,
    isLoadingThreads,
    startNewThread,
    isCreatingThread,
    messages,
    isLoadingMessages,
    sendMessage,
    isSendingMessage,
  }
}
