// ============================================
// Schemas de Validação com Zod
// ============================================

import { z } from 'zod'

// BI Angolano: 9 dígitos + 2 letras + 3 dígitos
export const biSchema = z
  .string()
  .min(1, 'BI é obrigatório')
  .toUpperCase()
  .trim()
  .refine(
    (val) => /^\d{9}[A-Z]{2}\d{3}$/.test(val),
    'Formato de BI inválido. Exemplo: 000000000LA000'
  )

// Schema de marcação de consulta
export const bookingSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo')
    .trim(),
  bi: biSchema,
  data_nascimento: z.string().refine((date) => {
    const birth = new Date(date)
    const now = new Date()
    const age = now.getFullYear() - birth.getFullYear()
    return age >= 0 && age <= 120
  }, 'Data de nascimento inválida'),
  email: z
    .string()
    .email('Email inválido')
    .max(255)
    .trim()
    .toLowerCase(),
  telefone: z
    .string()
    .regex(/^\+?\d{8,15}$/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  motivo: z
    .string()
    .max(500, 'Motivo deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
  medico_id: z.string().uuid('Médico inválido'),
  data_hora: z.string().datetime('Data/hora inválida').refine((date) => {
    const appointmentDate = new Date(date)
    return appointmentDate > new Date()
  }, 'A data da consulta deve ser futura'),
})

// Schema de login do paciente
export const patientLoginSchema = z.object({
  bi: biSchema,
  senha: z
    .string()
    .length(4, 'Senha deve ter 4 dígitos')
    .regex(/^\d{4}$/, 'Senha deve conter apenas números'),
})

// Schema de cancelamento
export const cancelSchema = z.object({
  token: z.string().optional(),
  bi: biSchema.optional(),
  senha: z.string().length(4).optional(),
}).refine(
  (data) => data.token || (data.bi && data.senha),
  'Forneça token de cancelamento ou BI + senha'
)

// Schema de médico (admin)
export const doctorSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  crm: z.string().min(5, 'CRM inválido').max(20),
  turno_manha: z.boolean(),
  turno_tarde: z.boolean(),
  vagas_por_turno: z.number().int().min(1, 'Mínimo 1 vaga').max(20, 'Máximo 20 vagas'),
})

// Schema de feriado (admin)
export const holidaySchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  descricao: z.string().min(3, 'Descrição muito curta').max(200),
})

// Schema de configuração (admin)
export const configSchema = z.object({
  percentual_encaixe: z.number().int().min(0).max(50),
})

// Types exportados
export type BookingInput = z.infer<typeof bookingSchema>
export type PatientLoginInput = z.infer<typeof patientLoginSchema>
export type CancelInput = z.infer<typeof cancelSchema>
export type DoctorInput = z.infer<typeof doctorSchema>
export type HolidayInput = z.infer<typeof holidaySchema>
export type ConfigInput = z.infer<typeof configSchema>