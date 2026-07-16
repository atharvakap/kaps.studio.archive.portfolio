import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useExperience } from './hooks/useExperience'
import { useTimelineSync } from './hooks/useTimelineSync'
import { SummaryCard } from './components/SummaryCard'
import { ExperienceList } from './components/ExperienceList'

export const ExperienceSection = () => {
  const { data: experiences, isLoading, isError } = useExperience()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeIndex = useTimelineSync(
    scrollContainerRef,
    experiences?.length || 0
  )

  return (
    <section className="relative h-full w-full flex flex-col items-center px-4 md:px-12 lg:px-24 pb-8 pt-2">
      {/* SECTION HEADING */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center text-center max-w-2xl mb-2 lg:mb-4 space-y-2 lg:space-y-4 shrink-0"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight opacity-70">
          Experience
        </h1>
        <h2 className="text-xs md:text-base font-mono uppercase tracking-[0.2em] opacity-60 m-2 lg:m-4">
          Professional Journey
        </h2>
        <div className="w-10 lg:w-12 h-1 bg-(--accent) rounded-full opacity-80" />
      </motion.div>

      {/* 2-COLUMN MASTER CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl flex-1 min-h-0 glass-slider rounded-3xl lg:rounded-4xl p-4 lg:p-10 flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-12 relative overflow-hidden mt-4 lg:mt-0"
      >
        <div className="flex flex-col shrink-0">
          <SummaryCard experiences={experiences} isLoading={isLoading} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
          <ExperienceList
            experiences={experiences}
            isLoading={isLoading}
            isError={isError}
            containerRef={scrollContainerRef}
            activeIndex={activeIndex}
          />
        </div>
      </motion.div>
    </section>
  )
}
