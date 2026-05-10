// ============================================
// API de Consulta Específica
// GET /api/appointments/[id]
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