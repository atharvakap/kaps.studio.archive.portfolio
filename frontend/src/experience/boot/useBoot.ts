import { useState, useEffect } from 'react'
import type { BootState } from './types'

export const useBoot = () => {
  const [bootState, setBootState] = useState<BootState>('booting')

  // Simulate the app loading and the terminal timeline finishing.
  // In Step 0.5, we will trigger this state change based on the typing animation completing.
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootState('ready')
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  // Called automatically when Framer Motion finishes the fade-out animation
  const finishBoot = () => setBootState('finished')

  return { bootState, finishBoot }
}
