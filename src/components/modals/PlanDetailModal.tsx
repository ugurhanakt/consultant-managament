import { X, MapPin, Clock, Edit2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { Badge, planTypeConfig, planStatusConfig } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../utils/cn'

const statusIcons = { confirmed: CheckCircle2, tentative: AlertCircle, cancelled: XCircle }

export const PlanDetailModal = () => {
  const { isPlanDetailOpen, selectedPlan, closeModals, openEditModal, consultants, clients } = useAppStore()

  if (!isPlanDetailOpen || !selectedPlan) return null

  const consultant = consultants.find((c) => c.id === selectedPlan.consultantId)
  const client = clients.find((c) => c.id === selectedPlan.clientId)
  const typeConfig = planTypeConfig[selectedPlan.type]
  const statusCfg = planStatusConfig[selectedPlan.status]
  const StatusIcon = statusIcons[selectedPlan.status]

  const totalHours = selectedPlan.tasks.reduce((sum, t) => sum + t.estimatedHours, 0)
  const billableHours = selectedPlan.tasks.filter((t) => t.isBillable).reduce((sum, t) => sum + t.estimatedHours, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModals}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative bg-primary-950 border border-primary-800/60 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50 animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colored top bar */}
        <div className={cn('h-1.5 w-full', typeConfig.dot.replace('bg-', 'bg-'))} />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            {consultant && (
              <Avatar initials={consultant.avatarInitials} color={consultant.colorTag} size="md" />
            )}
            <div>
              <p className="text-sm font-bold text-primary-100">{consultant?.name}</p>
              <p className="text-xs text-primary-400">{consultant?.role}</p>
            </div>
          </div>
          <button onClick={closeModals} className="p-1.5 rounded-lg hover:bg-primary-800/40 text-primary-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Client + Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: client?.colorAccent }}>
                {client?.logoInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-100">{client?.name}</p>
                <p className="text-xs text-primary-500">{client?.industry}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusCfg.variant}>
                <StatusIcon size={10} />
                {statusCfg.label}
              </Badge>
              <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', typeConfig.color, typeConfig.bg, 'border-current/20')}>
                {typeConfig.label}
              </span>
            </div>
          </div>

          {/* Date + Time + Location */}
          <div className={`grid gap-3 ${selectedPlan.startTime ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <div className="bg-primary-900/40 rounded-xl p-3">
              <p className="text-[10px] text-primary-500 mb-1 uppercase tracking-wide">Tarih</p>
              <p className="text-sm font-semibold text-primary-200">{selectedPlan.date}</p>
            </div>
            {selectedPlan.startTime && (
              <div className="bg-primary-900/40 rounded-xl p-3">
                <p className="text-[10px] text-primary-500 mb-1 uppercase tracking-wide flex items-center gap-1">
                  <Clock size={9} />Saat
                </p>
                <p className="text-sm font-semibold text-primary-200">
                  {selectedPlan.startTime}
                  {selectedPlan.endTime && <span className="text-primary-400"> – {selectedPlan.endTime}</span>}
                </p>
              </div>
            )}
            <div className="bg-primary-900/40 rounded-xl p-3">
              <p className="text-[10px] text-primary-500 mb-1 uppercase tracking-wide flex items-center gap-1">
                <MapPin size={9} />Konum
              </p>
              <p className="text-sm font-semibold text-primary-200 truncate">{selectedPlan.location || '—'}</p>
            </div>
          </div>

          {/* Hours summary */}
          <div className="flex items-center gap-4 px-3 py-2.5 bg-primary-900/30 rounded-xl border border-primary-800/30">
            <Clock size={14} className="text-primary-400" />
            <span className="text-xs text-primary-300">
              <span className="font-bold text-primary-100">{totalHours}s</span> toplam
            </span>
            <span className="text-xs text-primary-300">
              <span className="font-bold text-emerald-400">{billableHours}s</span> billable
            </span>
            <span className="text-xs text-primary-300">
              <span className="font-bold text-primary-400">{totalHours - billableHours}s</span> non-billable
            </span>
          </div>

          {/* Tasks */}
          {selectedPlan.tasks.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Görevler</p>
              <div className="space-y-1.5">
                {selectedPlan.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-3 py-2 bg-primary-900/30 rounded-lg">
                    <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', task.isBillable ? 'bg-emerald-400' : 'bg-primary-600')} />
                    <span className="text-sm text-primary-200 flex-1">{task.title}</span>
                    <span className="text-xs text-primary-500">{task.estimatedHours}s</span>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', task.isBillable ? 'text-emerald-400 bg-emerald-900/40' : 'text-primary-500 bg-primary-800/40')}>
                      {task.isBillable ? 'Billable' : 'Non-bill'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedPlan.notes && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Notlar</p>
              <p className="text-sm text-primary-300 leading-relaxed bg-primary-900/30 rounded-xl p-3">
                {selectedPlan.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={closeModals}>Kapat</Button>
            <Button variant="secondary" size="sm" onClick={() => openEditModal(selectedPlan)}>
              <Edit2 size={13} />
              Düzenle
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
