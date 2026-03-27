import { cn } from '../../utils/cn'

export const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={cn('animate-spin rounded-full border-2 border-primary-700 border-t-primary-400', className)} />
)
