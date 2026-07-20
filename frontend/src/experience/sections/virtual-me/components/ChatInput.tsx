import { useState, useRef, useEffect } from 'react'
import { SendHorizontal, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [text])

  const handleSend = () => {
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('') // Instantly clear input on send

    // Reset height manually after clearing text
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <div className="max-w-3xl mx-auto relative group w-full pointer-events-auto">
      <div className="absolute -inset-0.5 bg-linear-to-r from-[#FF6B00]/20 to-orange-400/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>

      <div className="relative flex items-end gap-2 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-2 shadow-sm focus-within:shadow-md focus-within:border-white/90 transition-all pointer-events-auto">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Shift + Enter creates a new line automatically, pure Enter sends the message
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Ask me anything..."
          disabled={disabled}
          className="flex-1 max-h-32 min-h-11 bg-transparent border-none resize-none px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 scrollbar-none disabled:opacity-50 pointer-events-auto"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={text.trim().length === 0 || disabled}
          className={cn(
            'p-3 rounded-xl flex items-center justify-center transition-all shrink-0 mb-0.5 pointer-events-auto',
            text.trim().length > 0 && !disabled
              ? 'bg-[#FF6B00] text-white shadow-md hover:bg-[#FF6B00]/90 active:scale-95'
              : 'bg-slate-100 text-slate-300'
          )}
        >
          {disabled && text.trim().length > 0 ? (
            <Loader2 size={18} className="animate-spin text-slate-400" />
          ) : (
            <SendHorizontal
              size={18}
              className={text.trim().length > 0 ? 'translate-x-0.5' : ''}
            />
          )}
        </button>
      </div>
    </div>
  )
}
