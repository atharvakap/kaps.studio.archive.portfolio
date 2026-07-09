import { AnimatePresence, motion } from 'framer-motion'
import { useBoot } from './useBoot'

interface BootScreenProps {
  children: React.ReactNode
}

export const BootScreen = ({ children }: BootScreenProps) => {
  const { bootState, finishBoot } = useBoot()

  return (
    <>
      <AnimatePresence onExitComplete={finishBoot}>
        {bootState === 'booting' && (
          <motion.div
            key="boot-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} // 300ms fade as per your design spec
            className="fixed inset-0 z-50 flex items-center justify-center bg-paper text-ink"
          >
            {/* This is a temporary placeholder. 
              In Step 0.5, we will drop the actual Terminal component here.
            */}
            <div className="font-mono text-xl">
              <span>atharva@home:~$ </span>
              <span className="animate-blink">█</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The actual portfolio mounts behind the boot screen immediately, but remains hidden until finished */}
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
