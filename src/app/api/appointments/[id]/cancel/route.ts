// ============================================
// API de Cancelamento (RN13, RN14, RN15)
// POST /api/appointments/[id]/cancel
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { cancelSchema } from '@/lib/utils/validation'
import { verifyPassword } from '@/lib/utils/hash'
import { unlockSlot } from '@/lib/utils/slots'
import type { CancelInput } from '@/lib/utils/validation'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body: CancelInput = await request.json()

    const validation = cancelSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          detalhes: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    // Buscar consulta
    const { data: consulta, error } = await supabaseAdmin
      .from('consultas')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !consulta) {
      return NextResponse.json(
        { error: 'Consulta não encontrada' },
        { status: 404 }
      )
    }

    if (consulta.status === 'cancelada') {
      return NextResponse.json(
        { error: 'Esta consulta já foi cancelada' },
        { status: 400 }
      )
    }

    const { token, bi, senha } = validation.data

    let autorizado = false

    // RN14a - Cancelamento por token
    if (token && token === consulta.token_cancelamento) {
      autorizado = true
    }

    // RN14b - Cancelamento por BI + senha
    if (bi && senha) {
      const { data: paciente } = await supabaseAdmin
        .from('pacientes')
        .select('senha_hash')
        .eq('bi', bi)
        .single()

      if (paciente) {
        const senhaValida = await verifyPassword(senha, paciente.senha_hash)
        if (senhaValida && bi === consulta.paciente_bi) {
          autorizado = true
        }
      }
    }

    if (!autorizado) {
      return NextResponse.json(
        { error: 'Token inválido ou BI/senha incorretos' },
        { status: 401 }
      )
    }

    // Verificar janela de cancelamento (RN13)
    const agora = new Date()
    const dataConsulta = new Date(consulta.data_hora)
    const horasAteConsulta =
      (dataConsulta.getTime() - agora.getTime()) / (1000 * 60 * 60)

    if (horasAteConsulta < 24) {
      // Cancelamento tardio: registra como falta
      await supabaseAdmin.from('consultas').update({ status: 'faltou' }).eq('id', id)

      // RN17 - Incrementar contador de faltas
      await supabaseAdmin.from('faltas').insert({
        paciente_bi: consulta.paciente_bi,
        data_falta: dataConsulta.toISOString(),
        expira_em: new Date(
          dataConsulta.getTime() + 180 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })

      return NextResponse.json({
        success: true,
        message:
          'Cancelamento realizado, mas por ser em cima da hora será registado como falta.',
        tipo: 'falta',
      })
    }

    // Cancelamento normal (RN15 - libera slot)
    await supabaseAdmin.from('consultas').update({ status: 'cancelada' }).eq('id', id)

    // Liberar lock do slot
    await unlockSlot(consulta.medico_id, consulta.data_hora)

    // RN25 - Auditoria
    await supabaseAdmin.from('registros_auditoria').insert({
      paciente_bi: consulta.paciente_bi,
      acao: 'consulta_cancelada',
      detalhes: { consulta_id: id, motivo: 'Cancelamento pelo paciente' },
    })

    return NextResponse.json({
      success: true,
      message: 'Consulta cancelada com sucesso. O horário foi libertado.',
      tipo: 'cancelamento',
    })
  } catch (error) {
    console.error('Erro ao cancelar consulta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}