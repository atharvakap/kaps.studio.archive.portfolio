import { useState, useEffect } from 'react'

interface TerminalProps {
  onComplete: () => void
}

const COMMAND = 'load Portfolio'
const OUTPUTS = [
  'Loading assets...',
  'Loading sections...',
  'Loading styles...',
  'Loading glass...',
  'Loading virtual me...',
  'Done.',
]

export const Terminal = ({ onComplete }: TerminalProps) => {
  const [typedCommand, setTypedCommand] = useState('')
  const [visibleOutputs, setVisibleOutputs] = useState<string[]>([])

  useEffect(() => {
    let isCancelled = false

    const runSequence = async () => {
      // 1. Initial pause before typing starts
      await new Promise((r) => setTimeout(r, 200))
      if (isCancelled) return

      // 2. Typing animation
      for (let i = 1; i <= COMMAND.length; i++) {
        setTypedCommand(COMMAND.slice(0, i))
        await new Promise((r) => setTimeout(r, 60))
        if (isCancelled) return
      }

      // 3. Progressive output lines
      for (let i = 0; i < OUTPUTS.length; i++) {
        setVisibleOutputs((prev) => [...prev, OUTPUTS[i]])
        await new Promise((r) => setTimeout(r, 150))
        if (isCancelled) return
      }

      // 4. Final pause to let the user read "Done."
      await new Promise((r) => setTimeout(r, 250))
      if (isCancelled) return

      // 5. Tell the orchestrator we are finished
      onComplete()
    }

    runSequence()

    // Cleanup to prevent memory leaks if the component unmounts early
    return () => {
      isCancelled = true
    }
  }, [onComplete])

  return (
    <div className="font-mono text-xl flex flex-col items-start">
      {/* Command Line */}
      <div>
        <span>atharva@home:~$ </span>
        <span>{typedCommand}</span>
        <span className="animate-blink">█</span>
      </div>

      {/* Output Log */}
      <div className="mt-2 flex flex-col">
        {visibleOutputs.map((line, index) => (
          <span key={index}>{line}</span>
        ))}
      </div>
    </div>
  )
}