import { LogoButton } from './LogoButton'
import { NavigationBar } from './NavigationBar'
import { VirtualMeButton } from './VirtualMeButton'

export const NavigationContainer = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-center gap-x-3 sm:gap-x-4 p-4 sm:p-6 md:p-8 w-full max-w-[1920px] mx-auto">
        <LogoButton />
        <NavigationBar />
        <VirtualMeButton />
      </div>
    </header>
  )
}
