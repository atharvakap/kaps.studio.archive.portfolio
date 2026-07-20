import { LogoButton } from './LogoButton'
import { NavigationBar } from './NavigationBar'
import { VirtualMeButton } from './VirtualMeButton'

export const NavigationContainer = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-[1920px] mx-auto">
        <LogoButton />
        <NavigationBar />
        <VirtualMeButton />
      </div>
    </header>
  )
}
