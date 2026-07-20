import { createContext, useContext } from 'react'
import type { NavigationContextType } from './navigation.types'

// 1. Define the Context here using the shared type
export const NavigationContext = createContext<
  NavigationContextType | undefined
>(undefined)

// 2. Define the Hook here
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
