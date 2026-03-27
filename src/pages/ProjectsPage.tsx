import { useNavigate } from 'react-router-dom'
import { Plus, FolderKanban, Calendar, Users } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useAppStore } from '../store/appStore'
import { ProjectModal } from '../components/projects/ProjectModal'
import { Avatar } from '../components/ui/Avatar'
import { cn } from '../utils/cn'
import { ProjectStatus } from '../types/project'
import { Button } from '../components/ui/Button'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; dot: string; badge: string }> = {
  active:    { label: 'Aktif',      dot: 'bg-emerald-400', badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  planned:   { label: 'Planlandı',  dot: 'bg-blue-400',    badge: 'bg-blue-400/10 text-blue-400 border-blue-400/20' },
  'on-hold': { label: 'Beklemede',  dot: 'bg-amber-400',   badge: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
  completed: { label: 'Tamamlandı', dot: 'bg-primary-500', badge: 'bg-primary-700/30 text-primary-400 border-primary-700/40' },
}

export const ProjectsPage = () => {
  const navigate = useNavigate()
  const { projects, clients, consultants, openProjectModal } = useAppStore()

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary-100">Projeler</h1>
          <p className="text-sm text-primary-500 mt-0.5">
            {projects.length} proje · {projects.filter((p) => p.status === 'active').length} aktif
          </p>
        </div>
        <Button onClick={() => openProjectModal()}>
          <Plus size={16} />
          Yeni Proje
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-3">
        {(Object.entries(STATUS_CONFIG) as [ProjectStatus, typeof STATUS_CONFIG[ProjectStatus]][]).map(([status, cfg]) => {
          const count = projects.filter((p) => p.status === status).length
          return (
            <div key={status} className="bg-primary-900/20 border border-primary-800/30 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className={cn('w-2 h-2 rounded-full', cfg.dot)} />
              <div>
                <p className="text-xs text-primary-500">{cfg.label}</p>
                <p className="text-lg font-bold text-primary-200">{count}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Project Cards */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-primary-500">
          <FolderKanban size={40} className="opacity-30" />
          <p className="text-sm">Henüz proje yok</p>
          <button onClick={() => openProjectModal()} className="text-xs text-primary-400 hover:text-primary-200 underline">
            İlk projeyi ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => {
            const client = clients.find((c) => c.id === project.clientId)
            const assignedConsultants = consultants.filter((c) => project.assignedConsultantIds.includes(c.id))
            const statusCfg = STATUS_CONFIG[project.status]

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-5 hover:border-primary-600/50 hover:bg-primary-800/20 transition-all cursor-pointer group"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: project.colorTag + '30', border: `1px solid ${project.colorTag}40` }}
                    >
                      <FolderKanban size={16} style={{ color: project.colorTag }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-primary-100 group-hover:text-white transition-colors truncate">
                        {project.name}
                      </p>
                      {client && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                            style={{ backgroundColor: client.colorAccent }}
                          >
                            {client.logoInitials[0]}
                          </span>
                          <span className="text-[10px] text-primary-500 truncate">{client.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0', statusCfg.badge)}>
                    {statusCfg.label}
                  </span>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-xs text-primary-500 mb-3 line-clamp-2">{project.description}</p>
                )}

                {/* Skills */}
                {project.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.requiredSkills.slice(0, 4).map((skill) => (
                      <span key={skill} className="text-[10px] px-2 py-0.5 bg-primary-800/40 border border-primary-700/30 rounded-md text-primary-400">
                        {skill}
                      </span>
                    ))}
                    {project.requiredSkills.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 bg-primary-800/40 border border-primary-700/30 rounded-md text-primary-500">
                        +{project.requiredSkills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-primary-800/20">
                  {/* Assigned avatars */}
                  <div className="flex items-center">
                    {assignedConsultants.slice(0, 4).map((c, i) => (
                      <div key={c.id} className="border-2 border-primary-950 rounded-full" style={{ marginLeft: i > 0 ? '-8px' : 0 }}>
                        <Avatar initials={c.avatarInitials} color={c.colorTag} size="sm" />
                      </div>
                    ))}
                    {assignedConsultants.length > 4 && (
                      <div className="w-7 h-7 rounded-full bg-primary-800 border-2 border-primary-950 flex items-center justify-center text-[9px] text-primary-400 font-bold" style={{ marginLeft: '-8px' }}>
                        +{assignedConsultants.length - 4}
                      </div>
                    )}
                    {assignedConsultants.length === 0 && (
                      <span className="text-[10px] text-primary-600 flex items-center gap-1">
                        <Users size={10} /> Danışman atanmadı
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  {project.startDate && (
                    <div className="flex items-center gap-1 text-[10px] text-primary-600">
                      <Calendar size={10} />
                      {format(new Date(project.startDate), 'd MMM yy', { locale: tr })}
                      {project.endDate && ` – ${format(new Date(project.endDate), 'd MMM yy', { locale: tr })}`}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ProjectModal />
    </div>
  )
}
