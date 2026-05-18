'use client'

import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  arrow?: boolean
  fullWidth?: boolean
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]',
  secondary:
    'border border-white/[0.08] bg-white/[0.02] text-white/70 backdrop-blur-sm hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white',
  ghost:
    'text-white/60 hover:text-white hover:bg-white/[0.04]',
  glass:
    'glass-badge text-white/80 hover:text-white hover:bg-white/[0.06]',
}

const sizeMap: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-2',
  md: 'px-6 py-3 text-sm rounded-xl gap-2',
  lg: 'px-7 py-4 text-base rounded-xl gap-3',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      arrow = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const motionProps: HTMLMotionProps<'button'> = {
      ref,
      disabled: disabled || loading,
      className: `
        inline-flex items-center justify-center font-semibold
        transition-all duration-500
        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-[#0A1628]
        disabled:cursor-not-allowed disabled:opacity-50
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `,
      whileHover: disabled ? {} : { scale: 1.02 },
      whileTap: disabled ? {} : { scale: 0.98 },
      transition: { type: 'spring', stiffness: 400, damping: 17 },
      ...props,
    }

    return (
      <motion.button {...motionProps}>
        {loading ? (
          <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin" />
        ) : icon}
        {children}
        {arrow && !loading && <ArrowRight size={size === 'sm' ? 14 : 18} />}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }