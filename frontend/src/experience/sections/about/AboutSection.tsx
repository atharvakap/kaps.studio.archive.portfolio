import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Portrait } from './Portrait'
import { fetchProfile } from '../../../services/profile' // Adjust import path as necessary

// The exact contract mirroring your FastAPI backend
export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar_url: string | null
  email: string
}

export const AboutSection = () => {
  // Wire up TanStack Query to fetch the data
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    // FIX: Force the cache to hold this data permanently for the session
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24, // Keep in memory for 24 hours
  })

  // Safe fallback if profile is null (e.g., empty database)
  const paragraphs = profile?.bio
    ? profile.bio.split('\n').filter((p) => p.trim() !== '')
    : ['Biography data not found. Please seed the database.']

  return (
    <section className="h-full w-full flex flex-col items-center justify-start px-6 md:px-12 lg:px-24 pb-24">
      {/* --- SECTION HEADER (Static, loads instantly) --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center text-center mt-20 md:mt-2 mb-12 lg:mb-2"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-4 opacity-70">
          About
        </h1>
        <h2 className="text-sm md:text-base font-mono uppercase tracking-[0.2em] opacity-60 m-0">
          Identity & Core Philosophy
        </h2>
      </motion.div>

      {/* --- TWO-COLUMN CONTENT CONTAINER --- */}
      <div className="w-full max-w-6xl flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 xl:gap-32 items-start mt-4">
        {/* --- TEXT AREA --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col justify-start max-w-lg mx-auto md:mx-0 md:pt-1 order-2 md:order-1 text-center md:text-left"
        >
          {isLoading ? (
            // Skeleton Loading State for Text
            <div className="animate-pulse space-y-6 w-full flex flex-col items-center md:items-start">
              <div className="h-8 md:h-10 bg-black/10 dark:bg-white/10 rounded-md w-3/4 mb-4"></div>
              <div className="w-full space-y-3">
                <div className="h-4 bg-black/5 dark:bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-black/5 dark:bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-black/5 dark:bg-white/5 rounded w-5/6"></div>
              </div>
              <div className="w-full space-y-3 pt-4">
                <div className="h-4 bg-black/5 dark:bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-black/5 dark:bg-white/5 rounded w-4/5"></div>
              </div>
            </div>
          ) : isError ? (
            // Error State Fallback
            <div className="text-red-500/80 font-mono text-sm uppercase tracking-widest text-center md:text-left">
              [ System Error: Unable to load profile data ]
            </div>
          ) : (
            // Success State
            <>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-6 opacity-60">
                {profile?.title}
              </h3>
              <div className="space-y-6 text-base md:text-lg opacity-60 leading-relaxed">
                {paragraphs.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* --- PORTRAIT COMPONENT --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col items-center justify-start order-1 md:order-2"
        >
          {isLoading ? (
            // Skeleton Loading State for Portrait
            <div className="relative w-full max-w-sm aspect-square mx-auto mt-8 md:mt-12">
              <div className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 animate-pulse shadow-inner"></div>
            </div>
          ) : (
            // Success State
            <Portrait avatarUrl={profile?.avatar_url} />
          )}
        </motion.div>
      </div>
    </section>
  )
}
