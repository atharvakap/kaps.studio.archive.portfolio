import { createContext, useContext } from 'react'
import type { SectionId } from './navigation.types' // <-- Explicit type import

export interface NavigationContextType {
  activeSection: SectionId
  setActiveSection: (id: SectionId) => void
}

// 1. Define the Context here
export const NavigationContext = createContext<
  NavigationContextType | undefined
>(undefined)

// 2. Define the Hook here
export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
