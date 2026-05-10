// ============================================
// Tipos do Paciente
// ============================================

export interface Paciente {
  bi: string
  nome: string
  data_nascimento: string
  email: string
  telefone: string | null
  senha_hash: string
  criado_em: string | null
  atualizado_em: string | null
}

export interface PacienteCreate {
  bi: string
  nome: string
  data_nascimento: string
  email: string
  telefone?: string
}

export interface PacienteLogin {
  bi: string
  senha: string
}

export interface PacienteConsultas {
  id: string
  data_hora: string
  status: string
  medico: {
    nome: string
    crm: string
  } | null
}