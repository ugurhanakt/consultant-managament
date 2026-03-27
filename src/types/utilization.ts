export interface ConsultantUtilization {
  consultantId: string
  totalWorkingDays: number
  assignedDays: number
  billableDays: number
  utilizationRate: number  // 0-100
  billableRate: number     // 0-100
}

export interface TeamUtilization {
  teamId: string
  period: { start: string; end: string }
  consultants: ConsultantUtilization[]
  overallOccupancy: number
  overallVacancy: number
  averageBillableRate: number
}
