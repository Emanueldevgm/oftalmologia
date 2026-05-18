/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? ''

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-on-surface"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`
              w-full rounded-xl border px-4 py-3 text-on-surface
              outline-none transition
              placeholder:text-outline-variant
              focus:ring-2 focus:ring-primary/50
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || showPasswordToggle ? 'pr-10' : ''}
              ${error ? 'border-error focus:ring-error/50' : 'border-outline-variant focus:border-primary'}
              ${className}
            `}
            {...props}
          />
          {rightIcon && !showPasswordToggle && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline">
              {rightIcon}
            </span>
          )}
          {showPasswordToggle && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant"
              onClick={() => {
                const input = document.getElementById(inputId) as HTMLInputElement
                if (input) {
                  input.type = input.type === 'password' ? 'text' : 'password'
                }
              }}
            >
              <Eye size={18} />
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-on-surface-variant">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }