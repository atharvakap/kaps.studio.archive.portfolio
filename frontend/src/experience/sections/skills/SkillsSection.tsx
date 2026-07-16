import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useSkills } from './hooks/useSkills'
import { CategoryList } from './components/CategoryList'
import { categoryIconMap } from './constants/categoryIcons'
import { SkillPill } from './components/SkillPill'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

export const SkillsSection = () => {
  const { data: groupedSkills, isLoading, isError } = useSkills()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const activeCategory =
    selectedCategory ?? (groupedSkills?.[0]?.category || null)

  const activeGroup = groupedSkills?.find((g) => g.category === activeCategory)

  const ActiveIcon = activeCategory
    ? categoryIconMap[activeCategory] || categoryIconMap['default']
    : null

  return (
    <section className="relative h-full w-full flex flex-col items-center px-6 md:px-12 lg:px-24 pb-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col items-center text-center max-w-2xl mb-8 space-y-4 shrink-0">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-2 opacity-70">
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

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-8 flex-1 min-h-0">
        {/* LEFT COLUMN: NAVIGATION */}
        <div className="glass-slider overflow-hidden flex flex-col shrink-0 lg:shrink lg:h-full rounded-3xl lg:rounded-[40px]">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="animate-pulse opacity-50">Loading categories...</p>
            </div>
          ) : isError ? (
            <div className="flex-1 flex items-center justify-center p-6">
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

        {/* RIGHT COLUMN: DYNAMIC SKILL CONTAINER */}
        <div className="h-125 lg:h-full rounded-[40px] glass-slider flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              // APPLIED: glass-scrollbar on the mobile scroll wrap
              className="absolute inset-0 flex flex-col p-8 md:p-8 overflow-y-auto glass-scrollbar"
            >
              {activeGroup ? (
                <>
                  <div className="shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-(--accent) text-black opacity-60">
                        {ActiveIcon && <ActiveIcon size={20} strokeWidth={2} />}
                      </div>
                      <h3 className="text-xl font-medium tracking-tight text-black opacity-70">
                        {activeCategory}
                      </h3>
                    </div>
                    <p className="text-(--text) opacity-50 text-sm leading-relaxed mb-6 max-w-xl font-light">
                      Tools and technologies leveraged within the{' '}
                      {activeCategory} domain.
                    </p>
                  </div>

                  {/* APPLIED: overflow-y-auto & glass-scrollbar directly on the skills container */}
                  <div className="flex-1 overflow-y-auto px-3 glass-scrollbar relative min-h-0 py-2">
                    <motion.div
                      className="flex flex-wrap gap-4 pb-12"
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {activeGroup?.skills?.map((skill) => (
                        <SkillPill key={skill.id} skill={skill} />
                      ))}
                    </motion.div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center opacity-50 font-mono text-sm">
                  [ No capabilities found ]
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM QUOTE */}
      <div className="max-w-3xl rounded-full glass-slider px-10 py-4 shrink-0">
        <p className="italic text-(--text-h) text-center text-sm md:text-base m-0">
          "Simplicity is the ultimate sophistication. Engineering should feel
          effortless."
        </p>
      </div>
    </section>
  )
}
