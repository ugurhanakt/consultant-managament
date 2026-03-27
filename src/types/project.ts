export type ProjectStatus = 'active' | 'planned' | 'on-hold' | 'completed'

export const SECTORS = [
  'Enerji',
  'Üretim',
  'Savunma Sanayi',
  'Proje / İnşaat',
  'Otomotiv',
  'Telekomünikasyon',
  'Perakende',
  'Finans / Bankacılık',
  'Holding',
  'Lojistik',
  'Sağlık',
  'Kamu',
]

export interface Project {
  id: string
  name: string
  sectors: string[]        // çoktan seçmeli sektör
  description: string
  status: ProjectStatus
  startDate: string        // "YYYY-MM-DD"
  endDate?: string
  requiredSkills: string[]
  assignedConsultantIds: string[]
  colorTag: string
  createdAt: string
}
