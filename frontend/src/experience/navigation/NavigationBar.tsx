import { NAVIGATION_ITEMS } from './navigation.config'
import { NavigationItem } from './NavigationItem'

export const NavigationBar = () => {
  return (
    /* Removed shadow-lg shadow-black/10 which was lifting the bar off the surface */
    <nav className="pointer-events-auto flex items-center rounded-full glass-panel p-1 sm:p-1.5 overflow-visible">
      <ul className="flex items-center gap-x-0.5 sm:gap-x-1" role="menubar">
        {NAVIGATION_ITEMS.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  )
}