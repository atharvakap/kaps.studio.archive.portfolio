import { motion, type Variants } from 'framer-motion' // <-- Imported Variants type
import type { Experience } from '../types'

interface ExperienceCardProps {
  experience: Experience
  index: number
}

// Strictly typed as Variants
const cardVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  const isCurrent = experience.isCurrent
  const roleColor = isCurrent ? 'text-[#FF6B00]' : 'text-[#A8B1FF]'
  const badgeBg = 'bg-[#FF6B00]/10'
  const badgeText = 'text-[#FF6B00]'

  return (
    <motion.div
      variants={cardVariants}
      data-index={index}
      className="glass-card w-[calc(100%-8px)] rounded-2xl p-6 mt-5 flex flex-col group transition-all duration-300 hover:shadow-lg dark:hover:shadow-white/5"
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-lg font-semibold text-black dark:text-black opacity-70 tracking-tight">
          {experience.company}
        </h3>

        {isCurrent && (
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-wide ${badgeBg} ${badgeText}`}
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
