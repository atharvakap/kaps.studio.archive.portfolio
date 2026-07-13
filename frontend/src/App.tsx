import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BootScreen } from '@/experience/boot'
import {
  NavigationProvider,
  NavigationContainer,
} from '@/experience/navigation'
import { SectionOrchestrator } from '@/experience/sections/SectionOrchestrator'
import { fetchProfile } from './services/profile' // <-- Adjust this path if necessary

function App() {
  const [isAppReady, setIsAppReady] = useState(false)

  // Bring in the Query Client engine we set up in main.tsx
  const queryClient = useQueryClient()

  useEffect(() => {
    const loadCriticalAssets = async () => {
      // 1. Helper function that forces the browser to download an image
      const preloadImage = (src: string) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = resolve
          // We resolve on error too, so a broken image link doesn't freeze the app forever
          img.onerror = resolve
        })
      }

      try {
        // 2. Pre-fetch the profile data in the background
        const profile = await queryClient.fetchQuery({
          queryKey: ['profile'],
          queryFn: fetchProfile,
        })

        // 3. Preload the backend image, or fallback to local if null
        const imageToLoad = profile?.avatar_url || '/portrait.png'
        await preloadImage(imageToLoad)
      } catch (error) {
        // 4. If the FastAPI backend is down, still preload the fallback image
        await preloadImage('/portrait.png')
      }

      // 5. Everything is downloaded and cached. Drop the loading screen!
      setIsAppReady(true)
    }

    loadCriticalAssets()
  }, [queryClient])

  return (
    <NavigationProvider>
      <BootScreen isAppReady={isAppReady}>
        <NavigationContainer />
        <SectionOrchestrator />
      </BootScreen>
    </NavigationProvider>
  )
}

export default App
