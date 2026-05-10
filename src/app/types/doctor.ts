// ============================================
// Tipos de Médico
// ============================================

export interface Medico {
  id: string
  nome: string
  crm: string
  turno_manha: boolean
  turno_tarde: boolean
  vagas_por_turno: number
  ativo: boolean
}

export interface EscalaMedico {
  id: string
  medico_id: string
  data: string
  turno: 'manha' | 'tarde'
  vagas_extra: number
  criado_em: string | null
}

export interface SlotDisponivel {
  hora_inicio: string
  hora_fim: string
  disponivel: boolean
  medico_id: string
  medico_nome: string
  bloqueado_ate: string | null
}