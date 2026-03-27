import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react'
import { addDays } from 'date-fns'
import { useAppStore } from '../../store/appStore'
import { getWeekDays, getWeekLabel, formatDay, isToday } from '../../utils/dateUtils'
import { ConsultantRow } from './ConsultantRow'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'
import { planTypeConfig } from '../ui/Badge'
import { PlanType } from '../../types/plan'

export const WeeklyCalendar = () => {
  const {
    currentWeekStart, setCurrentWeek,
    consultants, plans, clients,
    filteredConsultantIds,
    openAddModal, openDetailModal,
  } = useAppStore()

  const weekDays = getWeekDays(currentWeekStart)
  const visibleConsultants = filteredConsultantIds.length > 0
    ? consultants.filter((c) => filteredConsultantIds.includes(c.id))
    : consultants.filter((c) => c.isActive)

  const goToPrev = () => setCurrentWeek(addDays(currentWeekStart, -7))
  const goToNext = () => setCurrentWeek(addDays(currentWeekStart, 7))
  const goToToday = () => setCurrentWeek(addDays(new Date(), -(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)))

  return (
    <div className="flex flex-col gap-4">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrev}
              className="p-1.5 rounded-lg hover:bg-primary-800/40 text-primary-400 hover:text-primary-200 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goToNext}
              className="p-1.5 rounded-lg hover:bg-primary-800/40 text-primary-400 hover:text-primary-200 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <h2 className="text-base font-semibold text-primary-100 capitalize">
            {getWeekLabel(currentWeekStart)}
          </h2>
          <button
            onClick={goToToday}
            className="text-xs text-primary-400 hover:text-primary-200 border border-primary-700/50 hover:border-primary-600 px-2.5 py-1 rounded-lg transition-all duration-150"
          >
            Bugün
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3">
          {(Object.entries(planTypeConfig) as [PlanType, typeof planTypeConfig[PlanType]][]).map(([type, cfg]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', cfg.dot)} />
              <span className="text-[11px] text-primary-400">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl border border-primary-800/40 overflow-hidden bg-primary-900/20">
        {/* Day headers */}
        <div className="grid border-b border-primary-800/40" style={{ gridTemplateColumns: '200px repeat(7, 1fr)' }}>
          <div className="px-3 py-3 bg-primary-950/60 border-r border-primary-800/30">
            <span className="text-xs font-medium text-primary-500">Danışman</span>
          </div>
          {weekDays.map((day) => {
            const today = isToday(day)
            const isWeekend = day.getDay() === 0 || day.getDay() === 6
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'px-2 py-3 text-center border-r border-primary-800/30 last:border-r-0',
                  today ? 'bg-primary-700/20' : 'bg-primary-950/60',
                  isWeekend && 'opacity-50'
                )}
              >
                <p className={cn('text-xs font-medium capitalize', today ? 'text-primary-300' : 'text-primary-500')}>
                  {formatDay(day)}
                </p>
                {today && <div className="w-1 h-1 rounded-full bg-primary-400 mx-auto mt-1" />}
              </div>
            )
          })}
        </div>

        {/* Consultant rows */}
        <div className="divide-y divide-primary-800/20">
          {visibleConsultants.map((consultant) => (
            <ConsultantRow
              key={consultant.id}
              consultant={consultant}
              weekDays={weekDays}
              plans={plans}
              clients={clients}
              onAddPlan={(date, consultantId) => openAddModal(date, consultantId)}
              onOpenDetail={openDetailModal}
            />
          ))}
        </div>

        {visibleConsultants.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-primary-500">
            <CalendarCheck size={40} className="opacity-30" />
            <p className="text-sm">Gösterilecek danışman yok</p>
          </div>
        )}
      </div>
    </div>
  )
}
