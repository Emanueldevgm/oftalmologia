// ============================================
// API Admin: Gestão de Médicos
// GET/POST /api/admin/doctors
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { doctorSchema } from '@/lib/utils/validation'
import type { DoctorInput } from '@/lib/utils/validation'

export async function GET(): Promise<NextResponse> {
  try {
    const { data: medicos, error } = await supabaseAdmin
      .from('medicos')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar médicos:', error)
      return NextResponse.json(
        { error: 'Erro ao carregar médicos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ medicos: medicos ?? [] })
  } catch (error) {
    console.error('Erro na API de médicos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: DoctorInput = await request.json()
    const validation = doctorSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          detalhes: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { nome, crm, turno_manha, turno_tarde, vagas_por_turno } =
      validation.data

    const { data: medico, error } = await supabaseAdmin
      .from('medicos')
      .insert({
        nome,
        crm,
        turno_manha,
        turno_tarde,
        vagas_por_turno,
        ativo: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar médico:', error)
      return NextResponse.json(
        { error: 'Erro ao cadastrar médico' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, medico }, { status: 201 })
  } catch (error) {
    console.error('Erro ao cadastrar médico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}