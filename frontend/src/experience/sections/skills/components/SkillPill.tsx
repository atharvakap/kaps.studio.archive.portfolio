import { motion, type Variants } from 'framer-motion'
import type { Skill } from '../types'

interface SkillPillProps {
  skill: Skill
}

export const SkillPill = ({ skill }: SkillPillProps) => {
  // 1. Updated proficiency style colors for better visibility
  const getProficiencyStyle = (level: string | number | undefined) => {
    if (!level) return 'bg-black/50 dark:bg-white/80' // Darker grey for light mode
    const normalizedLevel = String(level).toLowerCase()
    switch (normalizedLevel) {
      case 'master':
      case 'expert':
      case '5':
        return 'bg-(--accent) shadow-[0_0_8px_var(--accent-bg)]'
      case 'advanced':
      case '4':
        return 'bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
      default:
        return 'bg-black/50 dark:bg-white/80' // Darker grey for light mode
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -2,
        scale: 1.02,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      }}
      // Refined styling, padding, smaller dot, and borders
      className="glass-pill flex items-center gap-2 px-3 py-1 cursor-default rounded-full group border border-black/10 dark:border-white/10"
    >
      <div
        className={`w-1 h-1 rounded-full ${getProficiencyStyle(skill.proficiency)}`}
      />

      <span className="text-xs font-light text-(--text) tracking-wide group-hover:text-(--text-h) transition-colors">
        {skill.name}
      </span>

      {/* 2. Changed number text span: Removed opacity-0 and group-hover:opacity-40, always use text color */}
      <span className="text-[9px] font-mono uppercase tracking-widest ml-0.5 text-(--text)">
        {skill.proficiency}
      </span>
    </motion.div>
  )
}
