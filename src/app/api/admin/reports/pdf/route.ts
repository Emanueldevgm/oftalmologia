// src/app/api/admin/reports/pdf/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') || 'mensal'

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

    const totais: Record<string, number> = {
      confirmadas: 0,
      realizadas: 0,
      canceladas: 0,
      faltas: 0,
    }

    consultas?.forEach((c) => {
      if (totais[c.status] !== undefined) {
        totais[c.status]++
      }
    })

    // Novos pacientes
    const { count: novosPacientes } = await supabaseAdmin
      .from('pacientes')
      .select('*', { count: 'exact', head: true })
      .gte('criado_em', inicio.toISOString())

    // Total de consultas
    const { count: totalConsultas } = await supabaseAdmin
      .from('consultas')
      .select('*', { count: 'exact', head: true })
      .gte('data_hora', inicio.toISOString())

    const total = totalConsultas || 0
    const taxaOcupacao = total > 0 ? ((totais.realizadas + totais.confirmadas) / total) * 100 : 0
    const taxaAbsenteismo = total > 0 ? (totais.faltas / total) * 100 : 0

    const resumo = {
      total_consultas: total,
      confirmadas: totais.confirmadas || 0,
      realizadas: totais.realizadas || 0,
      canceladas: totais.canceladas || 0,
      faltas: totais.faltas || 0,
      novos_pacientes: novosPacientes || 0,
      taxa_ocupacao: Math.round(taxaOcupacao * 100) / 100,
      taxa_absenteismo: Math.round(taxaAbsenteismo * 100) / 100,
    }

    return NextResponse.json({
      periodo: {
        tipo,
        inicio: inicio.toISOString(),
        fim: hoje.toISOString(),
      },
      resumo,
    })
  } catch (error) {
    console.error('Erro ao gerar relatório PDF:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    )
  }
}