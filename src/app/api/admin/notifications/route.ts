import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

interface ConsultaRow {
  id: string
  status: string
  criado_em: string
  paciente_bi: string
  pacientes: { nome: string } | null
}

interface PacienteRow {
  bi: string
  nome: string
  criado_em: string
}

export async function GET() {
  try {
    // Buscar últimas consultas criadas/canceladas
    const { data: consultas, error: errCons } = await supabaseAdmin
      .from('consultas')
      .select('id, status, criado_em, paciente_bi, pacientes ( nome )')
      .order('criado_em', { ascending: false })
      .limit(10)
      .returns<ConsultaRow[]>()

    // Buscar novos pacientes
    const { data: novosPacientes, error: errPac } = await supabaseAdmin
      .from('pacientes')
      .select('bi, nome, criado_em')
      .order('criado_em', { ascending: false })
      .limit(5)
      .returns<PacienteRow[]>()

    if (errCons || errPac) {
      return NextResponse.json({ error: 'Erro ao carregar notificações' }, { status: 500 })
    }

    const notificacoes: {
      id: string
      title: string
      message: string
      type: 'success' | 'info' | 'warning' | 'error'
      read: boolean
      timestamp: string
    }[] = []

    // Converter consultas em notificações
    consultas?.forEach((c) => {
      const pacienteNome = c.pacientes?.nome || c.paciente_bi
      if (c.status === 'confirmada') {
        notificacoes.push({
          id: `consulta-${c.id}`,
          title: 'Nova consulta marcada',
          message: `${pacienteNome} marcou uma consulta.`,
          type: 'success',
          read: false,
          timestamp: c.criado_em,
        })
      } else if (c.status === 'cancelada') {
        notificacoes.push({
          id: `consulta-${c.id}`,
          title: 'Consulta cancelada',
          message: `${pacienteNome} cancelou a consulta.`,
          type: 'warning',
          read: false,
          timestamp: c.criado_em,
        })
      }
    })

    // Converter novos pacientes em notificações
    novosPacientes?.forEach((p) => {
      notificacoes.push({
        id: `paciente-${p.bi}`,
        title: 'Novo paciente',
        message: `${p.nome} se cadastrou no sistema.`,
        type: 'info',
        read: false,
        timestamp: p.criado_em,
      })
    })

    // Ordenar por timestamp decrescente
    notificacoes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ notificacoes })
  } catch (error) {
    console.error('Erro na API de notificações:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}