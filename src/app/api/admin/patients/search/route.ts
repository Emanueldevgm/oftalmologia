// src/app/api/admin/patients/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bi = searchParams.get('bi')
    const nome = searchParams.get('nome')

    if (!bi && !nome) {
      return NextResponse.json(
        { error: 'Forneça BI ou nome para pesquisa' },
        { status: 400 }
      )
    }

    // Busca por BI (resultado único)
    if (bi) {
      const { data: paciente, error } = await supabaseAdmin
        .from('pacientes')
        .select('bi, nome, email, telefone')
        .eq('bi', bi)
        .single()

      if (error || !paciente) {
        return NextResponse.json(
          { error: 'Paciente não encontrado com este BI' },
          { status: 404 }
        )
      }

      // Buscar consultas do paciente
      const { data: consultas } = await supabaseAdmin
        .from('consultas')
        .select('id, data_hora, status, medicos ( nome )')
        .eq('paciente_bi', bi)
        .order('data_hora', { ascending: false })
        .limit(20)

      // Contar faltas nos últimos 6 meses
      const seisMesesAtras = new Date()
      seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6)

      const { count: faltas } = await supabaseAdmin
        .from('faltas')
        .select('*', { count: 'exact', head: true })
        .eq('paciente_bi', bi)
        .gte('data_falta', seisMesesAtras.toISOString())

      const bloqueado = (faltas ?? 0) >= 3

      return NextResponse.json({
        paciente: {
          bi: paciente.bi,
          nome: paciente.nome,
          email: paciente.email,
          telefone: paciente.telefone,
          consultas: consultas || [],
          faltas: faltas || 0,
          bloqueado,
        },
      })
    }

    // Busca por nome (pode retornar múltiplos)
    if (nome) {
      const { data: pacientes, error } = await supabaseAdmin
        .from('pacientes')
        .select('bi, nome, email, telefone')
        .ilike('nome', `%${nome}%`)
        .limit(10)

      if (error || !pacientes || pacientes.length === 0) {
        return NextResponse.json(
          { error: 'Nenhum paciente encontrado com este nome' },
          { status: 404 }
        )
      }

      // Para cada paciente, buscar consultas e faltas
      const pacientesCompletos = await Promise.all(
        pacientes.map(async (p) => {
          const { data: consultas } = await supabaseAdmin
            .from('consultas')
            .select('id, data_hora, status, medicos ( nome )')
            .eq('paciente_bi', p.bi)
            .order('data_hora', { ascending: false })
            .limit(20)

          const seisMesesAtras = new Date()
          seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6)

          const { count: faltas } = await supabaseAdmin
            .from('faltas')
            .select('*', { count: 'exact', head: true })
            .eq('paciente_bi', p.bi)
            .gte('data_falta', seisMesesAtras.toISOString())

          return {
            bi: p.bi,
            nome: p.nome,
            email: p.email,
            telefone: p.telefone,
            consultas: consultas || [],
            faltas: faltas || 0,
            bloqueado: (faltas ?? 0) >= 3,
          }
        })
      )

      return NextResponse.json({ pacientes: pacientesCompletos })
    }

    return NextResponse.json(
      { error: 'Parâmetro de busca inválido' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erro na busca de pacientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}