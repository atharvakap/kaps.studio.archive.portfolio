import { useRef, useState, useEffect, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTestimonials } from './hooks/useTestimonials'
import { TestimonialCard } from './components/TestimonialCard'

export const TestimonialsSection = () => {
  const { data: testimonials = [], isLoading, error } = useTestimonials(1)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const carouselStyle = {
    '--testimonial-card-width': 'clamp(18rem, 82vw, 27.5rem)',
    paddingInline:
      'max(1rem, calc((100% - var(--testimonial-card-width)) / 2))',
  } as CSSProperties

  useEffect(() => {
    const container = carouselRef.current
    if (!container || testimonials.length === 0) return

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

    const cards = container.querySelectorAll('[data-index]')
    cards.forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [testimonials.length])

  if (isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center px-4 text-center font-mono opacity-50">
        Loading Testimonials...
      </div>
    )
  if (error)
    return (
      <div className="h-full w-full flex items-center justify-center px-4 text-center text-red-500">
        Error loading testimonials.
      </div>
    )

  if (testimonials.length === 0) {
    return (
      <section className="h-full w-full flex flex-col items-center justify-center text-slate-500">
        <p className="font-mono text-sm">No testimonials available.</p>
      </section>
    )
  }

  // FIX: Force visibility by checking length > 0
  const showNav = testimonials.length > 0

  const getScrollAmount = () => (carouselRef.current?.clientWidth || 420) * 0.82
  const scrollToTestimonial = (index: number) => {
    const child = carouselRef.current?.querySelector(
      `[data-index="${index}"]`
    ) as HTMLElement
    child?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }

  return (
    <section className="relative h-full w-full min-h-0 flex flex-col items-center pt-0 md:pt-2 pb-3 md:pb-4 overflow-hidden">
      <div className="text-center mb-3 md:mb-6 px-4 z-10 shrink-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 opacity-80">
          Kind Words
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Voices from past collaborations
        </p>
      </div>

      <div className="relative w-full flex-1 flex items-center group">
        {showNav && (
          <button
            onClick={() =>
              carouselRef.current?.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth',
              })
            }
            className="hidden md:flex absolute left-8 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 shadow-lg border border-black/5 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
        )}

        <div
          ref={carouselRef}
          style={carouselStyle}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-8 items-center py-3 sm:py-5 md:py-6 scrollbar-none"
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              data-index={index}
              initial={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.95 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="snap-center shrink-0"
            >
              <TestimonialCard testimonial={t} />
            </motion.div>
          ))}
        </div>

        {showNav && (
          <button
            onClick={() =>
              carouselRef.current?.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth',
              })
            }
            className="hidden md:flex absolute right-8 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 shadow-lg border border-black/5 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      {showNav && (
        <div
          className="flex items-center justify-center gap-3 mt-2 md:mt-4 shrink-0"
          role="tablist"
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={activeIndex === index}
              onClick={() => scrollToTestimonial(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-6 bg-[#FF6B00]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
