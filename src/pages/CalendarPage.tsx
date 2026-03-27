import { Plus, Filter, X, Download } from 'lucide-react'
import { useState } from 'react'
import { addDays, endOfWeek } from 'date-fns'
import { useAppStore } from '../store/appStore'
import { WeeklyCalendar } from '../components/calendar/WeeklyCalendar'
import { PlanModal } from '../components/modals/PlanModal'
import { PlanDetailModal } from '../components/modals/PlanDetailModal'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { cn } from '../utils/cn'
import { exportWeeklyPlansToExcel } from '../utils/exportUtils'
import toast from 'react-hot-toast'

export const CalendarPage = () => {
  const { consultants, plans, clients, currentWeekStart, openAddModal, filteredConsultantIds, setFilteredConsultants } = useAppStore()
  const [showFilter, setShowFilter] = useState(false)

  const handleExport = () => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
    const weekStart = currentWeekStart
    const weekPlans = plans.filter((p) => p.date >= weekStart.toISOString().slice(0, 10) && p.date <= weekEnd.toISOString().slice(0, 10))
    exportWeeklyPlansToExcel(weekPlans, consultants, clients, weekStart, weekEnd)
    toast.success('Excel dosyası indirildi!')
  }

  const toggleConsultant = (id: string) => {
    if (filteredConsultantIds.includes(id)) {
      setFilteredConsultants(filteredConsultantIds.filter((c) => c !== id))
    } else {
      setFilteredConsultants([...filteredConsultantIds, id])
    }
  }

  return (
    <div className="p-6 space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary-100">Haftalık Plan Takvimi</h1>
          <p className="text-sm text-primary-500 mt-0.5">Danışman planlarını görüntüle ve yönet</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all',
              showFilter
                ? 'bg-primary-700/30 border-primary-600/50 text-primary-200'
                : 'border-primary-800/40 text-primary-400 hover:border-primary-700/50 hover:text-primary-200'
            )}
          >
            <Filter size={14} />
            Filtrele
            {filteredConsultantIds.length > 0 && (
              <span className="bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {filteredConsultantIds.length}
              </span>
            )}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-primary-800/40 text-primary-400 hover:border-primary-700/50 hover:text-primary-200 transition-all"
          >
            <Download size={14} />
            Excel
          </button>
          <Button onClick={() => openAddModal()}>
            <Plus size={16} />
            Plan Ekle
          </Button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilter && (
        <div className="bg-primary-900/30 border border-primary-800/40 rounded-2xl p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Danışman Filtresi</p>
            {filteredConsultantIds.length > 0 && (
              <button
                onClick={() => setFilteredConsultants([])}
                className="text-xs text-primary-500 hover:text-primary-300 flex items-center gap-1"
              >
                <X size={12} /> Temizle
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {consultants.filter((c) => c.isActive).map((c) => {
              const active = filteredConsultantIds.includes(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => toggleConsultant(c.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border transition-all',
                    active
                      ? 'border-primary-500/60 bg-primary-700/20 text-primary-200'
                      : 'border-primary-800/30 text-primary-400 hover:border-primary-700/40'
                  )}
                >
                  <Avatar initials={c.avatarInitials} color={c.colorTag} size="sm" />
                  {c.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <WeeklyCalendar />
      <PlanModal />
      <PlanDetailModal />
    </div>
  )
}
