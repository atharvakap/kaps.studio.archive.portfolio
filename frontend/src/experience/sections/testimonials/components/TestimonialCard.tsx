import { memo } from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import type { Testimonial } from '../types'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export const TestimonialCard = memo(({ testimonial }: TestimonialCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="w-[var(--testimonial-card-width,20rem)] h-[clamp(20rem,58svh,24rem)] shrink-0 flex flex-col bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <Quote size={32} className="text-[#FF6B00]/20 mb-4 md:mb-6 shrink-0" />

      <p className="flex-1 text-slate-600 text-sm md:text-base leading-relaxed font-light italic overflow-y-auto scrollbar-none mb-4 md:mb-6">
        "{testimonial.content}"
      </p>

      <div className="shrink-0 pt-4 border-t border-slate-100">
        <h4 className="text-slate-900 font-bold tracking-tight text-base">
          {testimonial.author_name}
        </h4>
        <p className="text-[#FF6B00] text-xs font-semibold tracking-wide uppercase mt-0.5">
          {testimonial.author_role}
        </p>
      </div>
    </motion.div>
  )
})

TestimonialCard.displayName = 'TestimonialCard'
