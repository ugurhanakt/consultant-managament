import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Calendar, TrendingUp, DollarSign, Building2, Clock } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useAppStore } from '../store/appStore'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { calcConsultantUtilization, getThisMonthRange } from '../utils/utilizationCalculator'
import { cn } from '../utils/cn'

const planTypeLabels: Record<string, string> = {
  onsite: 'Yerinde', remote: 'Remote', internal: 'İç Proje', leave: 'İzin', training: 'Eğitim',
}
const planTypeColors: Record<string, string> = {
  onsite: '#10b981', remote: '#0ea5e9', internal: '#f59e0b', leave: '#f97316', training: '#8b5cf6',
}
const statusConfig: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Onaylı', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  tentative: { label: 'Taslak', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  cancelled: { label: 'İptal', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
}

const StatCard = ({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string
}) => (
  <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-primary-400 font-medium">{label}</span>
      <div className={cn('p-2 rounded-xl', color)}>
        <Icon size={14} className="text-white" />
      </div>
    </div>
    <p className="text-2xl font-bold text-primary-100">{value}</p>
    {sub && <p className="text-xs text-primary-500 mt-1">{sub}</p>}
  </div>
)

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-primary-950 border border-primary-700/50 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-primary-200">{payload[0].name}</p>
      <p className="text-xs text-primary-400">{payload[0].value} gün</p>
    </div>
  )
}

export const ConsultantProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { consultants, plans, clients } = useAppStore()

  const consultant = consultants.find((c) => c.id === id)

  if (!consultant) {
    return (
      <div className="p-6 text-center text-primary-400">
        <p>Danışman bulunamadı.</p>
        <button onClick={() => navigate('/consultants')} className="mt-3 text-primary-300 hover:text-primary-100 text-sm underline">
          Danışmanlar listesine dön
        </button>
      </div>
    )
  }

  const range = getThisMonthRange()
  const util = calcConsultantUtilization(consultant, plans, range)
  const consultantPlans = plans
    .filter((p) => p.consultantId === consultant.id && p.status !== 'cancelled')
    .sort((a, b) => b.date.localeCompare(a.date))

  // Müşteri dağılımı
  const clientCounts: Record<string, number> = {}
  consultantPlans.forEach((p) => {
    clientCounts[p.clientId] = (clientCounts[p.clientId] || 0) + 1
  })
  const pieData = Object.entries(clientCounts)
    .map(([clientId, count]) => ({
      name: clients.find((c) => c.id === clientId)?.name ?? 'Bilinmiyor',
      value: count,
      color: clients.find((c) => c.id === clientId)?.colorAccent ?? '#9333ea',
    }))
    .sort((a, b) => b.value - a.value)

  const topClient = pieData[0]

  return (
    <div className="p-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/consultants')}
        className="flex items-center gap-2 text-primary-400 hover:text-primary-200 text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Danışmanlar
      </button>

      {/* Profile Header */}
      <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <Avatar initials={consultant.avatarInitials} color={consultant.colorTag} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-primary-100">{consultant.name}</h1>
              <span className="px-3 py-1 rounded-full bg-primary-700/30 border border-primary-600/30 text-xs text-primary-300 font-medium">
                {consultant.role}
              </span>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                consultant.isActive
                  ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'
                  : 'bg-red-400/10 border-red-400/20 text-red-400'
              )}>
                {consultant.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-primary-400">
              <Mail size={13} />
              <span>{consultant.email}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {consultant.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Toplam Plan (Bu Ay)" value={String(util.assignedDays)}
          sub={`${util.totalWorkingDays} çalışma günü`} color="bg-primary-600" />
        <StatCard icon={TrendingUp} label="Doluluk Oranı" value={`${util.utilizationRate}%`}
          sub={`${util.assignedDays} atanmış gün`} color="bg-violet-600" />
        <StatCard icon={DollarSign} label="Billable Oran" value={`${util.billableRate}%`}
          sub={`${util.billableDays} billable gün`} color="bg-emerald-600" />
        <StatCard icon={Building2} label="En Aktif Müşteri" value={topClient?.name ?? '-'}
          sub={topClient ? `${topClient.value} ziyaret` : undefined} color="bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Müşteri Dağılımı */}
        <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-primary-200 mb-4">Müşteri Dağılımı</h2>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <div className="w-36 h-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={60}
                      dataKey="value" paddingAngle={2}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {pieData.slice(0, 5).map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-primary-300 truncate">{item.name}</span>
                    </div>
                    <span className="text-xs text-primary-400 font-medium ml-2 shrink-0">{item.value}g</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-primary-500 text-center py-8">Henüz plan yok</p>
          )}
        </div>

        {/* Utilizasyon Özeti */}
        <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-primary-200 mb-4">Bu Ay Özeti</h2>
          <div className="space-y-4">
            {[
              { label: 'Doluluk', value: util.utilizationRate, color: 'bg-primary-500' },
              { label: 'Billable', value: util.billableRate, color: 'bg-emerald-500' },
              { label: 'Boşluk', value: 100 - util.utilizationRate, color: 'bg-primary-800' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-primary-400 mb-1">
                  <span>{item.label}</span>
                  <span className="font-semibold text-primary-200">{item.value}%</span>
                </div>
                <div className="h-2 bg-primary-800/60 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', item.color)}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Son Planlar */}
      <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-primary-800/30">
          <h2 className="text-sm font-bold text-primary-200">Son Planlar</h2>
        </div>
        {consultantPlans.length > 0 ? (
          <div className="divide-y divide-primary-800/20">
            {consultantPlans.slice(0, 10).map((plan) => {
              const client = clients.find((c) => c.id === plan.clientId)
              const status = statusConfig[plan.status]
              const totalHours = plan.tasks.reduce((s, t) => s + (t.estimatedHours || 0), 0)
              return (
                <div key={plan.id} className="flex items-center gap-4 px-5 py-3 hover:bg-primary-800/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: client?.colorAccent ?? '#9333ea' }}>
                    {client?.logoInitials ?? '??'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary-200 truncate">{client?.name ?? 'Bilinmiyor'}</p>
                    <p className="text-[10px] text-primary-500">
                      {planTypeLabels[plan.type]}
                      {plan.tasks.length > 0 && ` · ${plan.tasks[0].title}${plan.tasks.length > 1 ? ` +${plan.tasks.length - 1}` : ''}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-primary-300">
                      {format(new Date(plan.date), 'd MMM', { locale: tr })}
                    </p>
                    {plan.startTime && (
                      <p className="text-[10px] text-primary-500 flex items-center gap-1 justify-end">
                        <Clock size={9} />
                        {plan.startTime}{plan.endTime && `–${plan.endTime}`}
                      </p>
                    )}
                  </div>
                  {totalHours > 0 && (
                    <span className="text-[10px] text-primary-400 shrink-0 w-8 text-right">{totalHours}s</span>
                  )}
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0', status.color)}>
                    {status.label}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-primary-500 text-sm">
            Henüz plan eklenmemiş
          </div>
        )}
      </div>
    </div>
  )
}
