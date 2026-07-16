import { motion, AnimatePresence } from 'framer-motion'
import { useNavigation } from '@/experience/navigation'
import { AboutSection } from './about/AboutSection'

// 1. IMPORT THE REAL COMPONENT HERE
import { SkillsSection } from './skills/SkillsSection'

import { ExperienceSection } from './experience'

// 2. REMOVE SkillsSection FROM THE PLACEHOLDERS
import {
  ProjectsSection,
  CertsSection,
  EducationSection,
} from './SectionPlaceholders'

export const SectionOrchestrator = () => {
  const { activeSection } = useNavigation()

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <AboutSection />
      case 'skills':
        return <SkillsSection />
      case 'experience':
        return <ExperienceSection />
      case 'projects':
        return <ProjectsSection />
      case 'certs':
        return <CertsSection />
      case 'education':
        return <EducationSection />
      default:
        return <AboutSection />
    }
  }

  return (
    <main className="relative h-full w-full overflow-hidden text-ink">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
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
