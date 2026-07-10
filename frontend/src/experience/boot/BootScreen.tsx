import { AnimatePresence, motion } from 'framer-motion'
import { useBoot } from './useBoot'
import { Terminal } from './Terminal'

interface BootScreenProps {
  isAppReady: boolean // <-- New prop
  children: React.ReactNode
}

export const BootScreen = ({ isAppReady, children }: BootScreenProps) => {
  // Pass app readiness into the hook
  const { bootState, markSequenceComplete, finishBoot } = useBoot(isAppReady)

  return (
    <>
      <AnimatePresence onExitComplete={finishBoot}>
        {bootState === 'booting' && (
          <motion.div
            key="boot-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper text-ink"
          >
            {/* Pass markSequenceComplete instead of markReady */}
            <Terminal onComplete={markSequenceComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`transition-opacity duration-500 h-full w-full ${
          bootState === 'finished' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </>
  )
}
