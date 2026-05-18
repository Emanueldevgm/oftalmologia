/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const medicoId = formData.get('medicoId') as string

    if (!file || !medicoId) {
      return NextResponse.json(
        { error: 'Arquivo e médico ID são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato inválido. Use JPG, PNG ou WebP' },
        { status: 400 }
      )
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB' },
        { status: 400 }
      )
    }

    // Gerar nome único
    const timestamp = Date.now()
    const fileName = `${medicoId}/${timestamp}-${file.name.replace(/\s+/g, '-')}`

    // Upload para Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('medicos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Erro upload:', error)
      return NextResponse.json(
        { error: 'Erro ao fazer upload da foto' },
        { status: 500 }
      )
    }

    // Obter URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from('medicos')
      .getPublicUrl(fileName)

    const fotoUrl = urlData.publicUrl

    // Atualizar tabela medicos
    const { error: updateError } = await supabaseAdmin
      .from('medicos')
      .update({ foto_url: fotoUrl })
      .eq('id', medicoId)

    if (updateError) {
      console.error('Erro ao atualizar médico:', updateError)
      return NextResponse.json(
        { error: 'Erro ao associar foto ao médico' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      fotoUrl,
      message: 'Foto carregada com sucesso',
    })
  } catch (error) {
    console.error('Erro upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}