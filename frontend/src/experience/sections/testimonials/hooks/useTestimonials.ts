import { useQuery } from '@tanstack/react-query'
import { fetchTestimonials } from '../../../../services/testimonialService'
// THE FIX: Use 'import type' here as well
import type { Testimonial } from '../types'

export const useTestimonials = () => {
  return useQuery<Testimonial[], Error>({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes to match Projects
    retry: 2,
  })
}
