import type { Profile } from '../experience/sections/about/AboutSection' // Update import path as needed

// Define your backend URL. If using Vite, it looks like this:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Fetches the primary profile data from the FastAPI backend.
 */
export const fetchProfile = async (): Promise<Profile> => {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`)
  }

  const data = await response.json()

  // FIX: If FastAPI returns a list (array), extract the first profile.
  // If the database is empty, return null so we don't crash.
  if (Array.isArray(data)) {
    return data[0] || null
  }

  return data
}