import { cn } from '../../utils/cn'
import { PlanType, PlanStatus } from '../../types/plan'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export const Badge = ({ children, className, variant = 'default' }: BadgeProps) => (
  <span className={cn(
    'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
    {
      'bg-primary-800/60 text-primary-200': variant === 'default',
      'bg-emerald-900/60 text-emerald-300': variant === 'success',
      'bg-amber-900/60 text-amber-300': variant === 'warning',
      'bg-red-900/60 text-red-300': variant === 'error',
      'bg-sky-900/60 text-sky-300': variant === 'info',
    },
    className
  )}>
    {children}
  </span>
)

export const planTypeConfig: Record<PlanType, { label: string; color: string; bg: string; dot: string }> = {
  onsite:   { label: 'Yerinde',  color: 'text-emerald-300', bg: 'bg-emerald-900/50', dot: 'bg-emerald-400' },
  remote:   { label: 'Remote',   color: 'text-sky-300',     bg: 'bg-sky-900/50',     dot: 'bg-sky-400' },
  internal: { label: 'İç Proje', color: 'text-amber-300',   bg: 'bg-amber-900/50',   dot: 'bg-amber-400' },
  leave:    { label: 'İzin',     color: 'text-rose-300',    bg: 'bg-rose-900/50',    dot: 'bg-rose-400' },
  training: { label: 'Eğitim',   color: 'text-violet-300',  bg: 'bg-violet-900/50',  dot: 'bg-violet-400' },
}

export const planStatusConfig: Record<PlanStatus, { label: string; variant: BadgeProps['variant'] }> = {
  confirmed: { label: 'Onaylı',   variant: 'success' },
  tentative: { label: 'Taslak',   variant: 'warning' },
  cancelled: { label: 'İptal',    variant: 'error' },
}
