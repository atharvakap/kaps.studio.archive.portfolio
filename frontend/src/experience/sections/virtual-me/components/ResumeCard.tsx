import { FileText, Download } from 'lucide-react'
import { trackResumeDownload } from '../services/virtualMeService'
import { useChatManager } from '../hooks/useChatManager'

interface ResumeCardProps {
  title: string
  url: string
  version?: string
}

export const ResumeCard = ({
  url,
  version = 'Latest',
}: ResumeCardProps) => {
  const { visitorId } = useChatManager()

  const handleDownload = () => {
    if (visitorId) trackResumeDownload(visitorId)
    window.open(url, '_blank')
  }

  return (
    <div className="flex items-center justify-between p-3.5 mt-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-xl shadow-sm w-full max-w-70 group transition-all hover:shadow-md hover:bg-white/80">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2.5 bg-linear-to-br from-[#FF6B00]/10 to-orange-500/10 text-[#FF6B00] rounded-lg shrink-0">
          <FileText size={20} />
        </div>
        <div className="truncate">
          <h4 className="text-sm font-semibold text-slate-800 truncate">
            Atharva_Kapile
          </h4>
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
            Version {version} • PDF
          </p>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="p-2 text-slate-400 hover:text-[#FF6B00] hover:bg-white rounded-lg transition-colors shrink-0"
        aria-label="Download Resume"
      >
        <Download size={18} />
      </button>
    </div>
  )
}
