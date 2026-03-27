import { startOfWeek, addDays, format, isToday, isSameDay, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'

export const getWeekDays = (weekStart: Date): Date[] =>
  Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

export const formatDay = (date: Date) =>
  format(date, 'EEE d MMM', { locale: tr })

export const formatDayShort = (date: Date) =>
  format(date, 'EEE', { locale: tr })

export const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd')

export const getWeekLabel = (weekStart: Date) => {
  const end = addDays(weekStart, 6)
  return `${format(weekStart, 'd MMM', { locale: tr })} – ${format(end, 'd MMM yyyy', { locale: tr })}`
}

export { startOfWeek, addDays, isToday, isSameDay, parseISO, format }
