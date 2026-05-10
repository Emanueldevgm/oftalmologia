// ============================================
// API Faltas do Paciente (RN17, RN18, RN19)
// GET /api/patient/infractions?bi=XXX&senha=XXXX
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
    const { data: paciente } = await supabaseAdmin
      .from('pacientes')
      .select('senha_hash')
      .eq('bi', bi)
      .single()

    if (!paciente) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      )
    }

    const senhaValida = await verifyPassword(senha, paciente.senha_hash)
    if (!senhaValida) {
      return NextResponse.json(
        { error: 'BI ou senha incorretos' },
        { status: 401 }
      )
    }

    // Buscar faltas nos últimos 6 meses
    const seisMesesAtras = new Date()
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6)

    const { data: faltas, count } = await supabaseAdmin
      .from('faltas')
      .select('*', { count: 'exact' })
      .eq('paciente_bi', bi)
      .gte('data_falta', seisMesesAtras.toISOString())

    const bloqueado = (count ?? 0) >= 3

    return NextResponse.json({
      paciente_bi: bi,
      total_faltas_6_meses: count ?? 0,
      bloqueado_para_marcacao: bloqueado,
      faltas: faltas ?? [],
    })
  } catch (error) {
    console.error('Erro ao buscar faltas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}