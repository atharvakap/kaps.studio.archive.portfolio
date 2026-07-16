import { useMemo } from 'react'
import { Briefcase } from 'lucide-react'
import type { Experience } from '../types'
import { calculateExperienceStats } from '../utils/calculateStats'

interface SummaryCardProps {
  experiences?: Experience[]
  isLoading: boolean
}

export const SummaryCard = ({ experiences, isLoading }: SummaryCardProps) => {
  // Phase 10: Memoize the heavy calculation
  const { totalYears, totalCompanies } = useMemo(() => {
    return calculateExperienceStats(experiences)
  }, [experiences])

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center glass-card rounded-4xl p-6 lg:p-4 text-center relative overflow-hidden group"
      role="region"
      aria-label="Career Statistics"
    >
      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white dark:bg-white/5 shadow-sm flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-105 transition-transform duration-500">
        <Briefcase
          size={22}
          strokeWidth={1.5}
          className="text-[#FF6B00] lg:w-7 lg:h-7"
          aria-hidden="true"
        />
      </div>

      <h3 className="text-xl lg:text-2xl font-semibold tracking-tight mb-2 lg:mb-4 text-black dark:text-black opacity-70">
        My Journey
      </h3>
      <p className="text-xs lg:text-xs text-(--text) opacity-60 leading-relaxed mb-6 lg:mb-8">
        A journey of continuous learning, building impactful solutions, and
        solving real-world problems.
      </p>

      <div className="flex w-full justify-center items-center gap-6 mt-auto">
        <div className="flex flex-col items-center">
          <span className="text-2xl lg:text-3xl font-semibold text-[#FF6B00]">
            {isLoading ? '-' : `${Math.max(1, Math.floor(totalYears))}+`}
          </span>
          <span className="text-[10px] lg:text-xs font-medium text-(--text) opacity-50 mt-2">
            Years Experience
          </span>
        </div>

        <div className="w-px h-8 lg:h-10 bg-black/10 dark:bg-white/10" />

        <div className="flex flex-col items-center">
          <span className="text-2xl lg:text-3xl font-semibold text-[#FF6B00]">
            {isLoading ? '-' : Math.max(1, totalCompanies)}
          </span>
          <span className="text-[10px] lg:text-xs font-medium text-(--text) opacity-50 mt-1">
            Companies
          </span>
        </div>
      </div>
    </div>
  )
}
