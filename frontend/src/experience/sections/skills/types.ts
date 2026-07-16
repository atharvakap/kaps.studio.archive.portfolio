// The raw data coming from your FastAPI backend
export interface Skill {
  id: string
  name: string
  category: string
  proficiency: string
}

// The normalized data we will feed into the UI components
export interface GroupedCategory {
  category: string
  skills: Skill[]
  count: number
}
