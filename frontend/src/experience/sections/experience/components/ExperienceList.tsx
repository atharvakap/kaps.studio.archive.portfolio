import type { RefObject } from 'react'
import { motion, type Variants, useReducedMotion } from 'framer-motion'
import type { Experience } from '../types'
import { ExperienceCard } from './ExperienceCard'

interface ExperienceListProps {
  experiences?: Experience[]
  isLoading: boolean
  isError?: boolean
  containerRef: RefObject<HTMLDivElement | null>
  activeIndex: number
}

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.4 },
  },
}

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
  // Phase 9: Respect user OS preferences for reduced motion
  const prefersReducedMotion = useReducedMotion()

  if (isLoading) {
    return (
      <div
        className="flex-1 w-full flex flex-col gap-6 overflow-y-auto glass-scrollbar pr-2 lg:pr-4"
        aria-busy="true"
      >
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
      <div
        className="flex-1 flex items-center justify-center p-6 text-center"
        role="alert"
      >
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
      variants={prefersReducedMotion ? {} : listVariants} // Disable stagger if requested
      initial="hidden"
      animate="show"
      role="list" // Phase 9: Semantic list for screen readers
      aria-label="Professional Experience Timeline"
      className="flex-1 w-full flex flex-col gap-6 overflow-y-auto glass-scrollbar pr-6 pl-2 relative min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/10 rounded-2xl"
      tabIndex={0} // Allows keyboard users to scroll the container
    >
      {experiences.map((exp, index) => {
        const isCurrent = exp.isCurrent
        const isActive = index === activeIndex

        const dotColor = isCurrent ? 'bg-[#FF6B00]' : 'bg-[#A8B1FF]'
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
            <div
              className="hidden lg:flex flex-col items-start w-20 shrink-0 text-xs text-(--text) opacity-60 pt-7"
              aria-hidden="true"
            >
              <span>{exp.formattedStartDate}</span>
              <span>{exp.formattedEndDate}</span>
            </div>

            <div
              className="flex flex-col items-center relative w-6 shrink-0"
              aria-hidden="true"
            >
              <motion.div
                variants={prefersReducedMotion ? {} : spineVariants}
                className={`absolute top-0 w-0.5 bg-black/5 dark:bg-black/10 ${index === experiences.length - 1 ? 'h-9' : 'bottom-0'}`}
              />
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : { scale: 0, opacity: 0 }
                }
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

            <div className="flex-1 pb-6 pt-4 w-full min-w-0">
              <div
                className="lg:hidden text-[10px] font-mono text-(--text) opacity-60 mb-2 mt-7"
                aria-hidden="true"
              >
                {exp.formattedStartDate} — {exp.formattedEndDate}
              </div>
              {/* The heavily optimized, accessible card */}
              <ExperienceCard experience={exp} index={index} />
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
