export const Portrait = () => {
  return (
    // The container is now a perfect square (aspect-square) to house the circular frame
    <div className="relative w-full max-w-sm aspect-square mx-auto mt-8 md:mt-12">
      {/* 1. THE RECESSED PAPER FRAME */}
      {/* shadow-inner and a subtle background color make it look pressed into the page */}
      <div className="absolute inset-0 rounded-full bg-black/4 dark:bg-white/4 shadow-inner border border-black/5 dark:border-white/5"></div>

      {/* 2. THE BOTTOM HALF (Clipped by the circle) */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <img
          src="/portrait.png"
          alt=""
          // w-[115%] scales the image up so the shoulders push out past the circle's edges
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[115%] max-w-none h-auto object-contain pointer-events-none"
        />
      </div>

      {/* 3. THE TOP HALF (Breaking out of the frame) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/portrait.png"
          alt="Atharva Kapile - Self Portrait"
          // Exactly the same size/position as the image below, but with a drop-shadow.
          // MAGIC: clip-path hides the bottom 40% of this top layer (revealing the clipped layer below),
          // while allowing the top, left, and right to overflow indefinitely (-50%).
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[115%] max-w-none h-auto object-contain drop-shadow-xl select-none [clip-path:inset(-50%_-50%_40%_-50%)]"
        />
      </div>
    </div>
  )
}
