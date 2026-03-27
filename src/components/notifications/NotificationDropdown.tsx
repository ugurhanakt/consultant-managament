import { useEffect, useRef } from 'react'
import { CheckCircle, Clock, Calendar, AlertCircle, X } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { Plan } from '../../types/plan'
import { cn } from '../../utils/cn'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
}

const planTypeLabels: Record<string, string> = {
  onsite: 'Yerinde', remote: 'Remote', internal: 'İç Proje', leave: 'İzin', training: 'Eğitim',
}

export const NotificationDropdown = ({ onClose }: Props) => {
  const { plans, consultants, clients, updatePlan } = useAppStore()
  const ref = useRef<HTMLDivElement>(null)

  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

  const draftPlans = plans.filter((p) => p.status === 'tentative')
  const todayPlans = plans.filter((p) => p.date === today && p.status !== 'cancelled')
  const tomorrowPlans = plans.filter((p) => p.date === tomorrow && p.status !== 'cancelled')

  const getConsultantName = (id: string) => consultants.find((c) => c.id === id)?.name ?? '-'
  const getClientName = (id: string) => clients.find((c) => c.id === id)?.name ?? '-'

  const handleApprove = (plan: Plan) => {
    updatePlan({ ...plan, status: 'confirmed' })
    toast.success(`"${getClientName(plan.clientId)}" planı onaylandı!`)
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const PlanRow = ({ plan, showApprove }: { plan: Plan; showApprove?: boolean }) => (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-primary-800/20 transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-primary-800/60 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[10px] font-bold text-primary-300">
          {getConsultantName(plan.consultantId).split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-primary-200 truncate">{getClientName(plan.clientId)}</p>
        <p className="text-[10px] text-primary-500 truncate">
          {getConsultantName(plan.consultantId)} · {planTypeLabels[plan.type]}
          {plan.startTime && ` · ${plan.startTime}${plan.endTime ? `–${plan.endTime}` : ''}`}
        </p>
      </div>
      {showApprove && (
        <button
          onClick={() => handleApprove(plan)}
          className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-600/40 transition-colors"
        >
          <CheckCircle size={10} />
          Onayla
        </button>
      )}
    </div>
  )

  const Section = ({ icon: Icon, title, color, children, empty }: {
    icon: React.ElementType; title: string; color: string; children: React.ReactNode; empty: string
  }) => (
    <div>
      <div className={cn('flex items-center gap-2 px-4 py-2 border-b border-primary-800/30', color)}>
        <Icon size={12} />
        <span className="text-[11px] font-semibold uppercase tracking-wide">{title}</span>
      </div>
      {children}
      {!children && (
        <p className="px-4 py-3 text-[11px] text-primary-600 italic">{empty}</p>
      )}
    </div>
  )

  const totalCount = draftPlans.length + todayPlans.length

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-primary-950 border border-primary-800/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary-800/40">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary-100">Bildirimler</span>
          {totalCount > 0 && (
            <span className="bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {totalCount}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-primary-500 hover:text-primary-300 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {/* Onay Bekleyenler */}
        <div>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-primary-800/30 text-amber-400/80">
            <AlertCircle size={12} />
            <span className="text-[11px] font-semibold uppercase tracking-wide">
              Onay Bekleyenler ({draftPlans.length})
            </span>
          </div>
          {draftPlans.length > 0
            ? draftPlans.slice(0, 5).map((p) => <PlanRow key={p.id} plan={p} showApprove />)
            : <p className="px-4 py-3 text-[11px] text-primary-600 italic">Onay bekleyen plan yok</p>
          }
        </div>

        {/* Bugün */}
        <div>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-primary-800/30 border-t border-t-primary-800/20 text-primary-400/80">
            <Clock size={12} />
            <span className="text-[11px] font-semibold uppercase tracking-wide">
              Bugün — {format(new Date(), 'd MMMM', { locale: tr })} ({todayPlans.length})
            </span>
          </div>
          {todayPlans.length > 0
            ? todayPlans.slice(0, 5).map((p) => <PlanRow key={p.id} plan={p} />)
            : <p className="px-4 py-3 text-[11px] text-primary-600 italic">Bugün için plan yok</p>
          }
        </div>

        {/* Yarın */}
        <div>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-primary-800/30 border-t border-t-primary-800/20 text-primary-400/80">
            <Calendar size={12} />
            <span className="text-[11px] font-semibold uppercase tracking-wide">
              Yarın — {format(new Date(Date.now() + 86400000), 'd MMMM', { locale: tr })} ({tomorrowPlans.length})
            </span>
          </div>
          {tomorrowPlans.length > 0
            ? tomorrowPlans.slice(0, 5).map((p) => <PlanRow key={p.id} plan={p} />)
            : <p className="px-4 py-3 text-[11px] text-primary-600 italic">Yarın için plan yok</p>
          }
        </div>
      </div>

      {totalCount === 0 && todayPlans.length === 0 && tomorrowPlans.length === 0 && (
        <div className="px-4 py-6 text-center">
          <CheckCircle size={28} className="text-primary-700 mx-auto mb-2" />
          <p className="text-xs text-primary-500">Tüm planlar güncel 🎉</p>
        </div>
      )}
    </div>
  )
}
