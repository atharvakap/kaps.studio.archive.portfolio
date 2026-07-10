import { useState, useEffect } from 'react'
import { BootScreen } from '@/experience/boot'

function App() {
  // The Application now owns readiness
  const [isAppReady, setIsAppReady] = useState(false)

  useEffect(() => {
    // Simulate heavy asset loading (e.g., Three.js models, images, APIs)
    // We set this to 5 seconds to prove the Terminal waits for the app!
    const loadAssets = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      setIsAppReady(true)
    }

    loadAssets()
  }, [])

  return (
    <BootScreen isAppReady={isAppReady}>
      <div className="flex h-full w-full items-center justify-center bg-paper text-ink">
        <h1 className="text-2xl font-bold">Portfolio 2.0 is Live</h1>
      </div>
    </BootScreen>
  )
}

export default App
