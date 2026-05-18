import { NextRequest, NextResponse } from 'next/server'

// Mock storage - compartilhado com route.ts
let feriados = [
  { id: '1', data: '2026-01-01', descricao: 'Ano Novo' },
  { id: '2', data: '2026-11-11', descricao: 'Independência de Angola' },
]

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const index = feriados.findIndex((f) => f.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Feriado não encontrado' },
        { status: 404 }
      )
    }

    feriados.splice(index, 1)

    return NextResponse.json({ feriados })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao remover feriado' },
      { status: 500 }
    )
  }
}
