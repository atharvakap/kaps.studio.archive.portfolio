import { motion, AnimatePresence } from 'framer-motion'
import { useNavigation } from '@/experience/navigation'
import { AboutSection } from './about/AboutSection'
import { SkillsSection } from './skills/SkillsSection'
import { ExperienceSection } from './experience'
import { ProjectsSection } from './projects/ProjectsSection'
import { TestimonialsSection } from './testimonials/TestimonialsSection'
import { VirtualMeSection } from './virtual-me/VirtualMeSection' // <-- IMPORT THE REAL VIRTUAL ME SECTION

export const SectionOrchestrator = () => {
  const { activeSection, isVirtualMeActive } = useNavigation()

  const renderSection = () => {
    // 1. Intercept for Virtual Me chat interface
    if (isVirtualMeActive) {
      return <VirtualMeSection />
    }

    // 2. Standard Portfolio Sections
    switch (activeSection) {
      case 'about':
        return <AboutSection />
      case 'skills':
        return <SkillsSection />
      case 'experience':
        return <ExperienceSection />
      case 'projects':
        return <ProjectsSection />
      case 'testimonials':
        return <TestimonialsSection />
      default:
        return <AboutSection />
    }
  }

  const animationKey = isVirtualMeActive ? 'virtual-me' : activeSection

  return (
    <main className="relative h-full w-full overflow-hidden text-ink">
      <AnimatePresence mode="wait">
        <motion.div
          key={animationKey}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full pt-26"
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
