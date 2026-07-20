import { useState } from 'react'
import { Sparkles } from 'lucide-react'

interface VisitorModalProps {
  isOpen: boolean
  onSubmit: (name: string, email: string) => void
}

export const VisitorModal = ({ isOpen, onSubmit }: VisitorModalProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Please provide both your name and email.')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    onSubmit(name.trim(), email.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-md border border-white/60 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#FF6B00] to-orange-500 flex items-center justify-center mb-4 shadow-md">
          <Sparkles className="text-white" size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Talk to Virtual Me
        </h3>
        <p className="text-slate-600 text-sm mb-6">
          Please enter your name and email to start a conversation with
          Atharva's AI replica.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Smith"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 text-sm transition-all"
            />
          </div>

          {error && (
            <p className="text-rose-500 text-xs font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 bg-linear-to-r from-[#FF6B00] to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:opacity-95 transition-all text-sm"
          >
            Start Conversation
          </button>
        </form>
      </div>
    </div>
  )
}
