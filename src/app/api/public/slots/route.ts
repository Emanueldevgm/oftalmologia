/* eslint-disable @typescript-eslint/no-unused-vars */
// ============================================
// API Pública: Slots Disponíveis (RN26)
// GET /api/public/slots?data=YYYY-MM-DD&turno=manha|tarde
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { isDiaUtil, TURNOS, gerarSlotsMedico } from '@/lib/utils/slots'
import type { Medico, EscalaMedico } from '@/app/types/doctor'
import type { SlotDisponivel } from '@/app/types/doctor'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache 1 minuto

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const dataParam = searchParams.get('data')
    const turnoParam = searchParams.get('turno') as 'manha' | 'tarde' | null

    if (!dataParam) {
      return NextResponse.json(
        { error: 'Parâmetro "data" é obrigatório (YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    if (!turnoParam || !['manha', 'tarde'].includes(turnoParam)) {
      return NextResponse.json(
        { error: 'Parâmetro "turno" deve ser "manha" ou "tarde"' },
        { status: 400 }
      )
    }

    const data = new Date(dataParam)

    // Verificar se é dia útil (RN04)
    const diaUtil = await isDiaUtil(data)
    if (!diaUtil) {
      return NextResponse.json({
        data: dataParam,
        turno: turnoParam,
        slots: [],
        mensagem: 'Hospital fechado (fim de semana ou feriado)',
      })
    }

    // Buscar médicos ativos para o turno
    const turnoField = turnoParam === 'manha' ? 'turno_manha' : 'turno_tarde'

    const { data: medicos, error: erroMedicos } = await supabaseAdmin
      .from('medicos')
      .select('*')
      .eq('ativo', true)
      .eq(turnoField, true)

    if (erroMedicos) {
      console.error('Erro ao buscar médicos:', erroMedicos)
      return NextResponse.json(
        { error: 'Erro ao carregar médicos' },
        { status: 500 }
      )
    }

    if (!medicos || medicos.length === 0) {
      return NextResponse.json({
        data: dataParam,
        turno: turnoParam,
        slots: [],
        mensagem: 'Nenhum médico disponível neste turno',
      })
    }

    // Gerar slots para cada médico
    const todosSlots: SlotDisponivel[] = []

    for (const medico of medicos as Medico[]) {
      const slots = gerarSlotsMedico(turnoParam, medico.id, medico.nome)
      todosSlots.push(...slots)
    }

    // Buscar consultas já marcadas para esta data
    const inicioDoDia = `${dataParam}T00:00:00`
    const fimDoDia = `${dataParam}T23:59:59`

    const { data: consultasExistentes } = await supabaseAdmin
      .from('consultas')
      .select('data_hora, medico_id, status, bloqueado_ate')
      .gte('data_hora', inicioDoDia)
      .lte('data_hora', fimDoDia)
      .in('status', ['confirmada', 'bloqueada'])

    // Marcar slots ocupados
    if (consultasExistentes) {
      for (const consulta of consultasExistentes) {
        const horaConsulta = new Date(consulta.data_hora).toLocaleTimeString('pt', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })

        todosSlots.forEach((slot) => {
          if (
            slot.medico_id === consulta.medico_id &&
            slot.hora_inicio === horaConsulta
          ) {
            slot.disponivel = false
            if (consulta.bloqueado_ate) {
              slot.bloqueado_ate = consulta.bloqueado_ate
            }
          }
        })
      }
    }

    // RN07 - Reservar percentual de encaixe (não visível)
    const { data: config } = await supabaseAdmin
      .from('configuracoes')
      .select('percentual_encaixe')
      .single()

    const percentualEncaixe = config?.percentual_encaixe ?? 10

    return NextResponse.json({
      data: dataParam,
      turno: turnoParam,
      total_slots: todosSlots.length,
      slots_disponiveis: todosSlots.filter((s) => s.disponivel).length,
      percentual_encaixe: percentualEncaixe,
      slots: todosSlots,
    })
  } catch (error) {
    console.error('Erro na API de slots:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}