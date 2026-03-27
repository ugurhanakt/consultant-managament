import { useState, useEffect, useMemo } from 'react'
import { X, Sparkles, Check, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppStore } from '../../store/appStore'
import { Project, ProjectStatus, SECTORS } from '../../types/project'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../utils/cn'
import { suggestConsultantsForProject } from '../../utils/consultantSuggestions'

const generateId = () => 'pr' + Math.random().toString(36).slice(2, 8)

const ALL_SKILLS = [
  'SAP FI', 'SAP CO', 'SAP MM', 'SAP SD', 'SAP PP', 'SAP PM',
  'SAP HR', 'SAP WM', 'SAP EWM', 'SAP BI', 'SAP BW',
  'S/4HANA', 'S/4HANA Migration', 'ABAP', 'ABAP OO', 'Fiori',
  'BTP', 'SuccessFactors', 'Payroll', 'Analytics Cloud', 'HANA',
  'MES', 'TM', 'Proje Yönetimi',
]

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'active',    label: '🟢 Aktif' },
  { value: 'planned',   label: '🔵 Planlandı' },
  { value: 'on-hold',   label: '🟡 Beklemede' },
  { value: 'completed', label: '⚫ Tamamlandı' },
]

const PROJECT_COLORS = ['#9333ea','#0ea5e9','#10b981','#f59e0b','#ef4444','#ec4899','#6b7280','#8b5cf6']

