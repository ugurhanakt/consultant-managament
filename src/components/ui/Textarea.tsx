import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-primary-200">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={3}
        className={cn(
          'w-full bg-primary-900/60 border border-primary-700/50 text-primary-100 placeholder-primary-500 rounded-lg px-3 py-2 text-sm resize-none transition-colors focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
          className
        )}
        {...props}
      />
    </div>
  )
)
Textarea.displayName = 'Textarea'
