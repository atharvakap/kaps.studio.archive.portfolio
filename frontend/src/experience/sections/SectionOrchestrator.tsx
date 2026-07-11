import { motion, AnimatePresence } from 'framer-motion'
import { useNavigation } from '@/experience/navigation'
import {
  AboutSection,
  WorkSection,
  LabSection,
  ContactSection,
} from './SectionPlaceholders'

export const SectionOrchestrator = () => {
  const { activeSection } = useNavigation()

  // 1. Map the state to the actual component
  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <AboutSection />
      case 'work':
        return <WorkSection />
      case 'lab':
        return <LabSection />
      case 'contact':
        return <ContactSection />
      default:
        return <AboutSection />
    }
  }

  return (
    // 2. The Container: Full height/width, sitting beneath the floating nav
    <main className="relative h-full w-full overflow-hidden bg-paper text-ink pt-24">
      {/* mode="wait" is crucial. It tells Framer Motion to wait for the 
        current component's 'exit' animation to finish completely before 
        mounting the new component and running its 'initial'/'animate'.
      */}
      <AnimatePresence mode="wait">
        <motion.div
          // We use activeSection as the key so React treats every section change as a completely new element
          key={activeSection}

          // --- The Apple-Style Transition Physics ---
          // It fades in and drifts up slightly from 10px below
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          // It fades out and drifts up slightly, creating a continuous forward motion
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}

          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1], // A custom ease-out cubic bezier for a premium snap
          }}
          className="absolute inset-0 h-full w-full"
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
