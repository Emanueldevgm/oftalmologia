import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// DELETE com opção de force (hard delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'

    if (force) {
      // Hard delete: eliminar permanentemente
      // Primeiro, verificar se tem consultas
      const { count } = await supabaseAdmin
        .from('consultas')
        .select('*', { count: 'exact', head: true })
        .eq('medico_id', id)

      if (count && count > 0) {
        return NextResponse.json(
          { error: `Não é possível eliminar. O médico tem ${count} consulta(s) associada(s).` },
          { status: 409 }
        )
      }

      // Se não tem consultas, eliminar
      const { error } = await supabaseAdmin
        .from('medicos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao eliminar médico:', error)
        return NextResponse.json(
          { error: 'Erro ao eliminar médico' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, message: 'Médico eliminado permanentemente' })
    }

    // Soft delete: apenas desativar
    const { error } = await supabaseAdmin
      .from('medicos')
      .update({ ativo: false })
      .eq('id', id)

    if (error) {
      console.error('Erro ao desativar médico:', error)
      return NextResponse.json(
        { error: 'Erro ao desativar médico' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Médico desativado com sucesso' })
  } catch (error) {
    console.error('Erro ao processar médico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar médico completo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { error } = await supabaseAdmin
      .from('medicos')
      .update({
        nome: body.nome,
        crm: body.crm,
        especialidade: body.especialidade,
        turno_manha: body.turno_manha,
        turno_tarde: body.turno_tarde,
        vagas_por_turno: body.vagas_por_turno,
        ativo: body.ativo ?? true,
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar médico:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar médico' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Médico atualizado com sucesso' })
  } catch (error) {
    console.error('Erro ao atualizar médico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Atualização parcial (toggle status, foto, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { error } = await supabaseAdmin
      .from('medicos')
      .update(body)
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar médico:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar médico' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar médico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}