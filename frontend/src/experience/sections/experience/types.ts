export interface DatabaseExperience {
  id: string | number
  company: string
  role: string
  description: string
  start_date: string
  end_date: string | null
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface Experience extends DatabaseExperience {
  isCurrent: boolean
  formattedStartDate: string
  formattedEndDate: string
  durationLabel: string
}
