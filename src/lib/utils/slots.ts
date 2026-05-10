// ============================================
// Cálculo de Vagas e Slots
// RN04, RN05, RN06, RN07, RN09
// ============================================

import { supabaseAdmin } from '@/lib/supabase/admin'
import { redis } from '@/lib/redis'
import type { SlotDisponivel } from '@/app/types/doctor'

// Configuração dos turnos (RN05)
export const TURNOS = {
  manha: {
    inicio: '08:00',
    fim: '12:00',
    minutosTotal: 240,
    slots: 9,
  },
  tarde: {
    inicio: '13:30',
    fim: '16:00',
    minutosTotal: 150,
    slots: 6,
  },
} as const

const SLOT_DURATION = 25 // 20 min consulta + 5 min buffer

/**
 * RN06 - Calcula número de vagas por turno
 */
export function calcularVagasTurno(
  turno: 'manha' | 'tarde',
  numMedicos: number
): number {
  return TURNOS[turno].slots * numMedicos
}

/**
 * Gera slots para um médico em um turno específico
 */
export function gerarSlotsMedico(
  turno: 'manha' | 'tarde',
  medicoId: string,
  medicoNome: string
): SlotDisponivel[] {
  const config = TURNOS[turno]
  const slots: SlotDisponivel[] = []

  const [horaInicio, minutoInicio] = config.inicio.split(':').map(Number)
  const inicioMinutos = horaInicio * 60 + minutoInicio

  for (let i = 0; i < config.slots; i++) {
    const slotInicio = inicioMinutos + i * SLOT_DURATION
    const slotFim = slotInicio + 20

    const formatarHora = (minutos: number): string => {
      const h = Math.floor(minutos / 60)
      const m = minutos % 60
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    }

    slots.push({
      hora_inicio: formatarHora(slotInicio),
      hora_fim: formatarHora(slotFim),
      disponivel: true,
      medico_id: medicoId,
      medico_nome: medicoNome,
      bloqueado_ate: null,
    })
  }

  return slots
}

/**
 * RN09 - Bloqueia slot no Redis por 10 minutos
 */
export async function lockSlot(
  medicoId: string,
  dataHora: string,
  pacienteBI: string
): Promise<boolean> {
  const key = `slot:lock:${medicoId}:${dataHora}`
  // Usa SET NX (só define se não existir)
  const result = await redis.set(key, pacienteBI, {
    nx: true,
    ex: 600, // 10 minutos
  })
  return result === 'OK'
}

/**
 * Libera lock do slot
 */
export async function unlockSlot(medicoId: string, dataHora: string): Promise<void> {
  const key = `slot:lock:${medicoId}:${dataHora}`
  await redis.del(key)
}

/**
 * RN07 - Retorna percentual de encaixe
 */
export async function getPercentualEncaixe(): Promise<number> {
  const { data } = await supabaseAdmin
    .from('configuracoes')
    .select('percentual_encaixe')
    .single()

  return data?.percentual_encaixe ?? 10
}

/**
 * RN04 - Verifica se é feriado
 */
export async function isFeriado(data: Date): Promise<boolean> {
  const dataStr = data.toISOString().split('T')[0]
  const { count } = await supabaseAdmin
    .from('feriados')
    .select('*', { count: 'exact', head: true })
    .eq('data', dataStr)

  return (count ?? 0) > 0
}

/**
 * Verifica se é dia útil (seg-sex, não feriado)
 */
export async function isDiaUtil(data: Date): Promise<boolean> {
  const diaSemana = data.getDay()
  if (diaSemana === 0 || diaSemana === 6) return false
  return !(await isFeriado(data))
}