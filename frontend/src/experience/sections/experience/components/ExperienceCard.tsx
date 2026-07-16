import type { Experience } from '../types'

interface ExperienceCardProps {
  experience: Experience
  index: number
}

export const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  const isCurrent = experience.isCurrent

  // Exact color mapping from your target UI
  const roleColor = isCurrent ? 'text-[#FF6B00]' : 'text-[#A8B1FF]'
  const badgeBg = 'bg-[#FF6B00]/10'
  const badgeText = 'text-[#FF6B00]'

  return (
    <div
      data-index={index}
      className="glass-card w-full rounded-2xl p-6 flex flex-col group transition-all duration-300 hover:shadow-lg dark:hover:shadow-white/5"
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
    </div>
  )
}
