import type { RefObject } from 'react'
import type { Experience } from '../types'
import { ExperienceCard } from './ExperienceCard'

interface ExperienceListProps {
  experiences?: Experience[]
  isLoading: boolean
  isError?: boolean
  containerRef: RefObject<HTMLDivElement | null>
  activeIndex: number
}

export const ExperienceList = ({
  experiences,
  isLoading,
  isError,
  containerRef,
}: ExperienceListProps) => {
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
    <div
      ref={containerRef}
      className="flex-1 w-full flex flex-col overflow-y-auto glass-scrollbar pr-2 lg:pr-4 relative min-h-0"
    >
      {experiences.map((exp, index) => {
        const isCurrent = exp.isCurrent
        // Match exact target image colors
        const dotColor = isCurrent ? 'bg-[#FF6B00]' : 'bg-[#A8B1FF]'
        const ringColor = isCurrent ? 'ring-[#FF6B00]/20' : 'ring-[#A8B1FF]/20'

        return (
          <div key={exp.id} className="flex gap-4 lg:gap-8 w-full relative p-6">
            {/* LEFT: Dates Column */}
            <div className="hidden lg:flex flex-col items-start w-20 shrink-0 text-xs text-(--text) opacity-60 pt-7">
              <span>{exp.formattedStartDate}</span>
              <span>{exp.formattedEndDate}</span>
            </div>

            {/* MIDDLE: Timeline Spine & Dot */}
            <div className="hidden lg:flex flex-col items-center relative w-6">
              {/* Continuous vertical line (stops at the last dot) */}
              <div
                className={`absolute top-0 w-0.5 bg-black/5 dark:bg-white/10 ${index === experiences.length - 1 ? 'h-9' : 'bottom-0'}`}
              />

              {/* The glowing dot */}
              <div
                className={`relative mt-8 w-3 h-3 rounded-full ${dotColor} ring-[5px] ${ringColor} z-10`}
              />
            </div>

            {/* RIGHT: The Experience Card */}
            <div className="flex-1 pb-6 w-full min-w-0">
              {/* Mobile dates */}
              <div className="lg:hidden text-xs text-(--text) opacity-60 mb-2 mt-4">
                {exp.formattedStartDate} — {exp.formattedEndDate}
              </div>
              <ExperienceCard experience={exp} index={index} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
