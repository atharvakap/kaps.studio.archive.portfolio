import { useRef } from 'react'
import { useExperience } from './hooks/useExperience'
import { useTimelineSync } from './hooks/useTimelineSync'
import { SummaryCard } from './components/SummaryCard'
import { ExperienceList } from './components/ExperienceList'

export const ExperienceSection = () => {
  const { data: experiences, isLoading, isError } = useExperience()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // We still track scroll position for potential future scroll-spy effects
  const activeIndex = useTimelineSync(
    scrollContainerRef,
    experiences?.length || 0
  )

  return (
    <section className="relative h-full w-full flex flex-col items-center px-6 md:px-12 lg:px-24 pb-8 pt-2">
      {/* SECTION HEADING */}
      <div className="flex flex-col items-center text-center max-w-2xl mb-4 space-y-4 shrink-0">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-2 opacity-70">
          Experience
        </h1>
        <h2 className="text-sm md:text-base font-mono uppercase tracking-[0.2em] opacity-60 m-4">
          Professional Journey
        </h2>
        <div className="w-12 h-1 bg-(--accent) rounded-full opacity-80 mt-0" />
      </div>

      {/* 2-COLUMN MASTER CONTAINER */}
      <div className="w-full max-w-6xl flex-1 min-h-0 glass-slider rounded-[40px] p-6 lg:p-10 flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-12 relative overflow-hidden">
        {/* Left: Summary Card */}
        <div className="flex flex-col shrink-0 min-h-50 lg:min-h-0">
          <SummaryCard experiences={experiences} isLoading={isLoading} />
        </div>

        {/* Right: Integrated Timeline & List */}
        <div className="flex-1 flex flex-col min-w-0 min-h-75 lg:min-h-0 relative">
          <ExperienceList
            experiences={experiences}
            isLoading={isLoading}
            isError={isError}
            containerRef={scrollContainerRef}
            activeIndex={activeIndex}
          />
        </div>
      </div>
    </section>
  )
}
