import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyPassword } from '@/lib/utils/hash'
import { checkRateLimit } from '@/lib/utils/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

    // Rate limit: 10 tentativas a cada 5 segundos
    const rateLimit = await checkRateLimit(ip, 10, 5)
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${rateLimit.resetIn} segundos.` },
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

    // Criar resposta com cookie de sessão
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        funcao: admin.funcao,
      },
    })

    // Definir cookie seguro
    response.cookies.set('admin_session', admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/',
    })

    // RN25 - Auditoria
    await supabaseAdmin.from('registros_auditoria').insert({
      administrador_id: admin.id,
      acao: 'admin_login',
      ip,
    })

    return response
  } catch (error) {
    console.error('Erro no login admin:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}