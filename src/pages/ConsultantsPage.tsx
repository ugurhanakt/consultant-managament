import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Mail, ArrowRight } from 'lucide-react'

export const ConsultantsPage = () => {
  const { consultants, plans } = useAppStore()
  const navigate = useNavigate()

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-primary-100">Danışmanlar</h1>
        <p className="text-sm text-primary-500 mt-0.5">Tüm danışman profilleri</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {consultants.filter((c) => c.isActive).map((consultant) => {
          const totalPlans = plans.filter((p) => p.consultantId === consultant.id).length
          return (
            <div
              key={consultant.id}
              onClick={() => navigate(`/consultants/${consultant.id}`)}
              className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-5 hover:border-primary-600/50 hover:bg-primary-800/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar initials={consultant.avatarInitials} color={consultant.colorTag} size="lg" />
                <div>
                  <p className="text-sm font-bold text-primary-100">{consultant.name}</p>
                  <p className="text-xs text-primary-400">{consultant.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary-500 mb-3">
                <Mail size={11} />
                {consultant.email}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {consultant.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-primary-500">{totalPlans} toplam plan</p>
                <ArrowRight size={14} className="text-primary-600 group-hover:text-primary-400 transition-colors" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
