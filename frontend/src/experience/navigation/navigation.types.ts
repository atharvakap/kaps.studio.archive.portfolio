// Define the exact IDs for your new sections
export type SectionId =
  'about' | 'skills' | 'experience' | 'projects' | 'certs' | 'education'

export interface NavigationItemData {
  id: SectionId
  label: string
}
