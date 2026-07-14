import type { Skill } from '@/experience/sections/skills/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const fetchSkills = async (): Promise<Skill[]> => {
  const response = await fetch(`${API_BASE_URL}/skills`)

  if (!response.ok) {
    throw new Error('Failed to fetch skills data')
  }

  return response.json()
}
