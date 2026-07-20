import { Sparkles, Briefcase, FileText, Code2 } from 'lucide-react'

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
}

export const SuggestedQuestions = ({ onSelect }: SuggestedQuestionsProps) => {
  const suggestions = [
    {
      icon: <Sparkles size={16} className="text-[#FF6B00]" />,
      text: 'Tell me about your focus on AI and data engineering.',
    },
    {
      icon: <Briefcase size={16} className="text-[#FF6B00]" />,
      text: 'How does your Salesforce experience influence your backend architecture?',
    },
    {
      icon: <Code2 size={16} className="text-[#FF6B00]" />,
      text: 'How did you build the hybrid retrieval for this portfolio?',
    },
    {
      icon: <FileText size={16} className="text-[#FF6B00]" />,
      text: 'Can I download your latest resume?',
    },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 px-0 sm:px-4 pointer-events-auto">
      {suggestions.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect(item.text)}
          className="flex items-start gap-3 p-3 sm:p-4 text-left bg-white/40 hover:bg-white/60 backdrop-blur-md border border-white/40 hover:border-white/80 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="mt-0.5 bg-white/80 p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
            {item.icon}
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900">
            {item.text}
          </span>
        </button>
      ))}
    </div>
  )
}
