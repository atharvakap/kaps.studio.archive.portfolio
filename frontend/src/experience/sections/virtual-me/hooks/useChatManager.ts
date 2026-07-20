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

  const [visitorId, setVisitorId] = useState<string | null>(() =>
    sessionStorage.getItem('virtual_me_visitor_id')
  )
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)

  // 1. Initialize visitor session
  useEffect(() => {
    if (!visitorId) {
      createVisitor()
        .then((visitor) => {
          sessionStorage.setItem('virtual_me_visitor_id', visitor.id)
          setVisitorId(visitor.id)
        })
        .catch(console.error)
    }
  }, [visitorId])

  // 2. Fetch all threads for the visitor
  const { data: threads = [], isLoading: isLoadingThreads } = useQuery<
    ChatThread[]
  >({
    queryKey: ['chat-threads', visitorId],
    queryFn: () => fetchThreads(visitorId!),
    enabled: !!visitorId,
  })

  // Ensure activeThreadId defaults to the top thread if none is selected,
  // but respects explicit selection when clicking history items or new chat.
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
      // Explicitly set this as the active thread so it doesn't bounce back
      setActiveThreadId(newThread.id)
      queryClient.setQueryData(['chat-messages', newThread.id], [])
      queryClient.invalidateQueries({ queryKey: ['chat-threads', visitorId] })
    },
  })

  // 4. Fetch messages for the currently active thread
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<
    ChatMessage[]
  >({
    queryKey: ['chat-messages', resolvedActiveThreadId],
    queryFn: () => fetchMessages(resolvedActiveThreadId!),
    enabled: !!resolvedActiveThreadId,
    staleTime: 1000 * 60,
  })

  // 5. Send Message & Handle Automatic Title Renaming
  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: async (content: string) => {
      const currentThreadId = resolvedActiveThreadId!
      const assistantMessageId = 'temp-assistant-' + Date.now()

      // Check if this thread is still titled "New Conversation" -> Auto-rename it to the first prompt
      const currentThread = threads.find((t) => t.id === currentThreadId)
      if (currentThread && currentThread.title === 'New Conversation') {
        const newTitle =
          content.length > 30 ? content.substring(0, 30) + '...' : content
        // Optimistically update thread title in cache
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

      // Instantly show the user's message optimistically
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
    threads,
    activeThreadId: resolvedActiveThreadId,
    setActiveThreadId, // Passed to sidebar to allow clicking history items!
    isLoadingThreads,
    startNewThread,
    isCreatingThread,
    messages,
    isLoadingMessages,
    sendMessage,
    isSendingMessage,
  }
}
