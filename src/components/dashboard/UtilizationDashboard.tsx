import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Users, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import {
  calcConsultantUtilization,
  calcTeamUtilization,
  getThisWeekRange,
  getThisMonthRange,
  DateRange,
} from '../../utils/utilizationCalculator'
import { ConsultantCard } from './ConsultantCard'
import { cn } from '../../utils/cn'

type Period = 'week' | 'month'

const KPICard = ({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string
}) => (
  <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-primary-400 font-medium">{label}</span>
      <div className={cn('p-2 rounded-xl', color)}>
        <Icon size={16} className="text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold text-primary-100">{value}</p>
    {sub && <p className="text-xs text-primary-500 mt-1">{sub}</p>}
  </div>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null
  return (
    <div className="bg-primary-950 border border-primary-700/50 rounded-xl p-3 shadow-xl">
      <p className="text-xs font-semibold text-primary-200 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}%</span>
        </p>
      ))}
    </div>
  )
}

export const UtilizationDashboard = () => {
  const { consultants, plans, teams } = useAppStore()
  const [period, setPeriod] = useState<Period>('week')

  const range: DateRange = period === 'week' ? getThisWeekRange() : getThisMonthRange()

  const allUtilizations = consultants
    .filter((c) => c.isActive)
    .map((c) => ({ consultant: c, util: calcConsultantUtilization(c, plans, range) }))

  const totalWorking = allUtilizations.reduce((sum, { util }) => sum + util.totalWorkingDays, 0)
  const totalAssigned = allUtilizations.reduce((sum, { util }) => sum + util.assignedDays, 0)
  const totalBillable = allUtilizations.reduce((sum, { util }) => sum + util.billableDays, 0)

  const overallOccupancy = totalWorking > 0 ? Math.round((totalAssigned / totalWorking) * 100) : 0
  const overallVacancy = 100 - overallOccupancy
  const avgBillable = totalWorking > 0 ? Math.round((totalBillable / totalWorking) * 100) : 0

  const chartData = allUtilizations.map(({ consultant, util }) => ({
    name: consultant.name.split(' ')[0],
    Doluluk: util.utilizationRate,
    Billable: util.billableRate,
    Boşluk: 100 - util.utilizationRate,
  }))

  const teamData = teams.map((team) => {
    const tu = calcTeamUtilization(team.id, consultants, plans, range)
    return { team, tu }
  })

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-100">Utilizasyon Dashboard</h1>
        <div className="flex bg-primary-900/60 border border-primary-800/40 rounded-xl p-1 gap-1">
          {(['week', 'month'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                period === p
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                  : 'text-primary-400 hover:text-primary-200'
              )}
            >
              {p === 'week' ? 'Bu Hafta' : 'Bu Ay'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard
          icon={Users} label="Genel Doluluk" value={`${overallOccupancy}%`}
          sub={`${totalAssigned}/${totalWorking} gün atanmış`}
          color="bg-primary-600"
        />
        <KPICard
          icon={TrendingDown} label="Genel Boşluk" value={`${overallVacancy}%`}
          sub={`${totalWorking - totalAssigned} gün müsait`}
          color="bg-rose-700"
        />
        <KPICard
          icon={DollarSign} label="Ort. Billable Oran" value={`${avgBillable}%`}
          sub={`${totalBillable} billable gün`}
          color="bg-emerald-700"
        />
      </div>

      {/* Team cards */}
      <div className="grid grid-cols-2 gap-4">
        {teamData.map(({ team, tu }) => (
          <div key={team.id} className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-5">
            <p className="text-sm font-bold text-primary-200 mb-4">{team.name}</p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-100">{tu.overallOccupancy}%</p>
                <p className="text-xs text-primary-500">Doluluk</p>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] text-primary-500 mb-1">
                    <span>Doluluk</span><span>{tu.overallOccupancy}%</span>
                  </div>
                  <div className="h-2 bg-primary-800/60 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" style={{ width: `${tu.overallOccupancy}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-primary-500 mb-1">
                    <span>Billable</span><span className="text-emerald-400">{tu.averageBillableRate}%</span>
                  </div>
                  <div className="h-2 bg-primary-800/60 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full" style={{ width: `${tu.averageBillableRate}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-5">
        <p className="text-sm font-bold text-primary-200 mb-5">Danışman Bazlı Utilizasyon</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#312e81" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#7c3aed', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span style={{ color: '#c4b5fd', fontSize: 12 }}>{v}</span>} />
            <Bar dataKey="Doluluk" fill="#9333ea" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Billable" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Boşluk" fill="#1e1b4b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Individual consultant cards */}
      <div>
        <p className="text-sm font-bold text-primary-200 mb-4">Bireysel Performans</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {allUtilizations.map(({ consultant, util }) => (
            <ConsultantCard key={consultant.id} consultant={consultant} utilization={util} />
          ))}
        </div>
      </div>
    </div>
  )
}
