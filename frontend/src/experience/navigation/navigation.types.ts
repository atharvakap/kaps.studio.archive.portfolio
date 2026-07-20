// Define the exact IDs for your sections
export type SectionId =
  'about' | 'skills' | 'experience' | 'projects' | 'testimonials'

export interface NavigationItemData {
  id: SectionId
  label: string
}

export interface NavigationContextType {
  activeSection: SectionId
  setActiveSection: (id: SectionId) => void
  isVirtualMeActive: boolean
  setIsVirtualMeActive: (active: boolean) => void
}
