// ============================================
// Tipos de Administrador
// ============================================

export interface Admin {
  id: string
  email: string
  senha_hash: string
  funcao: string | null
  criado_em: string | null
}

export interface AdminLogin {
  email: string
  password: string
}

export interface AuditLog {
  id: string
  paciente_bi: string | null
  administrador_id: string | null
  acao: string
  detalhes: Record<string, unknown> | null
  ip: string | null
  agente_usuario: string | null
  criado_em: string | null
}

export interface Configuracao {
  id: number
  percentual_encaixe: number
  vagas_extras_ativas: boolean
  updated_at: string | null
}