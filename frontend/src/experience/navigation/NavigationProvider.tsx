import { useState } from 'react'
import type { ReactNode } from 'react'
import type { SectionId } from './navigation.types'
import { NavigationContext } from './useNavigation'

interface NavigationProviderProps {
  children: ReactNode
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [activeSection, setActiveSection] = useState<SectionId>('about')
  const [isVirtualMeActive, setIsVirtualMeActive] = useState(false)

  // Intercept normal navigation to close Virtual Me when clicking portfolio tabs
  const handleSetActiveSection = (id: SectionId) => {
    setActiveSection(id)
    setIsVirtualMeActive(false)
  }

  return (
    <NavigationContext.Provider
      value={{
        activeSection,
        setActiveSection: handleSetActiveSection,
        isVirtualMeActive,
        setIsVirtualMeActive,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
