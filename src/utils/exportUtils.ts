import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Plan } from '../types/plan'
import { Consultant } from '../types/consultant'
import { Client } from '../types/client'
import { ConsultantUtilization } from '../types/utilization'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

const planTypeLabels: Record<string, string> = {
  onsite: 'Yerinde',
  remote: 'Remote',
  internal: 'İç Proje',
  leave: 'İzin',
  training: 'Eğitim',
}

const statusLabels: Record<string, string> = {
  confirmed: 'Onaylı',
  tentative: 'Taslak',
  cancelled: 'İptal',
}

/** Haftalık planları Excel'e aktar */
export const exportWeeklyPlansToExcel = (
  plans: Plan[],
  consultants: Consultant[],
  clients: Client[],
  weekStart: Date,
  weekEnd: Date
) => {
  const weekLabel = `${format(weekStart, 'd MMM', { locale: tr })} – ${format(weekEnd, 'd MMM yyyy', { locale: tr })}`

  const rows = plans.map((plan) => {
    const consultant = consultants.find((c) => c.id === plan.consultantId)
    const client = clients.find((c) => c.id === plan.clientId)
    const totalHours = plan.tasks.reduce((s, t) => s + (t.estimatedHours || 0), 0)
    const billableHours = plan.tasks.filter((t) => t.isBillable).reduce((s, t) => s + (t.estimatedHours || 0), 0)
    const taskList = plan.tasks.map((t) => `${t.title} (${t.estimatedHours}s${t.isBillable ? ' ✓' : ''})`).join(' | ')

    return {
      'Danışman': consultant?.name ?? '-',
      'Rol': consultant?.role ?? '-',
      'Tarih': plan.date,
      'Gün': plan.date ? format(new Date(plan.date), 'EEEE', { locale: tr }) : '-',
      'Müşteri': client?.name ?? '-',
      'Tür': planTypeLabels[plan.type] ?? plan.type,
      'Durum': statusLabels[plan.status] ?? plan.status,
      'Başlangıç': plan.startTime ?? '-',
      'Bitiş': plan.endTime ?? '-',
      'Toplam Saat': totalHours || '-',
      'Billable Saat': billableHours || '-',
      'Konum': plan.location || '-',
      'Görevler': taskList || '-',
      'Notlar': plan.notes || '-',
    }
  })

  if (rows.length === 0) {
    rows.push({
      'Danışman': 'Bu hafta için plan bulunamadı.',
      'Rol': '', 'Tarih': '', 'Gün': '', 'Müşteri': '', 'Tür': '',
      'Durum': '', 'Başlangıç': '', 'Bitiş': '', 'Toplam Saat': '',
      'Billable Saat': '', 'Konum': '', 'Görevler': '', 'Notlar': '',
    })
  }

  const ws = XLSX.utils.json_to_sheet(rows)

  // Sütun genişlikleri
  ws['!cols'] = [
    { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 12 },
    { wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 10 },
    { wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 20 },
    { wch: 50 }, { wch: 30 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Haftalık Plan')

  const fileName = `Haftalık_Plan_${weekLabel.replace(/\s/g, '_').replace(/–/g, '-')}.xlsx`
  const wbBuf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([wbBuf], { type: 'application/octet-stream' }), fileName)
}

/** Utilizasyon raporunu Excel'e aktar */
export const exportUtilizationToExcel = (
  utilizations: ConsultantUtilization[],
  consultants: Consultant[],
  clients: Client[],
  plans: Plan[],
  periodLabel: string
) => {
  const rows = utilizations.map((u) => {
    const consultant = consultants.find((c) => c.id === u.consultantId)

    // En çok ziyaret edilen müşteri
    const consultantPlans = plans.filter((p) => p.consultantId === u.consultantId && p.status !== 'cancelled')
    const clientCounts: Record<string, number> = {}
    consultantPlans.forEach((p) => { clientCounts[p.clientId] = (clientCounts[p.clientId] || 0) + 1 })
    const topClientId = Object.entries(clientCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const topClient = clients.find((c) => c.id === topClientId)

    return {
      'Danışman': consultant?.name ?? '-',
      'Rol': consultant?.role ?? '-',
      'Email': consultant?.email ?? '-',
      'Beceriler': consultant?.skills?.join(', ') ?? '-',
      'Dönem': periodLabel,
      'Toplam Çalışma Günü': u.totalWorkingDays,
      'Atanmış Gün': u.assignedDays,
      'Billable Gün': u.billableDays,
      'Doluluk Oranı (%)': u.utilizationRate,
      'Boşluk Oranı (%)': 100 - u.utilizationRate,
      'Billable Oran (%)': u.billableRate,
      'En Aktif Müşteri': topClient?.name ?? '-',
    }
  })

  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [
    { wch: 20 }, { wch: 18 }, { wch: 28 }, { wch: 30 },
    { wch: 20 }, { wch: 20 }, { wch: 14 }, { wch: 14 },
    { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 22 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Utilizasyon')

  const fileName = `Utilizasyon_Raporu_${periodLabel.replace(/\s/g, '_')}.xlsx`
  const wbBuf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([wbBuf], { type: 'application/octet-stream' }), fileName)
}
