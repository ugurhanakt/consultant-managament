import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Edit2, Trash2, Users, FolderKanban } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useAppStore } from '../store/appStore'
import { ProjectModal } from '../components/projects/ProjectModal'
import { Avatar } from '../components/ui/Avatar'
import { cn } from '../utils/cn'
import { ProjectStatus } from '../types/project'
import toast from 'react-hot-toast'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; badge: string }> = {
  active:    { label: 'Aktif',      badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  planned:   { label: 'Planlandı',  badge: 'bg-blue-400/10 text-blue-400 border-blue-400/20' },
  'on-hold': { label: 'Beklemede',  badge: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
  completed: { label: 'Tamamlandı', badge: 'bg-primary-700/30 text-primary-400 border-primary-700/40' },
}

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { projects, clients, consultants, openProjectModal, deleteProject } = useAppStore()

  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="p-6 text-center text-primary-400">
        <p>Proje bulunamadı.</p>
        <button onClick={() => navigate('/projects')} className="mt-3 text-primary-300 hover:text-primary-100 text-sm underline">
          Projeler listesine dön
        </button>
      </div>
    )
  }

  const client = clients.find((c) => c.id === project.clientId)
  const assignedConsultants = consultants.filter((c) => project.assignedConsultantIds.includes(c.id))
  const statusCfg = STATUS_CONFIG[project.status]

  const handleDelete = () => {
    deleteProject(project.id)
    toast.success('Proje silindi')
    navigate('/projects')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-primary-400 hover:text-primary-200 text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Projeler
      </button>

      {/* Header */}
      <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: project.colorTag + '25', border: `1px solid ${project.colorTag}40` }}
            >
              <FolderKanban size={22} style={{ color: project.colorTag }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-primary-100">{project.name}</h1>
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', statusCfg.badge)}>
                  {statusCfg.label}
                </span>
              </div>
              {client && (
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: client.colorAccent }}
                  >
                    {client.logoInitials}
                  </span>
                  <span className="text-sm text-primary-400">{client.name}</span>
                  <span className="text-primary-700">·</span>
                  <span className="text-xs text-primary-500">{client.industry}</span>
                </div>
              )}
              {project.description && (
                <p className="text-sm text-primary-400 mt-2 max-w-2xl">{project.description}</p>
              )}
              {/* Dates */}
              {project.startDate && (
                <div className="flex items-center gap-1.5 mt-3 text-xs text-primary-500">
                  <Calendar size={12} />
                  <span>{format(new Date(project.startDate), 'd MMMM yyyy', { locale: tr })}</span>
                  {project.endDate && (
                    <>
                      <span>→</span>
                      <span>{format(new Date(project.endDate), 'd MMMM yyyy', { locale: tr })}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openProjectModal(project)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-primary-800/40 text-primary-400 hover:border-primary-700/50 hover:text-primary-200 transition-all"
            >
              <Edit2 size={14} />
              Düzenle
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-red-800/30 text-red-400/60 hover:border-red-700/50 hover:text-red-400 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atanmış Danışmanlar */}
        <div className="lg:col-span-2 bg-primary-900/30 border border-primary-800/30 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-primary-800/30">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary-400" />
              <h2 className="text-sm font-bold text-primary-200">Atanmış Danışmanlar</h2>
            </div>
            <span className="text-xs text-primary-500">{assignedConsultants.length} danışman</span>
          </div>

          {assignedConsultants.length > 0 ? (
            <div className="divide-y divide-primary-800/20">
              {assignedConsultants.map((consultant) => {
                const matchedSkills = consultant.skills.filter((s) => project.requiredSkills.includes(s))
                const matchRate = project.requiredSkills.length > 0
                  ? Math.round((matchedSkills.length / project.requiredSkills.length) * 100)
                  : 0

                return (
                  <div
                    key={consultant.id}
                    onClick={() => navigate(`/consultants/${consultant.id}`)}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-primary-800/10 transition-colors cursor-pointer group"
                  >
                    <Avatar initials={consultant.avatarInitials} color={consultant.colorTag} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary-200 group-hover:text-primary-100 transition-colors">
                        {consultant.name}
                      </p>
                      <p className="text-xs text-primary-500">{consultant.role}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {consultant.skills.map((skill) => (
                          <span
                            key={skill}
                            className={cn(
                              'text-[10px] px-1.5 py-0.5 rounded-md',
                              project.requiredSkills.includes(skill)
                                ? 'bg-violet-600/20 border border-violet-500/30 text-violet-300'
                                : 'bg-primary-800/40 border border-primary-700/20 text-primary-500'
                            )}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.requiredSkills.length > 0 && (
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-1 rounded-full shrink-0',
                        matchRate >= 75 ? 'bg-emerald-400/10 text-emerald-400' :
                        matchRate >= 50 ? 'bg-amber-400/10 text-amber-400' :
                        'bg-primary-700/30 text-primary-400'
                      )}>
                        🎯 {matchRate}%
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-12 text-primary-500">
              <Users size={32} className="opacity-30" />
              <p className="text-sm">Henüz danışman atanmadı</p>
              <button
                onClick={() => openProjectModal(project)}
                className="text-xs text-primary-400 hover:text-primary-200 underline"
              >
                Danışman ekle
              </button>
            </div>
          )}
        </div>

        {/* Gerekli Yetkinlikler */}
        <div className="space-y-4">
          <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-primary-200 mb-3">Gerekli Yetkinlikler</h2>
            {project.requiredSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((skill) => {
                  const covered = assignedConsultants.some((c) => c.skills.includes(skill))
                  return (
                    <span
                      key={skill}
                      className={cn(
                        'text-xs px-2.5 py-1 rounded-lg border font-medium',
                        covered
                          ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'
                          : 'bg-primary-800/40 border-primary-700/30 text-primary-400'
                      )}
                    >
                      {covered ? '✓ ' : ''}{skill}
                    </span>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-primary-600 italic">Yetkinlik tanımlanmamış</p>
            )}
            {project.requiredSkills.length > 0 && (
              <div className="mt-3 pt-3 border-t border-primary-800/30">
                <p className="text-xs text-primary-500">
                  {project.requiredSkills.filter((skill) =>
                    assignedConsultants.some((c) => c.skills.includes(skill))
                  ).length} / {project.requiredSkills.length} yetkinlik karşılandı
                </p>
              </div>
            )}
          </div>

          {/* Proje Özeti */}
          <div className="bg-primary-900/30 border border-primary-800/30 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-primary-200 mb-3">Özet</h2>
            <div className="space-y-2">
              {[
                { label: 'Atanmış Danışman', value: `${assignedConsultants.length} kişi` },
                { label: 'Gerekli Beceri', value: `${project.requiredSkills.length} yetkinlik` },
                {
                  label: 'Kapsama Oranı',
                  value: project.requiredSkills.length > 0
                    ? `${Math.round((project.requiredSkills.filter((s) => assignedConsultants.some((c) => c.skills.includes(s))).length / project.requiredSkills.length) * 100)}%`
                    : '-'
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-primary-500">{item.label}</span>
                  <span className="text-xs font-semibold text-primary-300">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProjectModal />
    </div>
  )
}
