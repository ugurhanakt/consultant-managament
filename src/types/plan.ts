export type PlanStatus = 'confirmed' | 'tentative' | 'cancelled'
export type PlanType = 'onsite' | 'remote' | 'internal' | 'leave' | 'training'

export interface TaskEntry {
  id: string
  title: string
  estimatedHours: number
  isBillable: boolean
  category: string
}

export interface Plan {
  id: string
  consultantId: string
  clientId: string
  date: string        // "YYYY-MM-DD"
  startTime?: string  // "HH:MM"
  endTime?: string    // "HH:MM"
  type: PlanType
  status: PlanStatus
  location: string
  tasks: TaskEntry[]
  notes: string
  createdAt: string
  updatedAt: string
}
