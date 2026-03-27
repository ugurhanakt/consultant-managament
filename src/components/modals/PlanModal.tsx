import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { X, Plus, Trash2, Sparkles, ChevronDown, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppStore } from '../../store/appStore'
import { Plan, TaskEntry, PlanType, PlanStatus } from '../../types/plan'
import { Client } from '../../types/client'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { TaskSuggestionPanel } from '../ai/TaskSuggestionPanel'
import { useAISuggestions } from '../../hooks/useAISuggestions'
import { AISuggestion } from '../../services/aiService'
import { cn } from '../../utils/cn'

const generateId = () => Math.random().toString(36).slice(2, 10)

// Accent colors for auto-assigned new clients
const CLIENT_COLORS = ['#9333ea','#0ea5e9','#f59e0b','#10b981','#ef4444','#ec4899','#14b8a6','#f97316']
const getClientColor = (idx: number) => CLIENT_COLORS[idx % CLIENT_COLORS.length]

/** Creatable combobox – select existing OR type a new client name */
const ClientCombobox = ({
  clients,
  value,
  onChange,
  onCreateClient,
}: {
  clients: Client[]
  value: string
  onChange: (id: string) => void
  onCreateClient: (name: string) => string // returns new id
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const selectedClient = clients.find((c) => c.id === value)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = query.trim()
    ? clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : clients

  const showCreate = query.trim() && !clients.some((c) => c.name.toLowerCase() === query.toLowerCase())

  const handleSelect = (id: string) => {
    onChange(id)
    setQuery('')
    setOpen(false)
  }

  const handleCreate = () => {
    const newId = onCreateClient(query.trim())
    onChange(newId)
    setQuery('')
    setOpen(false)
    toast.success(`"${query.trim()}" müşteri olarak eklendi`)
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-primary-300 mb-1.5">Müşteri</label>
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); setQuery('') }}
        className="w-full flex items-center justify-between bg-primary-900/60 border border-primary-700/50 text-primary-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors hover:border-primary-600"
      >
        <span className={selectedClient ? 'text-primary-100' : 'text-primary-500'}>
          {selectedClient ? selectedClient.name : 'Müşteri seç...'}
        </span>
        <ChevronDown size={14} className={cn('text-primary-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-primary-900 border border-primary-700/60 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-primary-800/40">
            <input
              autoFocus
              className="w-full bg-primary-800/40 border border-primary-700/30 text-primary-100 placeholder-primary-500 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary-500 transition-colors"
              placeholder="Ara veya yeni müşteri ekle..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && showCreate) handleCreate() }}
            />
          </div>

          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(c.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-primary-200 hover:bg-primary-800/50 transition-colors"
                >
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: c.colorAccent }}
                  >
                    {c.logoInitials}
                  </span>
                  <span className="flex-1 text-left">{c.name}</span>
                  {c.id === value && <Check size={13} className="text-primary-400" />}
                </button>
              </li>
            ))}

            {filtered.length === 0 && !showCreate && (
              <li className="px-3 py-3 text-xs text-primary-500 text-center">Sonuç bulunamadı</li>
            )}

            {showCreate && (
              <li>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-primary-300 hover:bg-primary-800/50 transition-colors border-t border-primary-800/30"
                >
                  <span className="w-5 h-5 rounded-md flex items-center justify-center bg-primary-700/60 shrink-0">
                    <Plus size={12} className="text-primary-300" />
                  </span>
                  <span>
                    <span className="text-primary-500">Yeni ekle: </span>
                    <span className="font-medium text-primary-200">"{query.trim()}"</span>
                  </span>
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

const planTypeOptions: { value: PlanType; label: string }[] = [
  { value: 'onsite', label: '📍 Yerinde' },
  { value: 'remote', label: '💻 Remote' },
  { value: 'internal', label: '🏢 İç Proje' },
  { value: 'leave', label: '✈️ İzin' },
  { value: 'training', label: '📚 Eğitim' },
]

const planStatusOptions: { value: PlanStatus; label: string }[] = [
  { value: 'confirmed', label: '✅ Onaylı' },
  { value: 'tentative', label: '⏳ Taslak' },
  { value: 'cancelled', label: '❌ İptal' },
]

export const PlanModal = () => {
  const { isPlanModalOpen, editingPlan, closeModals, addPlan, updatePlan, deletePlan,
    addClient, consultants, clients, prefillDate, prefillConsultantId } = useAppStore()

  const handleCreateClient = (name: string): string => {
    const newId = generateId()
    const idx = clients.length
    addClient({
      id: newId,
      name,
      industry: 'Diğer',
      colorAccent: getClientColor(idx),
      logoInitials: name.slice(0, 2).toUpperCase(),
    })
    return newId
  }

  const [consultantId, setConsultantId] = useState('')
  const [clientId, setClientId] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [type, setType] = useState<PlanType>('onsite')
  const [status, setStatus] = useState<PlanStatus>('confirmed')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [tasks, setTasks] = useState<TaskEntry[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [aiEnabled, setAiEnabled] = useState(true)
  const [isEndTimeManual, setIsEndTimeManual] = useState(false)

  // Total task hours — drives auto endTime
  const totalTaskHours = useMemo(
    () => tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
    [tasks]
  )

  // Auto-calculate endTime = startTime + Σ(estimatedHours)
  useEffect(() => {
    if (!startTime || isEndTimeManual || totalTaskHours === 0) return
    const [h, m] = startTime.split(':').map(Number)
    const totalMinutes = h * 60 + m + Math.round(totalTaskHours * 60)
    const endH = String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0')
    const endM = String(totalMinutes % 60).padStart(2, '0')
    setEndTime(`${endH}:${endM}`)
  }, [startTime, totalTaskHours, isEndTimeManual])

  const selectedClient = clients.find((c) => c.id === clientId)
  const { suggestions, isLoading: aiLoading, error: aiError } = useAISuggestions(
    newTaskTitle, tasks, selectedClient?.industry ?? 'ERP', aiEnabled
  )

  useEffect(() => {
    if (!isPlanModalOpen) return
    if (editingPlan) {
      setConsultantId(editingPlan.consultantId)
      setClientId(editingPlan.clientId)
      setDate(editingPlan.date)
      setStartTime(editingPlan.startTime ?? '')
      setEndTime(editingPlan.endTime ?? '')
      setType(editingPlan.type)
      setStatus(editingPlan.status)
      setLocation(editingPlan.location)
      setNotes(editingPlan.notes)
      setTasks(editingPlan.tasks)
    } else {
      setConsultantId(prefillConsultantId ?? consultants[0]?.id ?? '')
      setClientId(clients[0]?.id ?? '')
      setDate(prefillDate ?? new Date().toISOString().slice(0, 10))
      setStartTime('')
      setEndTime('')
      setType('onsite')
      setStatus('confirmed')
      setLocation('')
      setNotes('')
      setTasks([])
    }
    setNewTaskTitle('')
    setIsEndTimeManual(false)
  }, [isPlanModalOpen, editingPlan])

  const addTask = useCallback(() => {
    if (!newTaskTitle.trim()) return
    setTasks((prev) => [...prev, {
      id: generateId(), title: newTaskTitle.trim(),
      estimatedHours: 4, isBillable: true, category: 'Geliştirme',
    }])
    setNewTaskTitle('')
  }, [newTaskTitle])

  const addSuggestion = (s: AISuggestion) => {
    setTasks((prev) => [...prev, { id: generateId(), ...s }])
  }

  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id))

  const updateTask = (id: string, field: keyof TaskEntry, value: string | number | boolean) =>
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, [field]: value } : t))

  const handleSave = () => {
    if (!consultantId || !clientId || !date) {
      toast.error('Danışman, müşteri ve tarih zorunludur')
      return
    }
    const now = new Date().toISOString()
    const plan: Plan = {
      id: editingPlan?.id ?? generateId(),
      consultantId, clientId, date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      type, status, location, notes, tasks,
      createdAt: editingPlan?.createdAt ?? now,
      updatedAt: now,
    }
    if (editingPlan) {
      updatePlan(plan)
      toast.success('Plan güncellendi')
    } else {
      addPlan(plan)
      toast.success('Plan eklendi')
    }
    closeModals()
  }

  const handleDelete = () => {
    if (!editingPlan) return
    deletePlan(editingPlan.id)
    toast.success('Plan silindi')
    closeModals()
  }

  if (!isPlanModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModals}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative bg-primary-950 border border-primary-800/60 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary-800/40">
          <h2 className="text-base font-bold text-primary-100">
            {editingPlan ? 'Planı Düzenle' : 'Yeni Plan Ekle'}
          </h2>
          <button onClick={closeModals} className="p-1.5 rounded-lg hover:bg-primary-800/40 text-primary-400 hover:text-primary-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Danışman"
              value={consultantId}
              onChange={(e) => setConsultantId(e.target.value)}
              options={consultants.map((c) => ({ value: c.id, label: c.name }))}
            />
            <ClientCombobox
              clients={clients}
              value={clientId}
              onChange={setClientId}
              onCreateClient={handleCreateClient}
            />
          </div>

          {/* Row 2 — Tarih + Saat */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tarih" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            {/* Time range */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-primary-300">Saat Aralığı</label>
                {/* Auto / Manual indicator */}
                {endTime && startTime && (
                  isEndTimeManual ? (
                    <button
                      type="button"
                      onClick={() => setIsEndTimeManual(false)}
                      className="flex items-center gap-1 text-[10px] text-amber-400/80 hover:text-amber-300 transition-colors"
                    >
                      ↺ Otomatike dön
                    </button>
                  ) : (
                    <span className="text-[10px] text-primary-500 flex items-center gap-1">
                      ✦ otomatik
                    </span>
                  )
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => { setStartTime(e.target.value); setIsEndTimeManual(false) }}
                  className="flex-1 bg-primary-900/60 border border-primary-700/50 text-primary-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors [color-scheme:dark]"
                />
                <span className="text-primary-500 text-xs font-medium shrink-0">–</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => { setEndTime(e.target.value); setIsEndTimeManual(true) }}
                  className={cn(
                    'flex-1 bg-primary-900/60 border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors [color-scheme:dark] text-primary-100',
                    isEndTimeManual
                      ? 'border-amber-600/50 focus:border-amber-500'
                      : 'border-primary-700/50 focus:border-primary-500'
                  )}
                />
              </div>
            </div>
          </div>

          {/* Row 3 — Tür + Durum */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tür"
              value={type}
              onChange={(e) => setType(e.target.value as PlanType)}
              options={planTypeOptions}
            />
            <Select
              label="Durum"
              value={status}
              onChange={(e) => setStatus(e.target.value as PlanStatus)}
              options={planStatusOptions}
            />
          </div>

          {/* Location */}
          <Input label="Konum" placeholder="Müşteri ofisi, Remote..." value={location} onChange={(e) => setLocation(e.target.value)} />

          {/* Tasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-primary-200">Görevler</label>
              <button
                type="button"
                onClick={() => setAiEnabled((v) => !v)}
                className={cn(
                  'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors',
                  aiEnabled
                    ? 'border-primary-600/50 text-primary-300 bg-primary-800/30'
                    : 'border-primary-800/30 text-primary-500'
                )}
              >
                <Sparkles size={12} />
                AI Öneriler {aiEnabled ? 'Açık' : 'Kapalı'}
              </button>
            </div>

            {tasks.length > 0 && (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 p-2 bg-primary-900/40 rounded-lg border border-primary-800/30">
                    <input
                      className="flex-1 bg-transparent text-sm text-primary-200 outline-none placeholder-primary-500"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                    />
                    <input
                      type="number"
                      min={0.5}
                      max={24}
                      step={0.5}
                      className="w-14 bg-primary-800/40 text-primary-300 text-xs text-center rounded px-1 py-0.5 outline-none border border-primary-700/30"
                      value={task.estimatedHours}
                      onChange={(e) => updateTask(task.id, 'estimatedHours', parseFloat(e.target.value) || 1)}
                    />
                    <span className="text-xs text-primary-500">s</span>
                    <button
                      type="button"
                      onClick={() => updateTask(task.id, 'isBillable', !task.isBillable)}
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full border transition-colors',
                        task.isBillable
                          ? 'border-emerald-700/50 text-emerald-400 bg-emerald-900/30'
                          : 'border-primary-700/30 text-primary-500'
                      )}
                    >
                      {task.isBillable ? 'Billable' : 'Non-bill'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className="text-primary-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New task input */}
            <div className="flex gap-2">
              <input
                className="flex-1 bg-primary-900/60 border border-primary-700/50 text-primary-100 placeholder-primary-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Görev başlığı ekle..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
              />
              <Button variant="secondary" size="sm" onClick={addTask}>
                <Plus size={14} />
              </Button>
            </div>

            <TaskSuggestionPanel
              isLoading={aiLoading}
              suggestions={suggestions}
              error={aiError}
              onAdd={addSuggestion}
            />
          </div>

          {/* Notes */}
          <Textarea label="Notlar" placeholder="Ziyaret notları, hazırlık bilgileri..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-primary-800/40">
          <div>
            {editingPlan && (
              <Button variant="danger" size="sm" onClick={handleDelete}>
                <Trash2 size={14} />
                Sil
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={closeModals}>İptal</Button>
            <Button onClick={handleSave}>Kaydet</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
