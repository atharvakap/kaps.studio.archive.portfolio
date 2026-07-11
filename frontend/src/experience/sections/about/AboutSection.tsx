import { motion } from 'framer-motion'
import { Portrait } from './Portrait'

// 1. Define the exact structure your backend will eventually return
interface AboutContent {
  title: string
  subtitle: string
  heading: string
  paragraphs: string[]
}

// 2. Create the static fallback data
const CONTENT: AboutContent = {
  title: 'About',
  subtitle: 'Identity & Core Philosophy',
  heading: 'Engineering. Art. Execution.',
  paragraphs: [
    'This space is reserved for your core storytelling. It should explain not just what you do, but how you think, bridging the gap between highly technical backend architecture and creative visual design.',
    'Notice the line length is strictly constrained. In premium editorial design, lines that are too wide become exhausting to read. This bounding box ensures your words carry weight.',
    'Later in development, this static placeholder will be replaced by your backend-driven content, seamlessly flowing into this established frontend container.',
  ],
}

export const AboutSection = () => {
  // In the future, you will fetch this data via TanStack Query:
  // const { data: content } = useQuery({ queryKey: ['about'], queryFn: fetchAboutContent })
  const content = CONTENT

  return (
    <section className="h-full w-full flex flex-col items-center justify-start px-6 md:px-12 lg:px-24 pb-24">
      {/* --- SECTION HEADER --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center text-center mt-20 md:mt-2 mb-12 lg:mb-2"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-4">
          {content.title}
        </h1>
        <h2 className="text-sm md:text-base font-mono uppercase tracking-[0.2em] opacity-60 m-0">
          {content.subtitle}
        </h2>
      </motion.div>

      {/* --- TWO-COLUMN CONTENT CONTAINER --- */}
      <div className="w-full max-w-6xl flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 xl:gap-32 items-start mt-4">
        {/* --- TEXT AREA --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col justify-start max-w-lg mx-auto md:mx-0 md:pt-4 order-2 md:order-1 text-center md:text-left"
        >
          <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-6">
            {content.heading}
          </h3>

          <div className="space-y-6 text-base md:text-lg opacity-80 leading-relaxed">
            {/* 3. Dynamically map over the paragraphs */}
            {content.paragraphs.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </motion.div>

        {/* --- PORTRAIT COMPONENT --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col items-center justify-start order-1 md:order-2"
        >
          <Portrait />
        </motion.div>
      </div>
    </section>
  )
}
