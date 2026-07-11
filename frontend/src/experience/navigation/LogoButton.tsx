import { useNavigation } from './useNavigation'

export const LogoButton = () => {
  const { setActiveSection } = useNavigation()

  return (
    <button
      onClick={() => setActiveSection('about')}
      aria-label="Return to About section"
      className="pointer-events-auto flex h-12.5 w-12.5 items-center justify-center rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95 shadow-sm"
    >
      <img
        src="/logo.png"
        alt="Portfolio Logo"
        className="h-full w-full object-cover"
      />
    </button>
  )
}
