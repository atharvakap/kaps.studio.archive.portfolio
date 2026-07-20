import { useNavigation } from './useNavigation'

export const LogoButton = () => {
  const { setActiveSection } = useNavigation()

  return (
    <button
      onClick={() => setActiveSection('about')}
      aria-label="Return to About section"
      className="pointer-events-auto flex h-10 w-10 sm:h-11 sm:w-11 md:h-12.5 md:w-12.5 items-center justify-center rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95 shadow-sm shrink-0"
    >
      <img
        src="/logo.png"
        alt="Portfolio Logo"
        className="h-full w-full object-cover"
      />
    </button>
  )
}
