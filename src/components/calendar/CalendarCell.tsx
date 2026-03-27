import { Plus } from 'lucide-react'
import { Plan } from '../../types/plan'
import { Client } from '../../types/client'
import { PlanEntryBadge } from './PlanEntryBadge'
import { cn } from '../../utils/cn'
import { isToday, parseISO } from '../../utils/dateUtils'

interface Props {
  dateKey: string
  plans: Plan[]
  clients: Client[]
  isWeekend?: boolean
  onAddPlan: (date: string) => void
  onOpenDetail: (plan: Plan) => void
}

export const CalendarCell = ({ dateKey, plans, clients, isWeekend, onAddPlan, onOpenDetail }: Props) => {
  const today = isToday(parseISO(dateKey))

  // Sort plans by startTime so earlier slots appear first
  const sortedPlans = [...plans].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0
    if (!a.startTime) return 1
    if (!b.startTime) return -1
    return a.startTime.localeCompare(b.startTime)
  })

  return (
    <div
      className={cn(
        'min-h-[80px] p-1.5 border-r border-primary-800/30 relative group/cell overflow-hidden',
        today && 'bg-primary-900/30',
        isWeekend && 'bg-primary-950/60 opacity-60'
      )}
    >
      <div className="space-y-1">
        {sortedPlans.map((plan) => (
          <PlanEntryBadge
            key={plan.id}
            plan={plan}
            client={clients.find((c) => c.id === plan.clientId)}
            onClick={() => onOpenDetail(plan)}
          />
        ))}
      </div>
      {!isWeekend && (
        <button
          onClick={() => onAddPlan(dateKey)}
          className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-primary-700/0 hover:bg-primary-700/60 flex items-center justify-center text-primary-500 hover:text-primary-200 opacity-0 group-hover/cell:opacity-100 transition-all duration-150"
        >
          <Plus size={12} />
        </button>
      )}
    </div>
  )
}
