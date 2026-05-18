'use client'

import { useState } from 'react'
import { User, Mail, Phone, FileText, Calendar, Clock, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'

interface SlotSelecionado {
  medicoId: string
  medicoNome: string
  data: string
  horaInicio: string
  horaFim: string
}

interface PatientFormProps {
  slot: SlotSelecionado
  date: string
  onSubmit: (data: {
    nome: string
    bi: string
    dataNascimento: string
    email: string
    telefone: string
    motivo: string
  }) => void
  onBack: () => void
}

export default function PatientForm({
  slot,
  date,
  onSubmit,
  onBack,
}: PatientFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    bi: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    motivo: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome || formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!/^\d{9}[A-Z]{2}\d{3}$/.test(formData.bi.toUpperCase())) {
      newErrors.bi = 'BI inválido. Ex: 001234567LA000'
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento obrigatória'
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const inputClass = (fieldName: string, hasIcon = false) => `
    w-full rounded-xl border px-4 py-3 text-sm text-text-primary
    placeholder:text-text-tertiary
    outline-none transition-all duration-200
    ${hasIcon ? 'pl-10' : ''}
    ${
      errors[fieldName]
        ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : focusedField === fieldName
          ? 'border-primary bg-white ring-2 ring-primary/10 shadow-sm'
          : 'border-border bg-white hover:border-primary/30'
    }
  `

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
      {/* Slot Info */}
      <div className="mb-6 rounded-2xl bg-surface-secondary p-4 border border-border/50">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Detalhes da Consulta
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
              <Calendar size={14} className="text-primary" />
            </div>
            <span className="text-text-secondary">{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
              <Clock size={14} className="text-primary" />
            </div>
            <span className="text-text-secondary">
              {slot.horaInicio} - {slot.horaFim}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
              <User size={14} className="text-primary" />
            </div>
            <span className="text-text-secondary">{slot.medicoNome}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Nome completo <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            onFocus={() => setFocusedField('nome')}
            onBlur={() => setFocusedField(null)}
            className={inputClass('nome')}
            placeholder="Ex: Manuel Pedro"
          />
          {errors.nome && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle size={12} />
              {errors.nome}
            </p>
          )}
        </div>

        {/* BI */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Número do BI <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.bi}
            onChange={(e) => setFormData({ ...formData, bi: e.target.value.toUpperCase() })}
            onFocus={() => setFocusedField('bi')}
            onBlur={() => setFocusedField(null)}
            className={inputClass('bi')}
            placeholder="Ex: 001234567LA000"
            maxLength={14}
          />
          {errors.bi ? (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle size={12} />
              {errors.bi}
            </p>
          ) : (
            <p className="mt-1 text-xs text-text-tertiary">
              Formato: 9 dígitos + 2 letras + 3 dígitos
            </p>
          )}
        </div>

        {/* Data Nascimento */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Data de nascimento <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={formData.dataNascimento}
            onChange={(e) =>
              setFormData({ ...formData, dataNascimento: e.target.value })
            }
            onFocus={() => setFocusedField('dataNascimento')}
            onBlur={() => setFocusedField(null)}
            className={inputClass('dataNascimento')}
          />
          {errors.dataNascimento && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle size={12} />
              {errors.dataNascimento}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Email <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail
              size={16}
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                focusedField === 'email' ? 'text-primary' : 'text-text-tertiary'
              }`}
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={inputClass('email', true)}
              placeholder="seuemail@exemplo.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle size={12} />
              {errors.email}
            </p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Telefone
          </label>
          <div className="relative">
            <Phone
              size={16}
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                focusedField === 'telefone' ? 'text-primary' : 'text-text-tertiary'
              }`}
            />
            <input
              type="tel"
              value={formData.telefone}
              onChange={(e) =>
                setFormData({ ...formData, telefone: e.target.value })
              }
              onFocus={() => setFocusedField('telefone')}
              onBlur={() => setFocusedField(null)}
              className={inputClass('telefone', true)}
              placeholder="+244 923 456 789"
            />
          </div>
        </div>

        {/* Motivo */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Motivo da consulta
          </label>
          <div className="relative">
            <FileText
              size={16}
              className={`absolute left-3 top-3 transition-colors duration-200 ${
                focusedField === 'motivo' ? 'text-primary' : 'text-text-tertiary'
              }`}
            />
            <textarea
              value={formData.motivo}
              onChange={(e) =>
                setFormData({ ...formData, motivo: e.target.value })
              }
              onFocus={() => setFocusedField('motivo')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              className={`${inputClass('motivo', true)} resize-none`}
              placeholder="Descreva brevemente o motivo da consulta..."
              maxLength={500}
            />
          </div>
          {formData.motivo && (
            <p className="mt-1 text-right text-xs text-text-tertiary">
              {formData.motivo.length}/500
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border-2 border-border px-5 py-3 text-sm font-semibold text-text-secondary transition-all duration-200 hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99]"
          >
            Continuar
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}