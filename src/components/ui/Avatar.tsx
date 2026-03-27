import { cn } from '../../utils/cn'

interface AvatarProps {
  initials: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Avatar = ({ initials, color = '#9333ea', size = 'md', className }: AvatarProps) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-full font-bold text-white flex-shrink-0',
      {
        'w-7 h-7 text-xs': size === 'sm',
        'w-9 h-9 text-sm': size === 'md',
        'w-12 h-12 text-base': size === 'lg',
      },
      className
    )}
    style={{ backgroundColor: color }}
  >
    {initials}
  </div>
)
