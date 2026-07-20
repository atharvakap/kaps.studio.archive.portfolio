import type { Testimonial } from '../experience/sections/testimonials/types'

// Use the exact same environment variable pattern as your working projectService
const API_URL = import.meta.env.VITE_API_URL

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  // Use the same path pattern as projectService (note the trailing slash)
  const response = await fetch(`${API_URL}/testimonials/`)

  if (!response.ok) {
    throw new Error(`Failed to fetch testimonials: ${response.status}`)
  }

  return response.json()
}
