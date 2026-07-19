import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTestimonials } from './hooks/useTestimonials'
import { TestimonialCard } from './components/TestimonialCard'

export const TestimonialsSection = () => {
  const { data: testimonials = [], isLoading, error } = useTestimonials()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollLeft = carouselRef.current.scrollLeft
        const cardWidth = 350 + 32
        setActiveIndex(Math.round(scrollLeft / cardWidth))
      }
    }
    const container = carouselRef.current
    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center font-mono opacity-50">
        Loading Testimonials...
      </div>
    )
  if (error)
    return (
      <div className="h-full w-full flex items-center justify-center text-red-500">
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

  const scrollToTestimonial = (index: number) => {
    const cardWidth = 350 + 32
    carouselRef.current?.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative h-full w-full flex flex-col items-center pt-8 pb-4 overflow-hidden">
      <div className="text-center mb-8 px-4 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 opacity-80">
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
              carouselRef.current?.scrollBy({ left: -382, behavior: 'smooth' })
            }
            className="hidden md:flex absolute left-8 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 shadow-lg border border-black/5 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
        )}

        <div
          ref={carouselRef}
          className="w-full flex overflow-x-auto snap-x snap-mandatory gap-8 py-6 px-[calc(50%-160px)] md:px-[calc(50%-220px)] scrollbar-none"
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
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
              carouselRef.current?.scrollBy({ left: 382, behavior: 'smooth' })
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
          className="flex items-center justify-center gap-3 mt-4"
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
