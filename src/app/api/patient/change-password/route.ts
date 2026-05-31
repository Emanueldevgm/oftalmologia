import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { hashPassword, verifyPassword } from '@/lib/utils/hash'

export async function POST(request: NextRequest) {
  try {
    const { bi, senhaAtual, novaSenha } = await request.json()

    if (!bi || !senhaAtual || !novaSenha) {
      return NextResponse.json(
        { error: 'BI, senha atual e nova senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (novaSenha.length !== 4 || !/^\d{4}$/.test(novaSenha)) {
      return NextResponse.json(
        { error: 'A nova senha deve ter 4 dígitos numéricos' },
        { status: 400 }
      )
    }

    // Buscar paciente
    const { data: paciente, error } = await supabaseAdmin
      .from('pacientes')
      .select('senha_hash')
      .eq('bi', bi)
      .single()

    if (error || !paciente) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      )
    }

    // Verificar senha atual
    const senhaValida = await verifyPassword(senhaAtual, paciente.senha_hash)
    if (!senhaValida) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 401 }
      )
    }

    // Atualizar com a nova senha
    const novoHash = await hashPassword(novaSenha)
    const { error: updateError } = await supabaseAdmin
      .from('pacientes')
      .update({ senha_hash: novoHash, atualizado_em: new Date().toISOString() })
      .eq('bi', bi)

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar senha' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso',
    })
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}