// ============================================
// API Admin: Relatórios (RN35)
// GET /api/admin/reports?tipo=diario|semanal|mensal
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') ?? 'diario'

    const hoje = new Date()
    let inicio: Date

    switch (tipo) {
      case 'semanal':
        inicio = new Date(hoje)
        inicio.setDate(hoje.getDate() - 7)
        break
      case 'mensal':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
        break
      default:
        inicio = new Date(hoje)
        inicio.setHours(0, 0, 0, 0)
    }

    // Consultas por status
    const { data: consultas } = await supabaseAdmin
      .from('consultas')
      .select('status')
      .gte('data_hora', inicio.toISOString())

    const totais = {
      confirmadas: 0,
      realizadas: 0,
      canceladas: 0,
      faltas: 0,
    }

    consultas?.forEach((c) => {
      switch (c.status) {
        case 'confirmada':
          totais.confirmadas++
          break
        case 'realizada':
          totais.realizadas++
          break
        case 'cancelada':
          totais.canceladas++
          break
        case 'faltou':
          totais.faltas++
          break
      }
    })

    // Novos pacientes
    const { count: novosPacientes } = await supabaseAdmin
      .from('pacientes')
      .select('*', { count: 'exact', head: true })
      .gte('criado_em', inicio.toISOString())

    // Taxa de ocupação
    const { count: totalConsultas } = await supabaseAdmin
      .from('consultas')
      .select('*', { count: 'exact', head: true })
      .gte('data_hora', inicio.toISOString())

    const taxaOcupacao =
      totalConsultas && totalConsultas > 0
        ? ((totais.realizadas + totais.confirmadas) / totalConsultas) * 100
        : 0

    return NextResponse.json({
      periodo: {
        tipo,
        inicio: inicio.toISOString(),
        fim: hoje.toISOString(),
      },
      resumo: {
        total_consultas: totalConsultas ?? 0,
        ...totais,
        novos_pacientes: novosPacientes ?? 0,
        taxa_ocupacao: Math.round(taxaOcupacao * 100) / 100,
        taxa_absenteismo:
          totalConsultas && totalConsultas > 0
            ? Math.round((totais.faltas / totalConsultas) * 100 * 100) / 100
            : 0,
      },
    })
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    )
  }
}