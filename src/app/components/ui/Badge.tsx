import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  type LucideIcon,
} from 'lucide-react'

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary'

interface BadgeProps {
  variant?: BadgeVariant
  label: string
  icon?: LucideIcon
  size?: 'sm' | 'md'
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800 border-green-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-primary-container/20 text-primary border-primary/20',
}

const defaultIcons: Record<BadgeVariant, LucideIcon> = {
  success: CheckCircle,
  danger: XCircle,
  warning: AlertCircle,
  info: Eye,
  neutral: Clock,
  primary: Eye,
}

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
}

function Badge({
  variant = 'neutral',
  label,
  icon,
  size = 'md',
}: BadgeProps) {
  const Icon = icon || defaultIcons[variant]

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      <Icon size={size === 'sm' ? 12 : 14} />
      {label}
    </span>
  )
}

// Status específico para consultas
const consultaStatusMap: Record<string, BadgeVariant> = {
  confirmada: 'success',
  cancelada: 'danger',
  realizada: 'info',
  faltou: 'warning',
  bloqueada: 'neutral',
}

interface ConsultaBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

function ConsultaBadge({ status, size = 'md' }: ConsultaBadgeProps) {
  const variant = consultaStatusMap[status] || 'neutral'
  const labels: Record<string, string> = {
    confirmada: 'Confirmada',
    cancelada: 'Cancelada',
    realizada: 'Realizada',
    faltou: 'Faltou',
    bloqueada: 'Bloqueada',
  }

  return <Badge variant={variant} label={labels[status] || status} size={size} />
}

export { Badge, ConsultaBadge }
export type { BadgeProps, BadgeVariant }