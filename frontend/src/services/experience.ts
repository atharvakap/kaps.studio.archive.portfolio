import type { DatabaseExperience } from '../experience/sections/experience/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const fetchExperiences = async (): Promise<DatabaseExperience[]> => {
  const response = await fetch(`${API_URL}/experience`)

  if (!response.ok) {
    throw new Error('Failed to fetch experience data')
  }

  return response.json()
}
