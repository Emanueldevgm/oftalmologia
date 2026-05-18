// ============================================
// API de Marcação de Consulta (RN10, RN11)
// POST /api/appointments
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { bookingSchema } from '@/lib/utils/validation'
import {
  generateAccessPassword,
  generateCancelToken,
  hashPassword,
} from '@/lib/utils/hash'
import { lockSlot, unlockSlot, isDiaUtil } from '@/lib/utils/slots'
import { checkRateLimit, incrementFailedAttempts } from '@/lib/utils/rate-limit'
import { sendEmail } from '@/lib/email/config'
import { getBookingConfirmationTemplate } from '@/lib/email/templates'
import type { BookingInput } from '@/lib/utils/validation'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // RN23 - Rate limiting por IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1'

    const rateLimit = await checkRateLimit(ip)

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Muitas tentativas. Tente novamente mais tarde.',
          retry_em: rateLimit.resetIn,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetIn),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      )
    }

    // Validar input
    const body: BookingInput = await request.json()
    const validation = bookingSchema.safeParse(body)

    if (!validation.success) {
      await incrementFailedAttempts(ip)
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          detalhes: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { nome, bi, data_nascimento, email, telefone, motivo, medico_id, data_hora } =
      validation.data

    // Verificar se é dia útil
    const dataConsulta = new Date(data_hora)
    const diaUtil = await isDiaUtil(dataConsulta)

    if (!diaUtil) {
      return NextResponse.json(
        { error: 'Não é possível marcar consulta neste dia (fim de semana ou feriado)' },
        { status: 400 }
      )
    }

    // RN10 - Verificar bloqueio por faltas
    const seisMesesAtras = new Date()
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6)

    const { count: faltas } = await supabaseAdmin
      .from('faltas')
      .select('*', { count: 'exact', head: true })
      .eq('paciente_bi', bi)
      .gte('data_falta', seisMesesAtras.toISOString())

    if (faltas && faltas >= 3) {
      return NextResponse.json(
        {
          error: 'Paciente bloqueado por excesso de faltas (3 faltas nos últimos 6 meses)',
          codigo: 'BLOQUEIO_FALTAS',
        },
        { status: 403 }
      )
    }

    // Verificar conflito de horário (mesmo BI, mesmo horário)
    const { count: conflito } = await supabaseAdmin
      .from('consultas')
      .select('*', { count: 'exact', head: true })
      .eq('paciente_bi', bi)
      .eq('data_hora', data_hora)
      .in('status', ['confirmada', 'bloqueada'])

    if (conflito && conflito > 0) {
      return NextResponse.json(
        { error: 'Já existe uma consulta marcada neste horário para este BI' },
        { status: 409 }
      )
    }

    // RN09 - Tentar lock do slot (10 minutos)
    const lockAdquirido = await lockSlot(medico_id, data_hora, bi)

    if (!lockAdquirido) {
      return NextResponse.json(
        {
          error: 'Este horário está temporariamente reservado. Tente outro horário.',
          codigo: 'SLOT_BLOQUEADO',
        },
        { status: 409 }
      )
    }

    // Gerar tokens e senha
    const cancelToken = generateCancelToken()
    const accessPassword = generateAccessPassword()
    const senhaHash = await hashPassword(accessPassword)

    // Verificar se paciente já existe
    const { data: pacienteExistente } = await supabaseAdmin
      .from('pacientes')
      .select('bi')
      .eq('bi', bi)
      .single()

    // Upsert paciente
    if (!pacienteExistente) {
      const { error: erroPaciente } = await supabaseAdmin.from('pacientes').insert({
        bi,
        nome,
        data_nascimento,
        email,
        telefone: telefone || null,
        senha_hash: senhaHash,
      })

      if (erroPaciente) {
        await unlockSlot(medico_id, data_hora)
        console.error('Erro ao criar paciente:', erroPaciente)
        return NextResponse.json(
          { error: 'Erro ao registrar paciente' },
          { status: 500 }
        )
      }
    } else {
      // Atualizar senha do paciente existente
      await supabaseAdmin
        .from('pacientes')
        .update({ senha_hash: senhaHash, atualizado_em: new Date().toISOString() })
        .eq('bi', bi)
    }

    // Criar consulta
    const { data: consulta, error: erroConsulta } = await supabaseAdmin
      .from('consultas')
      .insert({
        paciente_bi: bi,
        medico_id,
        data_hora,
        status: 'confirmada',
        token_cancelamento: cancelToken,
        motivo: motivo || null,
        bloqueado_ate: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      })
      .select('id')
      .single()

    if (erroConsulta || !consulta) {
      await unlockSlot(medico_id, data_hora)
      console.error('Erro ao criar consulta:', erroConsulta)
      return NextResponse.json(
        { error: 'Erro ao confirmar consulta' },
        { status: 500 }
      )
    }

    // Gerar QR Code (string simples com dados da consulta)
    const qrData = JSON.stringify({
      consulta_id: consulta.id,
      paciente_bi: bi,
      data_hora,
      medico_id,
    })
    const qrCodeBase64 = Buffer.from(qrData).toString('base64')

    await supabaseAdmin
      .from('consultas')
      .update({ qr_code: qrCodeBase64 })
      .eq('id', consulta.id)

    // Formatar dados para email
    const dataFormatada = dataConsulta.toLocaleDateString('pt', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const horaFormatada = dataConsulta.toLocaleTimeString('pt', {
      hour: '2-digit',
      minute: '2-digit',
    })

    // RN11 - Enviar email de confirmação
    const emailHtml = getBookingConfirmationTemplate({
      nome,
      data: dataFormatada,
      hora: horaFormatada,
      cancelToken,
      accessPassword,
    })

    await sendEmail(email, 'Confirmação de Consulta - HGU', emailHtml)

    // RN25 - Registrar auditoria
    await supabaseAdmin.from('registros_auditoria').insert({
      paciente_bi: bi,
      acao: 'consulta_criada',
      detalhes: { consulta_id: consulta.id, medico_id, data_hora },
      ip,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Consulta marcada com sucesso!',
        consulta: {
          id: consulta.id,
          data: dataFormatada,
          hora: horaFormatada,
          status: 'confirmada',
        },
        instrucoes: 'Verifique seu email para a senha de acesso e link de cancelamento.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro na API de marcação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}