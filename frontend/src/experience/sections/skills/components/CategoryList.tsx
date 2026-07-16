import { motion } from 'framer-motion'
import type { GroupedCategory } from '../types'
import { categoryIconMap } from '../constants/categoryIcons'

interface CategoryListProps {
  categories: GroupedCategory[]
  selectedCategory: string | null
  onSelect: (category: string) => void
}

export const CategoryList = ({
  categories,
  selectedCategory,
  onSelect,
}: CategoryListProps) => {
  return (
    // SWAPPED: 'no-scrollbar' is now 'glass-scrollbar'
    <div className="flex flex-row lg:flex-col gap-2 w-full p-4 lg:p-5 h-auto lg:h-full overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden glass-scrollbar relative items-center lg:items-stretch">
      {categories.map((group) => {
        const Icon =
          categoryIconMap[group.category] || categoryIconMap['default']
        const isSelected = selectedCategory === group.category

        return (
          <button
            key={group.category}
            onClick={() => onSelect(group.category)}
            className="group relative shrink-0 w-auto lg:w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ease-out outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
          >
            {isSelected && (
              <motion.div
                layoutId="category-active-slider"
                className="absolute inset-0 bg-white/80 dark:bg-white/10 border border-black/5 dark:border-white/10 shadow-sm rounded-xl"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            )}

            <div className="flex items-center gap-4 relative z-10 pr-4 lg:pr-0">
              <div
                className={`p-2.5 rounded-xl transition-colors duration-300 group-hover:bg-(--accent) group-hover:text-black ${
                  isSelected
                    ? 'bg-(--accent) text-black opacity-70 shadow-md'
                    : 'bg-black/5 dark:bg-white/5 text-black/80 dark:text-black/80'
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
              </div>

              <span
                className={`font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'text-black dark:text-black opacity-70'
                    : 'text-(--text) opacity-50'
                }`}
              >
                {group.category}
              </span>
            </div>

            <span
              className={`text-sm font-mono transition-colors relative z-10 ${
                isSelected
                  ? 'text-black dark:text-black font-semibold opacity-60'
                  : 'opacity-50 group-hover:opacity-100 text-(--text)'
              }`}
            >
              {group.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
