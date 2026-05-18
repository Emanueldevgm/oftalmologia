import { NextRequest, NextResponse } from 'next/server'

// Mock storage - em produção, usar banco de dados
let config = {
  percentual_encaixe: 10,
}

let feriados = [
  { id: '1', data: '2026-01-01', descricao: 'Ano Novo' },
  { id: '2', data: '2026-11-11', descricao: 'Independência de Angola' },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      ...config,
      feriados,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar configurações' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.percentual_encaixe !== undefined) {
      config.percentual_encaixe = Math.min(50, Math.max(0, body.percentual_encaixe))
    }

    return NextResponse.json({
      ...config,
      feriados,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações' },
      { status: 500 }
    )
  }
}
