// Define the exact IDs for your new sections
export type SectionId =
  'about' | 'skills' | 'experience' | 'projects' | 'testimonials'

export interface NavigationItemData {
  id: SectionId
  label: string
}
