// ============================================
// Tipos para Formulários
// ============================================

import type { BI, Email, Phone, ISODate } from './common'

// ============================================
// Formulário de Marcação
// ============================================

export interface BookingFormData {
  nome: string
  bi: BI
  dataNascimento: ISODate
  email: Email
  telefone: Phone
  motivo: string
}

export interface BookingFormErrors {
  nome?: string
  bi?: string
  dataNascimento?: string
  email?: string
  telefone?: string
  motivo?: string
}

// ============================================
// Formulário de Login Paciente
// ============================================

export interface PatientLoginFormData {
  bi: BI
  senha: string
}

export interface PatientLoginFormErrors {
  bi?: string
  senha?: string
}

// ============================================
// Formulário de Cancelamento
// ============================================

export interface CancelFormData {
  token?: string
  bi?: BI
  senha?: string
}

// ============================================
// Formulário de Login Admin
// ============================================

export interface AdminLoginFormData {
  email: Email
  password: string
}

export interface AdminLoginFormErrors {
  email?: string
  password?: string
}

// ============================================
// Formulário de Médico
// ============================================

export interface DoctorFormData {
  nome: string
  crm: string
  turnoManha: boolean
  turnoTarde: boolean
  vagasPorTurno: number
}

export interface DoctorFormErrors {
  nome?: string
  crm?: string
  vagasPorTurno?: string
}

// ============================================
// Formulário de Feriado
// ============================================

export interface HolidayFormData {
  data: ISODate
  descricao: string
}

export interface HolidayFormErrors {
  data?: string
  descricao?: string
}

// ============================================
// Estado de Formulário Genérico
// ============================================

export interface FormState<T, E = Record<string, string>> {
  data: T
  errors: E
  isSubmitting: boolean
  isDirty: boolean
  isValid: boolean
}

export type FormAction<T> =
  | { type: 'SET_FIELD'; field: keyof T; value: T[keyof T] }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof T, string>> }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET'; initialData: T }