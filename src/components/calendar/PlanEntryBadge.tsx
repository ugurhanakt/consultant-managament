import { MapPin, Wifi, Home, Plane, BookOpen } from 'lucide-react'
import { Plan, PlanType } from '../../types/plan'
import { Client } from '../../types/client'
import { cn } from '../../utils/cn'
import { planTypeConfig } from '../ui/Badge'

const typeIcons: Record<PlanType, React.ElementType> = {
  onsite: MapPin, remote: Wifi, internal: Home, leave: Plane, training: BookOpen,
}

interface Props {
  plan: Plan
  client: Client | undefined
  onClick: () => void
}

export const PlanEntryBadge = ({ plan, client, onClick }: Props) => {
  const config = planTypeConfig[plan.type]
  const Icon = typeIcons[plan.type]
  const isOpaque = plan.status === 'cancelled'

  const timeLabel = plan.startTime
    ? plan.endTime
      ? `${plan.startTime} – ${plan.endTime}`
      : plan.startTime
    : null

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full min-w-0 text-left rounded-lg px-2 py-1.5 text-xs transition-all duration-150 group',
        'border hover:shadow-lg',
        config.bg,
        'border-current/20 hover:brightness-110 hover:shadow-primary-900/50',
        isOpaque && 'opacity-40 line-through'
      )}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon size={10} className={cn(config.color, 'flex-shrink-0')} />
        <span className={cn('font-semibold truncate', config.color)}>
          {client?.name ?? 'Bilinmiyor'}
        </span>
        {plan.status === 'tentative' && (
          <span className="ml-auto text-amber-400 text-[9px] font-medium">•taslak</span>
        )}
      </div>
      {plan.tasks.length > 0 && (
        <p className="text-primary-400 truncate text-[10px] pl-3.5">
          {plan.tasks[0].title}
          {plan.tasks.length > 1 && ` +${plan.tasks.length - 1}`}
        </p>
      )}
      {timeLabel && (
        <p className={cn('text-[9px] pl-3.5 mt-0.5 font-medium opacity-70', config.color)}>
          🕐 {timeLabel}
        </p>
      )}
    </button>
  )
}
