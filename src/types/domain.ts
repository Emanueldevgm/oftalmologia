// ============================================
// Tipos de Domínio - HGU
// ============================================

import type {
  UUID,
  BI,
  Email,
  Phone,
  ISODate,
  Timestamp,
  Percentage,
  PersonBase,
  IdentifiableEntity,
} from './common'

// ============================================
// Paciente
// ============================================

export type PacienteStatus = 'ativo' | 'bloqueado' | 'inativo'

export interface Paciente extends PersonBase {
  bi: BI
  dataNascimento: ISODate
  senhaHash: string
  status: PacienteStatus
  bloqueadoAte?: Timestamp
  faltasRecentes: number
  criadoEm: Timestamp
  atualizadoEm: Timestamp
}

export interface PacienteCreate {
  nome: string
  bi: BI
  dataNascimento: ISODate
  email: Email
  telefone?: Phone
}

export interface PacienteLogin {
  bi: BI
  senha: string
}

export interface PacienteResumo {
  bi: BI
  nome: string
  email: Email
  telefone?: Phone
  faltas: number
  bloqueado: boolean
}

// ============================================
// Médico
// ============================================

export type TurnoTrabalho = 'manha' | 'tarde'

export interface Medico extends IdentifiableEntity {
  nome: string
  crm: string
  especialidade?: string
  turnoManha: boolean
  turnoTarde: boolean
  vagasPorTurno: number
  ativo: boolean
}

export interface MedicoCreate {
  nome: string
  crm: string
  turnoManha: boolean
  turnoTarde: boolean
  vagasPorTurno: number
}

export interface EscalaMedico extends IdentifiableEntity {
  medicoId: UUID
  data: ISODate
  turno: TurnoTrabalho
  vagasExtra: number
}

// ============================================
// Consulta
// ============================================

export type ConsultaStatus =
  | 'confirmada'
  | 'cancelada'
  | 'realizada'
  | 'faltou'
  | 'bloqueada'

export interface Consulta extends IdentifiableEntity {
  pacienteBi: BI
  medicoId: UUID
  dataHora: Timestamp
  status: ConsultaStatus
  tokenCancelamento?: string
  motivo?: string
  qrCode?: string
  bloqueadoAte?: Timestamp
  paciente?: PacienteResumo
  medico?: Medico
}

export interface ConsultaCreate {
  nome: string
  bi: BI
  dataNascimento: ISODate
  email: Email
  telefone?: Phone
  motivo?: string
  medicoId: UUID
  dataHora: Timestamp
}

export interface ConsultaResponse {
  id: UUID
  data: string
  hora: string
  status: ConsultaStatus
  medico?: string
  cancelToken?: string
  qrCode?: string
}

// ============================================
// Slot
// ============================================

export interface SlotDisponivel {
  horaInicio: string
  horaFim: string
  disponivel: boolean
  medicoId: UUID
  medicoNome: string
  bloqueadoAte?: Timestamp
}

export interface SlotsResponse {
  data: ISODate
  turno: TurnoTrabalho
  totalSlots: number
  slotsDisponiveis: number
  percentualEncaixe: Percentage
  slots: SlotDisponivel[]
}

// ============================================
// Falta (No-Show)
// ============================================

export interface Falta extends IdentifiableEntity {
  pacienteBi: BI
  dataFalta: Timestamp
  expiraEm: Timestamp
}

// ============================================
// Feriado
// ============================================

export interface Feriado extends IdentifiableEntity {
  data: ISODate
  descricao: string
  tipo?: 'nacional' | 'municipal'
}

// ============================================
// Admin
// ============================================

export type AdminFuncao = 'SUPER_ADMIN' | 'STAFF'

export interface Admin extends IdentifiableEntity {
  email: Email
  senhaHash: string
  funcao: AdminFuncao
}

export interface AdminLogin {
  email: Email
  password: string
}

export interface AdminSession {
  id: UUID
  email: Email
  funcao: AdminFuncao
}

// ============================================
// Configurações
// ============================================

export interface Configuracao {
  id: number
  percentualEncaixe: Percentage
  vagasExtrasAtivas: boolean
  updatedAt: Timestamp
}

// ============================================
// Auditoria
// ============================================

export interface AuditLog extends IdentifiableEntity {
  pacienteBi?: BI
  administradorId?: UUID
  acao: string
  detalhes?: Record<string, unknown>
  ip?: string
  agenteUsuario?: string
}

// ============================================
// Email
// ============================================

export type EmailStatus = 'enviado' | 'falha' | 'enviado_retry' | 'falha_permanente'

export interface EmailLog extends IdentifiableEntity {
  destinatario: Email
  assunto: string
  status: EmailStatus
  tentativas: number
  ultimoErro?: string
}

// ============================================
// Métricas
// ============================================

export interface MetricasPublicas {
  mesAtual: string
  metricas: {
    consultasRealizadasMes: number
    totalConsultasAno: number
    taxaAbsenteismo: Percentage
    tempoMedioAgendamentoDias: number
    medicosAtivos: number
  }
  atualizadoEm: Timestamp
}

export interface RelatorioPeriodo {
  periodo: {
    tipo: 'diario' | 'semanal' | 'mensal'
    inicio: ISODate
    fim: ISODate
  }
  resumo: {
    totalConsultas: number
    confirmadas: number
    realizadas: number
    canceladas: number
    faltas: number
    novosPacientes: number
    taxaOcupacao: Percentage
    taxaAbsenteismo: Percentage
  }
}