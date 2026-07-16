import { memo } from 'react'
import { motion, type Variants } from 'framer-motion'
import type { Experience } from '../types'

interface ExperienceCardProps {
  experience: Experience
  index: number
}

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

// Phase 10: React.memo prevents the card from re-rendering during scroll events
export const ExperienceCard = memo(
  ({ experience, index }: ExperienceCardProps) => {
    const isCurrent = experience.isCurrent
    const roleColor = isCurrent ? 'text-[#FF6B00]' : 'text-[#A8B1FF]'
    const badgeBg = 'bg-[#FF6B00]/10'
    const badgeText = 'text-[#FF6B00]'

    return (
      <motion.div
        variants={cardVariants}
        data-index={index}
        role="listitem" // Phase 9: A11y Semantic role
        tabIndex={0} // Phase 9: Keyboard navigable
        // Phase 11: Added focus-visible for keyboard users and refined hover border/shadow
        className="glass-card w-[calc(100%-8px)] rounded-2xl p-6 flex flex-col group transition-all duration-300 hover:shadow-lg dark:hover:shadow-white/5 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/50"
        aria-label={`${experience.role} at ${experience.company}`}
      >
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-black dark:text-black opacity-70 tracking-tight">
            {experience.company}
          </h3>

          {isCurrent && (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-wide ${badgeBg} ${badgeText}`}
              aria-hidden="true" // Hide from screen readers to reduce redundancy
            >
              Current
            </span>
          )}
        </div>

        <h4 className={`text-sm font-medium mb-3 ${roleColor}`}>
          {experience.role}
        </h4>

        <p className="text-sm text-(--text) opacity-70 leading-relaxed font-light">
          {experience.description}
        </p>
      </motion.div>
    )
  }
)

// Display name required for memoized components in DevTools
ExperienceCard.displayName = 'ExperienceCard'
