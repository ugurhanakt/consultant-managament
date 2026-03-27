export type ProjectStatus = 'active' | 'planned' | 'on-hold' | 'completed'

export interface Project {
  id: string
  name: string
  clientId: string
  description: string
  status: ProjectStatus
  startDate: string        // "YYYY-MM-DD"
  endDate?: string
  requiredSkills: string[]
  assignedConsultantIds: string[]
  colorTag: string
  createdAt: string
}
