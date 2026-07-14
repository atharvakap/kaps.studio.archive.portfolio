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
    <div className="flex flex-col gap-3 w-full p-6 h-full overflow-y-auto no-scrollbar">
      {categories.map((group) => {
        const Icon =
          categoryIconMap[group.category] || categoryIconMap['default']
        const isSelected = selectedCategory === group.category

        return (
          <button
            key={group.category}
            onClick={() => onSelect(group.category)}
            className={`
              group relative w-full flex items-center justify-between p-4 rounded-2xl
              transition-all duration-300 ease-out outline-none cursor-pointer
              ${
                isSelected
                  ? /* Using our new shadow-glass-glow from the theme */
                    'bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 shadow-glass-glow scale-[1.02]'
                  : 'bg-transparent border border-transparent hover:bg-white/10 dark:hover:bg-white/5 hover:border-white/20 hover:scale-[1.01]'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <div
                className={`
                p-2.5 rounded-xl transition-colors duration-300
                ${isSelected ? 'bg-(--accent) text-white' : 'bg-black/5 dark:bg-white/5 text-(--text)'}
                group-hover:bg-(--accent) group-hover:text-white
              `}
              >
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <span
                className={`font-medium transition-colors ${isSelected ? 'text-(--text-h)' : 'text-(--text)'}`}
              >
                {group.category}
              </span>
            </div>

            {/* Skill Count Indicator */}
            <span
              className={`text-sm font-mono transition-opacity ${isSelected ? 'opacity-100 text-(--text-h)' : 'opacity-40 group-hover:opacity-100 text-(--text)'}`}
            >
              {group.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
