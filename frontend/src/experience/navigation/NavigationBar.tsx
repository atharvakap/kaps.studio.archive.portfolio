import { NAVIGATION_ITEMS } from './navigation.config'
import { NavigationItem } from './NavigationItem'

export const NavigationBar = () => {
  return (
    <nav className="pointer-events-auto order-3 w-full overflow-x-auto scrollbar-none rounded-full glass-panel p-1 sm:p-1.5 lg:order-none lg:w-auto lg:overflow-visible">
      <ul
        className="flex min-w-max items-center justify-center gap-x-0.5 sm:gap-x-1"
        role="menubar"
      >
        {NAVIGATION_ITEMS.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  )
}