export const ProjectModal = () => {
  const { isProjectModalOpen, editingProject, closeProjectModal, addProject, updateProject, consultants } = useAppStore()
  const isEdit = !!editingProject

  const [name, setName] = useState('')
  const [sectors, setSectors] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('active')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [requiredSkills, setRequiredSkills] = useState<string[]>([])
  const [assignedIds, setAssignedIds] = useState<string[]>([])
  const [colorTag, setColorTag] = useState(PROJECT_COLORS[0])
  const [skillSearch, setSkillSearch] = useState('')

  useEffect(() => {
    if (!isProjectModalOpen) return
    if (editingProject) {
      setName(editingProject.name)
      setSectors(editingProject.sectors)
      setDescription(editingProject.description)
      setStatus(editingProject.status)
      setStartDate(editingProject.startDate)
      setEndDate(editingProject.endDate ?? '')
      setRequiredSkills(editingProject.requiredSkills)
      setAssignedIds(editingProject.assignedConsultantIds)
      setColorTag(editingProject.colorTag)
    } else {
      setName(''); setSectors([]); setDescription('')
      setStatus('active'); setStartDate(''); setEndDate('')
      setRequiredSkills([]); setAssignedIds([])
      setColorTag(PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)])
    }
    setSkillSearch('')
  }, [isProjectModalOpen, editingProject])

  const suggestions = useMemo(
    () => suggestConsultantsForProject(requiredSkills, consultants, assignedIds),
    [requiredSkills, consultants, assignedIds]
  )

  const toggleSector = (sector: string) =>
    setSectors((prev) => prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector])

  const toggleSkill = (skill: string) =>
    setRequiredSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill])

  const toggleAssign = (id: string) =>
    setAssignedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])

  const filteredSkills = skillSearch
    ? ALL_SKILLS.filter((s) => s.toLowerCase().includes(skillSearch.toLowerCase()))
    : ALL_SKILLS

  const handleSave = () => {
    if (!name.trim()) return toast.error('Proje / Müşteri adı gerekli')
    if (!startDate) return toast.error('Başlangıç tarihi gerekli')

    const project: Project = {
      id: isEdit ? editingProject!.id : generateId(),
      name: name.trim(),
      sectors,
      description: description.trim(),
      status,
      startDate,
      endDate: endDate || undefined,
      requiredSkills,
      assignedConsultantIds: assignedIds,
      colorTag,
      createdAt: isEdit ? editingProject!.createdAt : new Date().toISOString(),
    }

    isEdit ? updateProject(project) : addProject(project)
    toast.success(isEdit ? 'Proje güncellendi!' : 'Proje oluşturuldu!')
    closeProjectModal()
  }

  if (!isProjectModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeProjectModal} />
      <div className="relative bg-primary-950 border border-primary-800/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary-800/40 sticky top-0 bg-primary-950 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: colorTag }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <h2 className="text-base font-bold text-primary-100">
              {isEdit ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
            </h2>
          </div>
          <button onClick={closeProjectModal} className="text-primary-500 hover:text-primary-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Proje Adı + Renk */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="Proje / Müşteri Adı"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="örn. Arçelik A.Ş., MEM Solar..."
              />
            </div>
            <div className="shrink-0">
              <label className="block text-xs font-medium text-primary-300 mb-1.5">Renk</label>
              <div className="flex gap-1.5">
                {PROJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorTag(c)}
                    className={cn('w-6 h-6 rounded-full border-2 transition-all',
                      colorTag === c ? 'border-white scale-110' : 'border-transparent')}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sektörler (çoktan seçmeli) */}
          <div>
            <label className="block text-xs font-medium text-primary-300 mb-2">
              Sektör
              {sectors.length > 0 && (
                <span className="ml-2 text-primary-500">({sectors.length} seçili)</span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((sector) => {
                const selected = sectors.includes(sector)
                return (
                  <button
                    key={sector}
                    onClick={() => toggleSector(sector)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                      selected
                        ? 'border-violet-500/60 bg-violet-600/20 text-violet-200'
                        : 'border-primary-800/40 text-primary-500 hover:border-primary-700/60 hover:text-primary-300'
                    )}
                  >
                    {selected && <Check size={9} className="inline mr-1" />}
                    {sector}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Durum */}
          <div>
            <label className="block text-xs font-medium text-primary-300 mb-1.5">Durum</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full bg-primary-900/60 border border-primary-700/50 text-primary-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} className="bg-primary-900">{s.label}</option>
              ))}
            </select>
          </div>

          {/* Açıklama */}
          <Textarea
            label="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Proje kapsamı, hedefler..."
            rows={2}
          />

          {/* Tarihler */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Başlangıç Tarihi" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input label="Bitiş Tarihi (opsiyonel)" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          {/* Gerekli Yetkinlikler */}
          <div>
            <label className="block text-xs font-medium text-primary-300 mb-2">
              Gerekli Yetkinlikler
              {requiredSkills.length > 0 && (
                <span className="ml-2 text-primary-500">({requiredSkills.length} seçili)</span>
              )}
            </label>
            <input
              className="w-full bg-primary-900/40 border border-primary-700/30 text-primary-200 placeholder-primary-600 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary-500 mb-2"
              placeholder="Yetkinlik ara..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-1.5">
              {filteredSkills.map((skill) => {
                const selected = requiredSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all',
                      selected
                        ? 'bg-primary-600/30 border-primary-500/60 text-primary-200'
                        : 'border-primary-800/40 text-primary-500 hover:border-primary-700/60 hover:text-primary-300'
                    )}
                  >
                    {selected && <Check size={9} className="inline mr-1" />}
                    {skill}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ✨ Danışman Önerileri */}
          {suggestions.length > 0 && (
            <div className="bg-primary-900/30 border border-violet-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} className="text-violet-400" />
                <span className="text-xs font-semibold text-violet-300">Yetkinliğe Göre Danışman Önerileri</span>
              </div>
              <div className="space-y-2">
                {suggestions.map(({ consultant, matchRate, matchedSkills }) => {
                  const isAssigned = assignedIds.includes(consultant.id)
                  return (
                    <div key={consultant.id} className="flex items-center gap-3">
                      <Avatar initials={consultant.avatarInitials} color={consultant.colorTag} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary-200 truncate">{consultant.name}</p>
                        <p className="text-[10px] text-primary-500 truncate">{matchedSkills.join(' · ')}</p>
                      </div>
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0',
                        matchRate >= 75 ? 'bg-emerald-400/10 text-emerald-400' :
                        matchRate >= 50 ? 'bg-amber-400/10 text-amber-400' :
                        'bg-primary-700/30 text-primary-400'
                      )}>
                        🎯 {matchRate}%
                      </span>
                      <button
                        onClick={() => toggleAssign(consultant.id)}
                        className={cn(
                          'shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all',
                          isAssigned
                            ? 'bg-primary-700/30 border-primary-600/40 text-primary-300'
                            : 'bg-violet-600/20 border-violet-500/40 text-violet-300 hover:bg-violet-600/40'
                        )}
                      >
                        {isAssigned ? '✓ Eklendi' : '+ Ekle'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tüm Danışmanlar */}
          <div>
            <label className="block text-xs font-medium text-primary-300 mb-2">Danışman Ata</label>
            <div className="flex flex-wrap gap-2">
              {consultants.filter((c) => c.isActive).map((c) => {
                const assigned = assignedIds.includes(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleAssign(c.id)}
                    className={cn(
                      'flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs border transition-all',
                      assigned
                        ? 'border-primary-500/60 bg-primary-700/20 text-primary-200'
                        : 'border-primary-800/30 text-primary-500 hover:border-primary-700/40 hover:text-primary-300'
                    )}
                  >
                    <Avatar initials={c.avatarInitials} color={c.colorTag} size="sm" />
                    {c.name}
                    {assigned && <Check size={10} className="text-primary-400" />}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-primary-800/40 sticky bottom-0 bg-primary-950">
          <button onClick={closeProjectModal} className="px-4 py-2 text-sm text-primary-400 hover:text-primary-200 transition-colors">
            İptal
          </button>
          <Button onClick={handleSave}>
            {isEdit ? '💾 Güncelle' : '✨ Proje Oluştur'}
          </Button>
        </div>
      </div>
    </div>
  )
}
