// ============================================
// API Pública: Métricas Anônimas (RN34)
// GET /api/public/metrics
// ============================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Cache 5 minutos

export async function GET(): Promise<NextResponse> {
  try {
    const hoje = new Date()
    const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString()
    const inicioDoAno = new Date(hoje.getFullYear(), 0, 1).toISOString()

    // Consultas realizadas este mês
    const { count: realizadasMes } = await supabaseAdmin
      .from('consultas')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'realizada')
      .gte('data_hora', inicioDoMes)

    // Total de consultas este ano
    const { count: totalAno } = await supabaseAdmin
      .from('consultas')
      .select('*', { count: 'exact', head: true })
      .gte('data_hora', inicioDoAno)

    // Taxa de absenteísmo (faltas / total)
    const { count: faltasMes } = await supabaseAdmin
      .from('consultas')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'faltou')
      .gte('data_hora', inicioDoMes)

    const { count: totalConsultasMes } = await supabaseAdmin
      .from('consultas')
      .select('*', { count: 'exact', head: true })
      .gte('data_hora', inicioDoMes)

    const taxaAbsenteismo =
      totalConsultasMes && totalConsultasMes > 0
        ? ((faltasMes ?? 0) / totalConsultasMes) * 100
        : 0

    // Tempo médio para agendamento (dias entre criação e consulta)
    const { data: consultasRecentes } = await supabaseAdmin
      .from('consultas')
      .select('criado_em, data_hora')
      .gte('criado_em', inicioDoMes)
      .limit(100)

    let tempoMedioAgendamento = 0
    if (consultasRecentes && consultasRecentes.length > 0) {
      const totalDias = consultasRecentes.reduce((acc, consulta) => {
        const criacao = new Date(consulta.criado_em)
        const consulta_dia = new Date(consulta.data_hora)
        const dias = Math.ceil(
          (consulta_dia.getTime() - criacao.getTime()) / (1000 * 60 * 60 * 24)
        )
        return acc + dias
      }, 0)
      tempoMedioAgendamento = Math.round(totalDias / consultasRecentes.length)
    }

    // Médicos ativos
    const { count: medicosAtivos } = await supabaseAdmin
      .from('medicos')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true)

    return NextResponse.json({
      mes_atual: hoje.toLocaleString('pt', { month: 'long', year: 'numeric' }),
      metricas: {
        consultas_realizadas_mes: realizadasMes ?? 0,
        total_consultas_ano: totalAno ?? 0,
        taxa_absenteismo: Math.round(taxaAbsenteismo * 100) / 100,
        tempo_medio_agendamento_dias: tempoMedioAgendamento,
        medicos_ativos: medicosAtivos ?? 0,
      },
      atualizado_em: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Erro na API de métricas:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar métricas' },
      { status: 500 }
    )
  }
}