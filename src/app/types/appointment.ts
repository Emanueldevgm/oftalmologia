// ============================================
// Tipos de Consulta/Marcação
// ============================================

export type AppointmentStatus =
  | 'confirmada'
  | 'cancelada'
  | 'realizada'
  | 'bloqueada'
  | 'faltou'

export interface Appointment {
  id: string
  paciente_bi: string | null
  medico_id: string | null
  data_hora: string
  status: AppointmentStatus
  token_cancelamento: string | null
  motivo: string | null
  qr_code: string | null
  bloqueado_ate: string | null
  criado_em: string | null
  atualizado_em: string | null
}

export interface AppointmentCreate {
  nome: string
  bi: string
  data_nascimento: string
  email: string
  telefone?: string
  motivo?: string
  medico_id: string
  data_hora: string
}

export interface AppointmentResponse {
  id: string
  data: string
  hora: string
  status: AppointmentStatus
  medico: string
  cancelToken: string
  qrCode: string
}