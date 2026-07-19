export interface ProjectSkill {
  id?: string // Matches SkillSummary 'id'
  skill_id?: string // Fallback
  name?: string // Matches SkillSummary 'name'
  skill_name?: string // Fallback
}

export interface Project {
  id: string
  name: string
  slug: string
  description: string
  image_url: string | null
  github_url: string | null
  live_url: string | null
  featured: boolean
  created_at: string
  updated_at: string
  skills?: ProjectSkill[]
}
