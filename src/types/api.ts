/* eslint-disable @typescript-eslint/no-unused-vars */
// ============================================
// Tipos Específicos para APIs
// ============================================

import type {
  ApiResponse,
  PaginatedResponse,
  UUID,
  BI,
  ISODate,
  Timestamp,
} from './common'
import type {
  ConsultaResponse,
  SlotsResponse,
  PacienteResumo,
  AdminSession,
  RelatorioPeriodo,
  MetricasPublicas,
  Medico,
  Consulta,
  SlotDisponivel,
  Feriado,
  Configuracao,
} from './domain'

// ============================================
// API Slots Públicos
// ============================================

export type GetSlotsResponse = ApiResponse<SlotsResponse>

export interface GetSlotsParams {
  data: ISODate
  turno: 'manha' | 'tarde'
}

// ============================================
// API Marcação de Consulta
// ============================================

export interface CreateAppointmentRequest {
  nome: string
  bi: BI
  dataNascimento: ISODate
  email: string
  telefone?: string
  motivo?: string
  medicoId: UUID
  dataHora: Timestamp
}

export type CreateAppointmentResponse = ApiResponse<ConsultaResponse>

// ============================================
// API Cancelamento
// ============================================

export interface CancelAppointmentRequest {
  token?: string
  bi?: BI
  senha?: string
}

export type CancelAppointmentResponse = ApiResponse<{
  tipo: 'cancelamento' | 'falta'
  message: string
}>

// ============================================
// API Login Paciente
// ============================================

export interface PatientLoginRequest {
  bi: BI
  senha: string
}

export type PatientLoginResponse = ApiResponse<PacienteResumo>

// ============================================
// API Consultas do Paciente
// ============================================

export interface GetPatientConsultasParams {
  bi: BI
  senha: string
}

export interface PatientConsultasResponse {
  pacienteBi: BI
  total: number
  consultas: Consulta[]
}

// ============================================
// API Login Admin
// ============================================

export interface AdminLoginRequest {
  email: string
  password: string
}

export type AdminLoginResponse = ApiResponse<AdminSession>

// ============================================
// API Admin - Consultas
// ============================================

export interface GetAdminAppointmentsParams {
  data?: ISODate
  status?: string
  page?: number
  limit?: number
}

export type GetAdminAppointmentsResponse = PaginatedResponse<Consulta>

export interface UpdateAppointmentStatusRequest {
  status: string
}

// ============================================
// API Admin - Médicos
// ============================================

export interface CreateDoctorRequest {
  nome: string
  crm: string
  turnoManha: boolean
  turnoTarde: boolean
  vagasPorTurno: number
}

export type GetDoctorsResponse = ApiResponse<Medico[]>
export type CreateDoctorResponse = ApiResponse<Medico>

// ============================================
// API Admin - Relatórios
// ============================================

export interface GetReportsParams {
  tipo: 'diario' | 'semanal' | 'mensal'
}

export type GetReportsResponse = RelatorioPeriodo

// ============================================
// API Admin - Configurações
// ============================================

export interface UpdateConfigRequest {
  percentualEncaixe: number
}

export interface ConfigResponse {
  percentualEncaixe: number
  vagasExtrasAtivas: boolean
  feriados: Feriado[]
}

export interface CreateHolidayRequest {
  data: ISODate
  descricao: string
}

// ============================================
// API Métricas Públicas
// ============================================

export type GetMetricsResponse = MetricasPublicas