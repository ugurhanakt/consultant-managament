import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, options, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-primary-200">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'w-full bg-primary-900/60 border border-primary-700/50 text-primary-100 rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 appearance-none cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-primary-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
)
Select.displayName = 'Select'
