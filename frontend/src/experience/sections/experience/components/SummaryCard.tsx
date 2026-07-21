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
      className="h-auto lg:h-full w-full flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 glass-card rounded-3xl lg:rounded-4xl p-4 sm:p-10 lg:p-14 text-center relative overflow-hidden group"
      role="region"
      aria-label="Career Statistics"
    >
      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-white/5 shadow-sm flex items-center justify-center lg:mb-2 group-hover:scale-105 transition-transform duration-500 shrink-0">
        <Briefcase
          size={22}
          strokeWidth={1.5}
          className="text-[#FF6B00] lg:w-5 lg:h-5"
          aria-hidden="true"
        />
      </div>

      <div className="hidden sm:block lg:hidden min-w-0 text-left">
        <h3 className="text-base font-semibold tracking-tight text-black dark:text-black opacity-70">
          My Journey
        </h3>
        <p className="text-xs text-(--text) opacity-60 leading-relaxed">
          Continuous learning, impact, and real-world problem solving.
        </p>
      </div>

      <h3 className="hidden lg:block text-xl lg:text-2xl font-semibold tracking-tight mb-2 lg:mb-0 text-black dark:text-black opacity-70">
        My Journey
      </h3>
      <p className="hidden lg:block text-xs lg:text-xs text-(--text) opacity-60 leading-relaxed mb-6 lg:mb-0">
        A journey of continuous learning, building impactful solutions, and
        solving real-world problems.
      </p>

      <div className="flex w-auto lg:w-full justify-center items-center gap-4 sm:gap-6 lg:mt-auto shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl lg:text-1xl font-semibold text-[#FF6B00]">
            {isLoading ? '-' : `${Math.max(1, Math.floor(totalYears))}+`}
          </span>
          <span className="text-[9px] sm:text-[10px] lg:text-xs font-medium text-(--text) opacity-50 mt-1 lg:mt-2">
            Years Experience
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl lg:text-1xl font-semibold text-[#FF6B00]">
            {isLoading ? '-' : Math.max(1, totalCompanies)}
          </span>
          <span className="text-[9px] sm:text-[10px] lg:text-xs font-medium text-(--text) opacity-50 mt-1">
            Companies
          </span>
        </div>
      </div>
    </div>
  )
}
