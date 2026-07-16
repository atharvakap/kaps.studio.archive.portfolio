// src/experience/sections/experience/components/SummaryCard.tsx
import { Briefcase } from 'lucide-react'
import type { Experience } from '../types'
import { calculateExperienceStats } from '../utils/calculateStats'

interface SummaryCardProps {
  experiences?: Experience[]
  isLoading: boolean
}

export const SummaryCard = ({ experiences, isLoading }: SummaryCardProps) => {
  const { totalYears, totalCompanies } = calculateExperienceStats(experiences)

  return (
    <div className="h-full w-full flex flex-col items-center justify-center glass-card rounded-4xl p-8 text-center relative overflow-hidden group">
      {/* Circular Icon */}
      <div className="w-16 h-16 rounded-full bg-black opacity-70 dark:bg-white/5 shadow-sm flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500">
        <Briefcase size={26} strokeWidth={1.5} className="text-[#FF6B00]" />
      </div>

      {/* Typography */}
      <h3 className="text-2xl font-semibold tracking-tight mb-4 text-black dark:text-black opacity-70">
        My Journey
      </h3>
      <p className="text-sm text-(--text) opacity-60 leading-relaxed mb-10">
        A journey of continuous learning, building impactful solutions, and
        solving real-world problems.
      </p>

      {/* Split Stats */}
      <div className="flex w-full justify-center items-center gap-6 mt-auto">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-semibold text-[#FF6B00]">
            {isLoading ? '-' : `${Math.max(1, Math.floor(totalYears))}+`}
          </span>
          <span className="text-xs font-medium text-(--text) opacity-50 mt-1">
            Years Experience
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-10 bg-black/10 dark:bg-white/10" />

        <div className="flex flex-col items-center">
          <span className="text-3xl font-semibold text-[#FF6B00]">
            {isLoading ? '-' : Math.max(1, totalCompanies)}
          </span>
          <span className="text-xs font-medium text-(--text) opacity-50 mt-1">
            Companies
          </span>
        </div>
      </div>
    </div>
  )
}
