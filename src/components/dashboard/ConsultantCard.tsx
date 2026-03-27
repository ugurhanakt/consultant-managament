import { Consultant } from '../../types/consultant'
import { ConsultantUtilization } from '../../types/utilization'
import { Avatar } from '../ui/Avatar'
import { OccupancyGauge } from './OccupancyGauge'

interface Props {
  consultant: Consultant
  utilization: ConsultantUtilization
}

export const ConsultantCard = ({ consultant, utilization }: Props) => (
  <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-4 hover:border-primary-700/50 transition-colors">
    <div className="flex items-center gap-3 mb-4">
      <Avatar initials={consultant.avatarInitials} color={consultant.colorTag} size="md" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-primary-100 truncate">{consultant.name}</p>
        <p className="text-xs text-primary-500 truncate">{consultant.role}</p>
      </div>
      <OccupancyGauge value={utilization.utilizationRate} size={52} color={consultant.colorTag} />
    </div>

    <div className="space-y-2">
      {/* Utilization bar */}
      <div>
        <div className="flex justify-between text-[10px] text-primary-500 mb-1">
          <span>Doluluk</span>
          <span>{utilization.assignedDays}/{utilization.totalWorkingDays} gün</span>
        </div>
        <div className="h-1.5 bg-primary-800/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-700"
            style={{ width: `${utilization.utilizationRate}%` }}
          />
        </div>
      </div>

      {/* Billable bar */}
      <div>
        <div className="flex justify-between text-[10px] text-primary-500 mb-1">
          <span>Billable</span>
          <span className="text-emerald-400">{utilization.billableRate}%</span>
        </div>
        <div className="h-1.5 bg-primary-800/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${utilization.billableRate}%` }}
          />
        </div>
      </div>
    </div>

    <div className="flex flex-wrap gap-1 mt-3">
      {consultant.skills.slice(0, 3).map((skill) => (
        <span key={skill} className="text-[10px] bg-primary-800/40 text-primary-400 px-2 py-0.5 rounded-full">
          {skill}
        </span>
      ))}
    </div>
  </div>
)
