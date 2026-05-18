import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  type LucideIcon,
} from 'lucide-react'

export type ConsultaStatus =
  | 'confirmada'
  | 'cancelada'
  | 'realizada'
  | 'faltou'
  | 'bloqueada'

interface StatusConfig {
  label: string
  variant: 'success' | 'danger' | 'info' | 'warning' | 'neutral'
  icon: LucideIcon
}

export const statusMap: Record<ConsultaStatus, StatusConfig> = {
  confirmada: {
    label: 'Confirmada',
    variant: 'success',
    icon: CheckCircle,
  },
  cancelada: {
    label: 'Cancelada',
    variant: 'danger',
    icon: XCircle,
  },
  realizada: {
    label: 'Realizada',
    variant: 'info',
    icon: Eye,
  },
  faltou: {
    label: 'Faltou',
    variant: 'warning',
    icon: AlertCircle,
  },
  bloqueada: {
    label: 'Bloqueada',
    variant: 'neutral',
    icon: Clock,
  },
}

export const statusList: ConsultaStatus[] = [
  'confirmada',
  'cancelada',
  'realizada',
  'faltou',
  'bloqueada',
]

export function getStatusConfig(status: string): StatusConfig {
  return (
    statusMap[status as ConsultaStatus] || {
      label: status,
      variant: 'neutral',
      icon: Clock,
    }
  )
}