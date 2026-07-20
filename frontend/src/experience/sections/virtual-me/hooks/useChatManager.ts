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

  const { data: threads = [], isLoading: isLoadingThreads } = useQuery<
    ChatThread[]
  >({
    queryKey: ['chat-threads', visitorId],
    queryFn: () => fetchThreads(visitorId!),
    enabled: !!visitorId,
  })

  const resolvedActiveThreadId =
    activeThreadId ?? (threads.length > 0 ? threads[0].id : null)

  const { mutate: startNewThread, isPending: isCreatingThread } = useMutation({
    mutationFn: (title: string | undefined) => createThread(visitorId!, title),
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

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<
    ChatMessage[]
  >({
    queryKey: ['chat-messages', resolvedActiveThreadId],
    queryFn: () => fetchMessages(resolvedActiveThreadId!),
    enabled: !!resolvedActiveThreadId,
    staleTime: 1000 * 60,
  })

  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: async (content: string) => {
      const assistantMessageId = 'temp-assistant-' + Date.now()

      return sendApiMessage(resolvedActiveThreadId!, content, (chunk) => {
        queryClient.setQueryData(
          ['chat-messages', resolvedActiveThreadId],
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
                  thread_id: resolvedActiveThreadId!,
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
      await queryClient.cancelQueries({
        queryKey: ['chat-messages', resolvedActiveThreadId],
      })
      const previousMessages = queryClient.getQueryData<ChatMessage[]>([
        'chat-messages',
        resolvedActiveThreadId,
      ])

      // Instantly show the user's message
      queryClient.setQueryData(
        ['chat-messages', resolvedActiveThreadId],
        (old: ChatMessage[] = []) => [
          ...old,
          {
            id: 'temp-user-' + Date.now(),
            thread_id: resolvedActiveThreadId!,
            role: 'user',
            content: newContent,
            message_type: 'text',
            created_at: new Date().toISOString(),
          },
        ]
      )
      return { previousMessages }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat-messages', resolvedActiveThreadId],
      })
      queryClient.invalidateQueries({ queryKey: ['chat-threads', visitorId] })
    },
    onError: (err, _newContent, context) => {
      console.error('Message send failed, rolling back UI:', err)
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ['chat-messages', resolvedActiveThreadId],
          context.previousMessages
        )
      }
    },
  })

  return {
    visitorId,
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
