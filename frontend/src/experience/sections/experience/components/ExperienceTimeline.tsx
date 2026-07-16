// src/experience/sections/experience/components/ExperienceTimeline.tsx
import { motion } from 'framer-motion'
import type { Experience } from '../types'

interface ExperienceTimelineProps {
  experiences?: Experience[]
  isLoading: boolean
  activeIndex: number
}

export const ExperienceTimeline = ({
  experiences,
  isLoading,
  activeIndex,
}: ExperienceTimelineProps) => {
  return (
    <div className="relative h-full flex flex-col items-center py-4">
      {/* The Central Spine */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white/10" />

      {/* Timeline Dots */}
      <div className="relative flex flex-col justify-around h-full py-8">
        {!isLoading &&
          experiences?.map((_, index) => {
            const isActive = index === activeIndex

            return (
              <div
                key={index}
                className="relative flex items-center justify-center"
              >
                {/* Dot Shadow / Glow */}
                {isActive && (
                  <motion.div
                    layoutId="timeline-dot-glow"
                    className="absolute w-4 h-4 bg-(--accent) rounded-full blur-sm"
                  />
                )}

                {/* Actual Dot */}
                <motion.div
                  className={`w-3 h-3 rounded-full border-2 border-white/20 transition-colors duration-300 ${
                    isActive ? 'bg-(--accent) border-white/40' : 'bg-black/20'
                  }`}
                />
              </div>
            )
          })}
      </div>
    </div>
  )
}
