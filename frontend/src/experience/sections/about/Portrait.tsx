interface PortraitProps {
  avatarUrl?: string | null
}

export const Portrait = ({ avatarUrl }: PortraitProps) => {
  // Fallback to your local image if the backend doesn't provide one
  const imageSrc = avatarUrl || '/portrait.png'

  return (
    <div className="relative w-[min(22rem,70vw,42svh)] max-w-sm aspect-square mx-auto mt-0 md:mt-4 lg:mt-8">
      <div className="absolute inset-0 rounded-full bg-black/4 dark:bg-white/4 shadow-inner border border-black/5 dark:border-white/5"></div>

      <div className="absolute inset-0 rounded-full overflow-hidden">
        <img
          src={imageSrc}
          alt="Atharva Kapile"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[115%] max-w-none h-auto object-contain pointer-events-none"
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <img
          src={imageSrc}
          alt="Atharva Kapile - Breakout"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[115%] max-w-none h-auto object-contain drop-shadow-xl select-none [clip-path:inset(-50%_-50%_40%_-50%)]"
        />
      </div>
    </div>
  )
}
