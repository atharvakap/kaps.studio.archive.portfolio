import type { Profile } from '../experience/sections/about/AboutSection'

// Uses your VITE_API_URL from .env with a clean fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * Fetches the primary profile data from the FastAPI backend.
 */
export const fetchProfile = async (): Promise<Profile> => {
  const response = await fetch(`${API_BASE_URL}/profile/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`)
  }

  const data = await response.json()

  // If FastAPI returns a list (array), extract the first profile record safely
  if (Array.isArray(data)) {
    return data[0] || null
  }

  return data
}
