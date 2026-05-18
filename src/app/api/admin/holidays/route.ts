import { NextRequest, NextResponse } from 'next/server'

// Mock storage
let feriados = [
  { id: '1', data: '2026-01-01', descricao: 'Ano Novo' },
  { id: '2', data: '2026-11-11', descricao: 'Independência de Angola' },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ feriados })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar feriados' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, descricao } = body

    if (!data || !descricao) {
      return NextResponse.json(
        { error: 'Data e descrição são obrigatórias' },
        { status: 400 }
      )
    }

    const newFeriado = {
      id: Date.now().toString(),
      data,
      descricao,
    }

    feriados.push(newFeriado)

    return NextResponse.json({ feriados }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao adicionar feriado' },
      { status: 500 }
    )
  }
}
