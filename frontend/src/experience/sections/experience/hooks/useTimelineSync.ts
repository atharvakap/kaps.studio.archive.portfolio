import { useEffect, useState, type RefObject } from 'react'

export const useTimelineSync = (
  containerRef: RefObject<HTMLDivElement | null>,
  itemCount: number = 0
) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container || itemCount === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // We only care about items intersecting our target zone
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            if (!isNaN(index)) {
              setActiveIndex(index)
            }
          }
        })
      },
      {
        root: container,
        // This margin creates an "activation zone" slightly near the top
        // so the dot changes as soon as a new card naturally comes into focus
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0,
      }
    )

    // Grab all DOM nodes we attached our index to
    const cards = container.querySelectorAll('[data-index]')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [containerRef, itemCount])

  return activeIndex
}
