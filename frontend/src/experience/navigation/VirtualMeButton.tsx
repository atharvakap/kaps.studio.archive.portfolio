import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useNavigation } from './useNavigation'

export const VirtualMeButton = () => {
  const { isVirtualMeActive, setIsVirtualMeActive } = useNavigation()

  return (
    <div className="pointer-events-auto ml-auto shrink-0">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsVirtualMeActive(!isVirtualMeActive)}
        className={`flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 backdrop-blur-md border ${
          isVirtualMeActive
            ? 'bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.15)]'
            : 'glass-panel bg-white/40 hover:bg-white/60 text-slate-600 hover:text-slate-900'
        }`}
      >
        <Sparkles
          size={16}
          className={isVirtualMeActive ? 'animate-pulse' : ''}
        />
        <span className="text-sm font-semibold tracking-wide hidden md:block">
          Talk to Virtual Me
        </span>
        <span className="text-xs sm:text-sm font-semibold tracking-wide md:hidden">
          AI Chat
        </span>
      </motion.button>
    </div>
  )
}
