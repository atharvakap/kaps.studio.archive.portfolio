import { motion } from 'framer-motion'
import type { NavigationItemData } from './navigation.types'
import { useNavigation } from './useNavigation'

interface NavigationItemProps {
  item: NavigationItemData
}

export const NavigationItem = ({ item }: NavigationItemProps) => {
  const { activeSection, setActiveSection } = useNavigation()
  const isActive = activeSection === item.id

  return (
    <li role="none" className="shrink-0">
      <motion.button
        role="menuitem"
        onClick={() => setActiveSection(item.id)}
        aria-label={`Navigate to ${item.label} section`}
        aria-current={isActive ? 'page' : undefined}

        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.98 }}

        className={`
          relative rounded-full font-medium transition-colors duration-300 cursor-pointer
          px-3 py-1.5 text-xs sm:px-4 md:px-5 lg:px-6 sm:py-2 sm:text-sm
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 
          focus-visible:ring-offset-2 focus-visible:ring-offset-black/50
        `}
      >
        {isActive && (
          <motion.div
            layoutId="active-nav-slider"
            /* -inset-0.5 handles the breakout, scale: 1.15 adds the "pop" */
            className="absolute -inset-0.5 z-0 rounded-full glass-slider"
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 30,
              mass: 1.2,
            }}
            style={{ willChange: 'transform' }}
          />
        )}

        <motion.span
          className="relative z-10 block whitespace-nowrap"
          animate={{
            color: isActive
              ? 'rgba(255, 255, 255, 200)'
              : 'rgba(255, 255, 255, 100)',
          }}
          whileHover={{ color: 'rgba(255, 255, 255, 1)' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {item.label}
        </motion.span>
      </motion.button>
    </li>
  )
}
