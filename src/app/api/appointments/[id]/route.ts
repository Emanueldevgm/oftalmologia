// ============================================
// API de Consulta Específica
// GET /api/appointments/[id]
// PATCH /api/appointments/[id] - Atualizar status (admin ou paciente)
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params

    const { data: consulta, error } = await supabaseAdmin
      .from('consultas')
      .select(`
        id,
        data_hora,
        status,
        motivo,
        qr_code,
        criado_em,
        medicos (
          nome,
          crm
        )
      `)
      .eq('id', id)
      .single()

    if (error || !consulta) {
      return NextResponse.json(
        { error: 'Consulta não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ consulta })
  } catch (error) {
    console.error('Erro ao buscar consulta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, paciente_confirmou } = body

    // Se o paciente está a confirmar o atendimento
    if (paciente_confirmou === true) {
      const { data: consulta, error: fetchError } = await supabaseAdmin
        .from('consultas')
        .select('status')
        .eq('id', id)
        .single()

      if (fetchError || !consulta) {
        return NextResponse.json(
          { error: 'Consulta não encontrada' },
          { status: 404 }
        )
      }

      // Só permite confirmar se o status for "realizada" (marcado pelo admin)
      if (consulta.status !== 'realizada') {
        return NextResponse.json(
          { error: 'Esta consulta ainda não foi marcada como realizada pelo hospital' },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabaseAdmin
        .from('consultas')
        .update({ status: 'confirmada_pelo_paciente' })
        .eq('id', id)

      if (updateError) {
        console.error('Erro ao confirmar atendimento:', updateError)
        return NextResponse.json(
          { error: 'Erro ao confirmar atendimento' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Atendimento confirmado com sucesso. Obrigado!',
      })
    }

    // Atualização normal de status (admin)
    if (status) {
      const { error: updateError } = await supabaseAdmin
        .from('consultas')
        .update({ status })
        .eq('id', id)

      if (updateError) {
        console.error('Erro ao atualizar consulta:', updateError)
        return NextResponse.json(
          { error: 'Erro ao atualizar consulta' },
          { status: 500 }
        )
      }

      // Se marcou como falta, registar na tabela de faltas
      if (status === 'faltou') {
        const { data: consulta } = await supabaseAdmin
          .from('consultas')
          .select('paciente_bi, data_hora')
          .eq('id', id)
          .single()

        if (consulta) {
          await supabaseAdmin.from('faltas').insert({
            paciente_bi: consulta.paciente_bi,
            data_falta: consulta.data_hora,
            expira_em: new Date(
              new Date(consulta.data_hora).getTime() + 180 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Nenhum campo para atualizar' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}