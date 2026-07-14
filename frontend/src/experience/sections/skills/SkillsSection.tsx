import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // 1. Import Framer Motion
import { useSkills } from './hooks/useSkills'
import { CategoryList } from './components/CategoryList'

export const SkillsSection = () => {
  const { data: groupedSkills, isLoading, isError } = useSkills()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const activeCategory =
    selectedCategory ?? (groupedSkills?.[0]?.category || null)

  return (
    <section className="relative h-full w-full flex flex-col items-center px-6 md:px-12 lg:px-24 pb-8">
      <div className="flex flex-col items-center text-center max-w-2xl mb-8 space-y-4 shrink-0">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-2">
          Skills
        </h1>
        <h2 className="text-sm md:text-base font-mono uppercase tracking-[0.2em] opacity-60 m-0">
          Technical Capabilities
        </h2>
        <p className="text-(--text) text-lg leading-relaxed mt-2 opacity-60">
          A blend of engineering expertise and creative craftmanship that powers
          the products I build.
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-8 flex-1 min-h-0">
        {/* LEFT COLUMN */}
        <div className="h-full rounded-[40px] glass-card flex flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="animate-pulse opacity-50">Loading categories...</p>
            </div>
          ) : isError ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-red-500">[ SYSTEM ERROR ]</p>
            </div>
          ) : groupedSkills ? (
            <CategoryList
              categories={groupedSkills}
              selectedCategory={activeCategory}
              onSelect={setSelectedCategory}
            />
          ) : null}
        </div>

        {/* RIGHT COLUMN: PHASE 6 ANIMATED STATE WRAPPER */}
        <div className="h-full rounded-[40px] glass-card flex items-center justify-center overflow-hidden">
          {/* mode="wait" ensures the old content completely fades out BEFORE the new content fades in */}
          <AnimatePresence mode="wait">
            <motion.div
              // THE MAGIC: Changing this key forces React to unmount the old div and mount a new one, triggering the animation!
              key={activeCategory}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center w-full h-full p-8"
            >
              <p className="text-sm font-mono opacity-50">
                Selected: {activeCategory || 'None'}
              </p>
              {/* Phase 7 & 8 components will be injected right here */}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM QUOTE */}
      <div className="max-w-3xl rounded-full glass-card px-10 py-4 shrink-0">
        <p className="italic text-(--text-h) text-center text-sm md:text-base m-0">
          "Simplicity is the ultimate sophistication. Engineering should feel
          effortless."
        </p>
      </div>
    </section>
  )
}
