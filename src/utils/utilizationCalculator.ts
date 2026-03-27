import { Plan } from '../types/plan'
import { Consultant } from '../types/consultant'
import { ConsultantUtilization, TeamUtilization } from '../types/utilization'
import { eachDayOfInterval, isWeekend, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns'

export type DateRange = { start: Date; end: Date }

export const getWorkingDays = (range: DateRange): number =>
  eachDayOfInterval(range).filter((d) => !isWeekend(d)).length

export const calcConsultantUtilization = (
  consultant: Consultant,
  plans: Plan[],
  range: DateRange
): ConsultantUtilization => {
  const totalWorkingDays = getWorkingDays(range)
  const rangeStart = range.start.toISOString().slice(0, 10)
  const rangeEnd = range.end.toISOString().slice(0, 10)

  const consultantPlans = plans.filter(
    (p) =>
      p.consultantId === consultant.id &&
      p.date >= rangeStart &&
      p.date <= rangeEnd &&
      p.status !== 'cancelled'
  )

  const assignedDays = consultantPlans.length
  const billableDays = consultantPlans.filter(
    (p) => p.tasks.some((t) => t.isBillable) && p.type !== 'leave' && p.type !== 'training'
  ).length

  return {
    consultantId: consultant.id,
    totalWorkingDays,
    assignedDays: Math.min(assignedDays, totalWorkingDays),
    billableDays: Math.min(billableDays, totalWorkingDays),
    utilizationRate: totalWorkingDays > 0 ? Math.round((Math.min(assignedDays, totalWorkingDays) / totalWorkingDays) * 100) : 0,
    billableRate: totalWorkingDays > 0 ? Math.round((Math.min(billableDays, totalWorkingDays) / totalWorkingDays) * 100) : 0,
  }
}

export const calcTeamUtilization = (
  teamId: string,
  consultants: Consultant[],
  plans: Plan[],
  range: DateRange
): TeamUtilization => {
  const teamConsultants = consultants.filter((c) => c.teamId === teamId && c.isActive)
  const utilizations = teamConsultants.map((c) => calcConsultantUtilization(c, plans, range))

  const totalAssigned = utilizations.reduce((sum, u) => sum + u.assignedDays, 0)
  const totalWorking = utilizations.reduce((sum, u) => sum + u.totalWorkingDays, 0)
  const totalBillable = utilizations.reduce((sum, u) => sum + u.billableDays, 0)

  return {
    teamId,
    period: { start: range.start.toISOString().slice(0, 10), end: range.end.toISOString().slice(0, 10) },
    consultants: utilizations,
    overallOccupancy: totalWorking > 0 ? Math.round((totalAssigned / totalWorking) * 100) : 0,
    overallVacancy: totalWorking > 0 ? Math.round(((totalWorking - totalAssigned) / totalWorking) * 100) : 0,
    averageBillableRate: totalWorking > 0 ? Math.round((totalBillable / totalWorking) * 100) : 0,
  }
}

export const getThisWeekRange = (): DateRange => {
  const now = new Date()
  return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
}

export const getThisMonthRange = (): DateRange => {
  const now = new Date()
  return { start: startOfMonth(now), end: endOfMonth(now) }
}
