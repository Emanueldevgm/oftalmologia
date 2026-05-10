// ============================================
// API Login Admin (RN20)
// POST /api/admin/login
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyPassword } from '@/lib/utils/hash'
import { checkRateLimit } from '@/lib/utils/rate-limit'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1'

    const rateLimit = await checkRateLimit(ip, 5)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em 1 hora.' },
        { status: 429 }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const { data: admin, error } = await supabaseAdmin
      .from('administradores')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !admin) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const senhaValida = await verifyPassword(password, admin.senha_hash)
    if (!senhaValida) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // RN25 - Auditoria
    await supabaseAdmin.from('registros_auditoria').insert({
      administrador_id: admin.id,
      acao: 'admin_login',
      ip,
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        funcao: admin.funcao,
      },
    })
  } catch (error) {
    console.error('Erro no login admin:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}