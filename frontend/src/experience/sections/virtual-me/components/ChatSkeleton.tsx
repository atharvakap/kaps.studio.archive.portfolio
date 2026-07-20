export const ChatSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col animate-pulse">
      {/* Assistant Bubble Skeleton */}
      <div className="flex gap-4 max-w-3xl w-full mr-auto">
        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
        <div className="space-y-2 w-3/4 max-w-md">
          <div className="h-4 bg-white/40 rounded-xl w-full" />
          <div className="h-4 bg-white/40 rounded-xl w-4/5" />
        </div>
      </div>

      {/* User Bubble Skeleton */}
      <div className="flex gap-4 max-w-3xl w-full ml-auto flex-row-reverse">
        <div className="w-8 h-8 rounded-full bg-slate-300 shrink-0" />
        <div className="space-y-2 w-1/2 max-w-xs">
          <div className="h-4 bg-white/60 rounded-xl w-full" />
        </div>
      </div>

      {/* Assistant Bubble Skeleton */}
      <div className="flex gap-4 max-w-3xl w-full mr-auto">
        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
        <div className="space-y-2 w-2/3 max-w-sm">
          <div className="h-4 bg-white/40 rounded-xl w-full" />
          <div className="h-4 bg-white/40 rounded-xl w-3/5" />
        </div>
      </div>
    </div>
  )
}
