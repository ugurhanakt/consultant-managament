import { Consultant } from '../../types/consultant'
import { Plan } from '../../types/plan'
import { Client } from '../../types/client'
import { CalendarCell } from './CalendarCell'
import { Avatar } from '../ui/Avatar'
import { formatDateKey } from '../../utils/dateUtils'

interface Props {
  consultant: Consultant
  weekDays: Date[]
  plans: Plan[]
  clients: Client[]
  onAddPlan: (date: string, consultantId: string) => void
  onOpenDetail: (plan: Plan) => void
}

export const ConsultantRow = ({ consultant, weekDays, plans, clients, onAddPlan, onOpenDetail }: Props) => (
  <div className="grid" style={{ gridTemplateColumns: '200px repeat(7, 1fr)' }}>
    {/* Consultant label */}
    <div className="flex items-center gap-2.5 px-3 py-2 border-r border-primary-800/30 border-b border-b-primary-800/20 bg-primary-950/40 sticky left-0">
      <Avatar initials={consultant.avatarInitials} color={consultant.colorTag} size="sm" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-primary-200 truncate">{consultant.name}</p>
        <p className="text-[10px] text-primary-500 truncate">{consultant.role}</p>
      </div>
    </div>

    {/* Day cells */}
    {weekDays.map((day, idx) => {
      const dateKey = formatDateKey(day)
      const dayPlans = plans.filter((p) => p.consultantId === consultant.id && p.date === dateKey)
      const isWeekend = day.getDay() === 0 || day.getDay() === 6

      return (
        <CalendarCell
          key={dateKey}
          dateKey={dateKey}
          plans={dayPlans}
          clients={clients}
          isWeekend={isWeekend}
          onAddPlan={(date) => onAddPlan(date, consultant.id)}
          onOpenDetail={onOpenDetail}
        />
      )
    })}
  </div>
)
