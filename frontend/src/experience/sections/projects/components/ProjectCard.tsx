import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Sparkles, Image as ImageIcon } from 'lucide-react'
import type { Project } from '../types'

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = memo(({ project }: ProjectCardProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="w-(--project-card-width,20rem) h-[clamp(18.5rem,56svh,21.25rem)] shrink-0 flex flex-col bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-3 sm:p-4 shadow-lg hover:shadow-2xl transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/50"
      tabIndex={0}
      role="article"
      aria-labelledby={`project-title-${project.id}`}
    >
      <div className="relative w-full h-[clamp(6.75rem,22svh,8.75rem)] rounded-2xl overflow-hidden bg-slate-100 mb-3 sm:mb-4 shrink-0 shadow-inner">
        {project.featured && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/5 shadow-sm text-slate-800">
            <Sparkles size={14} className="text-[#FF6B00]" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wide">
              Featured
            </span>
          </div>
        )}

        {!project.image_url || imageError ? (
          <div className="w-full h-full flex items-center justify-center opacity-20 text-slate-800">
            <ImageIcon size={32} />
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-slate-200" />
            )}
            <img
              src={project.image_url}
              alt={project.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        )}
      </div>

      <div className="flex flex-col flex-1 px-1">
        <h3
          id={`project-title-${project.id}`}
          className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-800 mb-1 line-clamp-2"
        >
          {project.name}
        </h3>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-light line-clamp-2 mb-2 sm:mb-3">
          {project.description}
        </p>

        {/* SKILLS RENDER BLOCK */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto mb-3 sm:mb-4 overflow-hidden">
            {project.skills.slice(0, 3).map((skill, index) => (
              <span
                // Fallback key just in case 'id' is mapped differently
                key={skill.id || skill.skill_id || index}
                className="px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/50"
              >
                {/* Look for 'name' first, fallback to 'skill_name' */}
                {skill.name || skill.skill_name || 'Skill'}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2 mt-auto pb-1 shrink-0">
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-700 hover:text-black transition-colors"
            >
              <GithubIcon size={16} />
              <span>GitHub</span>
              <ExternalLink size={12} className="opacity-50" />
            </a>
          ) : (
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-400 opacity-50 cursor-not-allowed">
              <GithubIcon size={16} />
              <span>Private</span>
            </div>
          )}

          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-700 hover:text-[#FF6B00] transition-colors"
            >
              <span>Live Demo</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-400 opacity-50 cursor-not-allowed">
              <span>No Demo</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
})

ProjectCard.displayName = 'ProjectCard'
