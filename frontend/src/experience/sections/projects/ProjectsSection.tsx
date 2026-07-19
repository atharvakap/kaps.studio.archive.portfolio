import { useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useProjects } from './hooks/useProjects'
import { ProjectCard } from './components/ProjectCard'

export const ProjectsSection = () => {
  const { data: projects, isLoading, isError } = useProjects()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  const featuredProjects = projects?.filter((p) => p.featured) || []

  useEffect(() => {
    const container = carouselRef.current
    if (!container || featuredProjects.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.getAttribute('data-index')))
          }
        })
      },
      { root: container, rootMargin: '0px', threshold: 0.6 }
    )

    // Specifically target the data-index elements to avoid observing spacers/buttons
    const cards = container.querySelectorAll('[data-index]')
    cards.forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [featuredProjects.length])

  const scrollLeft = () =>
    carouselRef.current?.scrollBy({ left: -400, behavior: 'smooth' })
  const scrollRight = () =>
    carouselRef.current?.scrollBy({ left: 400, behavior: 'smooth' })
  const scrollToProject = (index: number) => {
    const child = carouselRef.current?.querySelector(
      `[data-index="${index}"]`
    ) as HTMLElement
    child?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }

  if (isLoading || isError || !featuredProjects.length) {
    return (
      <section className="h-full w-full flex items-center justify-center font-mono opacity-50 text-slate-800">
        Loading Projects...
      </section>
    )
  }

  return (
    <section className="relative h-full w-full flex flex-col items-center pt-4 md:pt-8 pb-4 overflow-hidden">
      <motion.div
        initial={
          prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="shrink-0 flex flex-col items-center text-center max-w-2xl px-4 z-10"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 mb-1">
          Projects
        </h1>
        <h2 className="text-xs md:text-sm font-medium text-slate-500 mb-3">
          Evidence of Execution
        </h2>

        <div className="flex items-center w-full max-w-37.5 justify-center gap-3 mb-3">
          <div className="h-px bg-slate-300 flex-1" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]/60 ring-4 ring-[#FF6B00]/10" />
          <div className="h-px bg-slate-300 flex-1" />
        </div>

        <p className="hidden md:block text-sm text-slate-500 leading-relaxed font-light">
          A selection of projects that reflect my passion for building
          impactful, scalable and user-centric solutions.
        </p>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative w-full flex-1 min-h-0 mt-2 md:mt-4 mb-2 flex items-center group"
      >
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-4 lg:left-8 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-black/5 text-slate-600 hover:text-black transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        {/* 
            THE FIX: Dynamic Padding for Center Alignment
            - Mobile card is 320px wide (half is 160px)
            - Desktop card is 380px wide (half is 190px)
            By padding the container with exactly `50% - halfCardWidth`, we force the first card to snap to the dead center of the screen, creating a cover-flow effect. 
            If there is only 1 card, it sits perfectly in the middle with no left-bias.
        */}
        <div
          ref={carouselRef}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory gap-6 items-center py-6 scrollbar-none px-[calc(50%-160px)] md:px-[calc(50%-190px)]"
        >
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              data-index={index}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="snap-center shrink-0 flex justify-center py-2"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-4 lg:right-8 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-black/5 text-slate-600 hover:text-black transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="shrink-0 flex flex-col items-center gap-3 z-10 mt-auto pb-4"
      >
        <div className="flex items-center justify-center gap-3" role="tablist">
          {featuredProjects.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={activeIndex === index}
              onClick={() => scrollToProject(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-6 bg-[#FF6B00]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
