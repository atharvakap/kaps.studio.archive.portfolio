// Define the exact IDs your sections will use
export type SectionId = 'about' | 'work' | 'lab' | 'contact'

export interface NavigationItemData {
  id: SectionId
  label: string
}
