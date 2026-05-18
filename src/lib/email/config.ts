// ============================================
// Serviço de Email
// ============================================

import nodemailer from 'nodemailer'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

export const emailFrom =
  process.env.SMTP_FROM || 'contato@hgu.gov.ao'

interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Envia email com retry automático (RN31)
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  attempt: number = 1
): Promise<SendEmailResult> {
  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      subject,
      html,
    })

    // RN24 - Log de email enviado
    await supabaseAdmin.from('logs_email').insert({
      destinatario: to,
      assunto: subject,
      status: 'enviado',
      tentativas: attempt,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error(`Tentativa ${attempt} falhou:`, error)

    if (attempt >= 3) {
      await supabaseAdmin.from('logs_email').insert({
        destinatario: to,
        assunto: subject,
        status: 'falha_permanente',
        tentativas: attempt,
        ultimo_erro: error instanceof Error ? error.message : 'Erro desconhecido',
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao enviar email',
      }
    }

    // RN31 - Retry automático
    await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    return sendEmail(to, subject, html, attempt + 1)
  }
}