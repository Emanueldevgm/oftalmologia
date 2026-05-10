// ============================================
// API Admin: Gestão de Consultas (RN21)
// GET/POST /api/admin/appointments
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get('data')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = parseInt(searchParams.get('limit') ?? '50', 10)
    const offset = (page - 1) * limit

    let query = supabaseAdmin.from('consultas').select(
      `
        *,
        pacientes (nome, email, telefone),
        medicos (nome, crm)
      `,
      { count: 'exact' }
    )

    if (data) {
      const inicioDoDia = `${data}T00:00:00`
      const fimDoDia = `${data}T23:59:59`
      query = query.gte('data_hora', inicioDoDia).lte('data_hora', fimDoDia)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: consultas, count, error } = await query
      .order('data_hora', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Erro ao buscar consultas:', error)
      return NextResponse.json(
        { error: 'Erro ao carregar consultas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      total: count ?? 0,
      pagina: page,
      limite: limit,
      consultas: consultas ?? [],
    })
  } catch (error) {
    console.error('Erro na API admin appointments:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { paciente_bi, medico_id, data_hora, status, motivo } = body

    if (!paciente_bi || !medico_id || !data_hora) {
      return NextResponse.json(
        { error: 'BI do paciente, médico e data/hora são obrigatórios' },
        { status: 400 }
      )
    }

    const { data: consulta, error } = await supabaseAdmin
      .from('consultas')
      .insert({
        paciente_bi,
        medico_id,
        data_hora,
        status: status || 'confirmada',
        motivo: motivo || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar consulta:', error)
      return NextResponse.json(
        { error: 'Erro ao criar consulta' },
        { status: 500 }
      )
    }

    await supabaseAdmin.from('registros_auditoria').insert({
      administrador_id: body.admin_id,
      paciente_bi,
      acao: 'consulta_criada_admin',
      detalhes: { consulta_id: consulta.id },
    })

    return NextResponse.json({ success: true, consulta }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar consulta admin:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}