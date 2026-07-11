import { useState } from 'react'
import type { ReactNode } from 'react'
import type { SectionId } from './navigation.types'
import { NavigationContext } from './useNavigation'

interface NavigationProviderProps {
  children: ReactNode
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [activeSection, setActiveSection] = useState<SectionId>('about')

  return (
    <NavigationContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </NavigationContext.Provider>
  )
}
