import type { Project } from '../experience/sections/projects/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const fetchProjects = async (): Promise<Project[]> => {
  // Adding the trailing slash to prevent FastAPI 404s based on our previous fix!
  const response = await fetch(`${API_URL}/projects/`)

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  return response.json()
}
