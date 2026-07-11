import { useState, useEffect } from 'react'
import { BootScreen } from '@/experience/boot'
import {
  NavigationProvider,
  NavigationContainer,
} from '@/experience/navigation'
// Change this line in App.tsx
import { SectionOrchestrator } from '@/experience/sections/SectionOrchestrator'

function App() {
  const [isAppReady, setIsAppReady] = useState(false)

  useEffect(() => {
    const loadAssets = async () => {
      // Reduced to 2 seconds just for faster development testing right now
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsAppReady(true)
    }
    loadAssets()
  }, [])

  return (
    <NavigationProvider>
      <BootScreen isAppReady={isAppReady}>
        {/* The floating navigation layer (Z-index 40) */}
        <NavigationContainer />

        {/* The content orchestrator layer (Z-index 0) */}
        <SectionOrchestrator />
      </BootScreen>
    </NavigationProvider>
  )
}

export default App
