import { motion, AnimatePresence } from 'framer-motion'
import { useNavigation } from '@/experience/navigation'
import { AboutSection } from './about/AboutSection'
import {
  SkillsSection,
  ExperienceSection,
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
    // 1. Removed pt-24 from the main tag
    <main className="relative h-full w-full overflow-hidden text-ink">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}

          // 2. Added pt-32 (128px) here to push the content down
          //    below the absolute top boundary!
          className="absolute inset-0 h-full w-full pt-26"
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
