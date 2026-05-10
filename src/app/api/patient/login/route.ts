// ============================================
// API Login do Paciente (RN12)
// POST /api/patient/login
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { patientLoginSchema } from '@/lib/utils/validation'
import { verifyPassword } from '@/lib/utils/hash'
import { checkRateLimit, incrementFailedAttempts } from '@/lib/utils/rate-limit'
import type { PatientLoginInput } from '@/lib/utils/validation'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1'

    const rateLimit = await checkRateLimit(ip, 10)

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429 }
      )
    }

    const body: PatientLoginInput = await request.json()
    const validation = patientLoginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          detalhes: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { bi, senha } = validation.data

    // Buscar paciente
    const { data: paciente, error } = await supabaseAdmin
      .from('pacientes')
      .select('bi, nome, senha_hash')
      .eq('bi', bi)
      .single()

    if (error || !paciente) {
      await incrementFailedAttempts(ip)
      return NextResponse.json(
        { error: 'BI ou senha incorretos' },
        { status: 401 }
      )
    }

    // Verificar senha
    const senhaValida = await verifyPassword(senha, paciente.senha_hash)

    if (!senhaValida) {
      await incrementFailedAttempts(ip)
      return NextResponse.json(
        { error: 'BI ou senha incorretos' },
        { status: 401 }
      )
    }

    // RN25 - Auditoria
    await supabaseAdmin.from('registros_auditoria').insert({
      paciente_bi: bi,
      acao: 'paciente_login',
      ip,
    })

    return NextResponse.json({
      success: true,
      paciente: {
        bi: paciente.bi,
        nome: paciente.nome,
      },
    })
  } catch (error) {
    console.error('Erro no login do paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}