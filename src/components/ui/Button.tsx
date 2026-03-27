import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-950 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white shadow-lg shadow-primary-900/30': variant === 'primary',
            'bg-primary-900/60 hover:bg-primary-800/80 text-primary-200 border border-primary-700/50': variant === 'secondary',
            'hover:bg-primary-900/40 text-primary-300 hover:text-primary-100': variant === 'ghost',
            'bg-red-600/80 hover:bg-red-500 text-white': variant === 'danger',
          },
          {
            'text-xs px-3 py-1.5': size === 'sm',
            'text-sm px-4 py-2': size === 'md',
            'text-base px-6 py-3': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
