import type { RefObject } from 'react'
import { motion, type Variants } from 'framer-motion' // <-- Imported Variants type
import type { Experience } from '../types'
import { ExperienceCard } from './ExperienceCard'

interface ExperienceListProps {
  experiences?: Experience[]
  isLoading: boolean
  isError?: boolean
  containerRef: RefObject<HTMLDivElement | null>
  activeIndex: number
}

// Strictly typed as Variants
const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.4 },
  },
}

// Strictly typed as Variants
const spineVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  show: {
    height: '100%',
    opacity: 1,
    transition: { duration: 1, ease: 'easeInOut' },
  },
}

export const ExperienceList = ({
  experiences,
  isLoading,
  isError,
  containerRef,
  activeIndex,
}: ExperienceListProps) => {
  // Restored actual JSX instead of pseudo-code
  if (isLoading) {
    return (
      <div className="flex-1 w-full flex flex-col gap-6 overflow-y-auto glass-scrollbar pr-2 lg:pr-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full h-32 glass-card rounded-2xl animate-pulse bg-black/5 dark:bg-white/5"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <p className="text-sm font-medium text-red-500/80">
          Unable to load experiences.
        </p>
      </div>
    )
  }

  if (!experiences?.length) {
    return (
      <div className="flex-1 flex items-center justify-center font-mono text-sm opacity-50">
        [ No experiences found ]
      </div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      variants={listVariants}
      initial="hidden"
      animate="show"
      className="flex-1 w-full flex flex-col gap-6 overflow-y-auto glass-scrollbar pr-6 pl-2 relative min-h-0"
    >
      {experiences.map((exp, index) => {
        const isCurrent = exp.isCurrent
        const isActive = index === activeIndex // <-- Now we use activeIndex!

        const dotColor = isCurrent ? 'bg-[#FF6B00]' : 'bg-[#A8B1FF]'

        // The active scrolled item gets a much stronger ring glow
        const ringColor = isActive
          ? isCurrent
            ? 'ring-[#FF6B00]/40'
            : 'ring-[#A8B1FF]/40'
          : isCurrent
            ? 'ring-[#FF6B00]/10'
            : 'ring-[#A8B1FF]/10'

        return (
          <div
            key={exp.id}
            className="flex gap-4 lg:gap-8 w-full relative pr-2"
          >
            {/* LEFT: Dates Column */}
            <div className="hidden lg:flex flex-col items-start w-20 shrink-0 text-xs text-(--text) opacity-60 pt-7">
              <span>{exp.formattedStartDate}</span>
              <span>{exp.formattedEndDate}</span>
            </div>

            {/* MIDDLE: Timeline Spine & Dot */}
            <div className="hidden lg:flex flex-col items-center relative w-6">
              {/* Animated Line */}
              <motion.div
                variants={spineVariants}
                className={`absolute top-0 w-0.5 bg-black/5 dark:bg-black/10 ${index === experiences.length - 1 ? 'h-9' : 'bottom-0'}`}
              />

              {/* Dot with spring entrance and dynamic ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: 0.5 + index * 0.15,
                }}
                className={`relative mt-8 w-3 h-3 rounded-full ${dotColor} ring-[5px] ${ringColor} transition-all duration-300 z-10`}
              />
            </div>

            {/* RIGHT: The Experience Card */}
            <div className="flex-1 pb-6 w-full min-w-0">
              <div className="lg:hidden text-xs text-(--text) opacity-60 mb-2 mt-4">
                {exp.formattedStartDate} — {exp.formattedEndDate}
              </div>
              <ExperienceCard experience={exp} index={index} />
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
