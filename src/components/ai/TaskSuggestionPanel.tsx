import { Sparkles, Plus, AlertCircle } from 'lucide-react'
import { AISuggestion } from '../../services/aiService'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { cn } from '../../utils/cn'

interface Props {
  isLoading: boolean
  suggestions: AISuggestion[]
  error: string | null
  onAdd: (suggestion: AISuggestion) => void
}

export const TaskSuggestionPanel = ({ isLoading, suggestions, error, onAdd }: Props) => {
  if (!isLoading && suggestions.length === 0 && !error) return null

  return (
    <div className="rounded-xl border border-primary-700/40 bg-primary-900/30 p-3">
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles size={13} className="text-primary-400" />
        <span className="text-xs font-semibold text-primary-400">AI Önerileri</span>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3">
          <LoadingSpinner className="w-4 h-4" />
          <span className="text-xs text-primary-500">İlgili görevler aranıyor...</span>
          <div className="flex gap-1.5 ml-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-24 bg-primary-800/60 rounded-full animate-pulse-slow" />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-amber-400">
          <AlertCircle size={13} />
          {error}
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onAdd(s)}
              className={cn(
                'group flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full',
                'bg-primary-800/50 border border-primary-700/50 text-primary-300',
                'hover:bg-primary-600/40 hover:border-primary-500/60 hover:text-primary-100',
                'transition-all duration-150 animate-fade-in'
              )}
            >
              <Plus size={11} className="opacity-60 group-hover:opacity-100" />
              <span>{s.title}</span>
              <span className="text-primary-500 group-hover:text-primary-400 text-[10px]">
                {s.estimatedHours}s
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
