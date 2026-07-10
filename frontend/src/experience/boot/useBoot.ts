import { useState, useCallback } from 'react'
import type { BootState } from './types'

export const useBoot = (isAppReady: boolean) => {
  // Track individual conditions
  const [isSequenceComplete, setIsSequenceComplete] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  /**
   * We derive bootState directly during render.
   * This ensures there is no "cascading render" effect.
   */
  const getBootState = (): BootState => {
    if (isFinished) return 'finished'
    if (isSequenceComplete && isAppReady) return 'ready'
    return 'booting'
  }

  const bootState = getBootState()

  // Called by Terminal component when typing finishes
  const markSequenceComplete = useCallback(() => {
    setIsSequenceComplete(true)
  }, [])

  // Called by Framer Motion after fade-out completes
  const finishBoot = useCallback(() => {
    setIsFinished(true)
  }, [])

  return {
    bootState,
    markSequenceComplete,
    finishBoot,
  }
}
