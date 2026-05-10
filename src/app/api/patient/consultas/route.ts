// ============================================
// API Consultas do Paciente (RN12)
// GET /api/patient/consultas?bi=XXX&senha=XXXX
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyPassword } from '@/lib/utils/hash'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const bi = searchParams.get('bi')
    const senha = searchParams.get('senha')

    if (!bi || !senha) {
      return NextResponse.json(
        { error: 'BI e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar senha
    const { data: paciente, error: erroPaciente } = await supabaseAdmin
      .from('pacientes')
      .select('senha_hash')
      .eq('bi', bi)
      .single()

    if (erroPaciente || !paciente) {
      return NextResponse.json(
        { error: 'BI ou senha incorretos' },
        { status: 401 }
      )
    }

    const senhaValida = await verifyPassword(senha, paciente.senha_hash)
    if (!senhaValida) {
      return NextResponse.json(
        { error: 'BI ou senha incorretos' },
        { status: 401 }
      )
    }

    // Buscar consultas (futuras + últimos 90 dias)
    const noventaDiasAtras = new Date()
    noventaDiasAtras.setDate(noventaDiasAtras.getDate() - 90)

    const { data: consultas, error } = await supabaseAdmin
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
      .eq('paciente_bi', bi)
      .gte('data_hora', noventaDiasAtras.toISOString())
      .order('data_hora', { ascending: true })

    if (error) {
      console.error('Erro ao buscar consultas:', error)
      return NextResponse.json(
        { error: 'Erro ao carregar consultas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      paciente_bi: bi,
      total: consultas?.length ?? 0,
      consultas: consultas ?? [],
    })
  } catch (error) {
    console.error('Erro na API de consultas do paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}