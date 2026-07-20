import { useState } from 'react'
import { Copy, Check, RotateCw, ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageToolbarProps {
  content: string
  isLast: boolean
  onRegenerate?: () => void
  onFeedback?: (type: 'like' | 'dislike') => void
}

export const MessageToolbar = ({
  content,
  isLast,
  onRegenerate,
  onFeedback,
}: MessageToolbarProps) => {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type)
    if (onFeedback) onFeedback(type)
  }

  return (
    <div className="flex items-center gap-1 mt-2 ml-1 text-slate-400">
      <button
        onClick={handleCopy}
        className="p-1.5 hover:bg-white/50 hover:text-slate-600 rounded-md transition-colors"
        title="Copy message"
      >
        {copied ? (
          <Check size={14} className="text-green-500" />
        ) : (
          <Copy size={14} />
        )}
      </button>

      {/* Only show Regenerate on the very last message */}
      {isLast && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="p-1.5 hover:bg-white/50 hover:text-slate-600 rounded-md transition-colors"
          title="Regenerate response"
        >
          <RotateCw size={14} />
        </button>
      )}

      {/* Using built-in Tailwind shorthand w-px instead of arbitrary bracket notation */}
      <div className="w-px h-3 bg-slate-300 mx-1 rounded-full" />

      <button
        onClick={() => handleFeedback('like')}
        className={cn(
          'p-1.5 hover:bg-white/50 hover:text-[#FF6B00] rounded-md transition-colors',
          feedback === 'like' && 'text-[#FF6B00] bg-white/50'
        )}
        title="Helpful"
      >
        <ThumbsUp size={14} />
      </button>

      <button
        onClick={() => handleFeedback('dislike')}
        className={cn(
          'p-1.5 hover:bg-white/50 hover:text-red-500 rounded-md transition-colors',
          feedback === 'dislike' && 'text-red-500 bg-white/50'
        )}
        title="Not helpful"
      >
        <ThumbsDown size={14} />
      </button>
    </div>
  )
}
