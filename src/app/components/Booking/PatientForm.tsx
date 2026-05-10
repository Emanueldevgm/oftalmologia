'use client'

import { useState } from 'react'
import { User, Mail, Phone, FileText, Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'

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

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr)
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

  return (
    <div className="rounded-xl border border-outline-variant bg-white p-6">
      {/* Slot Info */}
      <div className="mb-6 rounded-xl bg-surface-container p-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span className="text-on-surface-variant">{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <span className="text-on-surface-variant">
              {slot.horaInicio} - {slot.horaFim}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User size={16} className="text-primary" />
            <span className="text-on-surface-variant">{slot.medicoNome}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-on-surface">
            Nome completo *
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className={`w-full rounded-xl border px-4 py-3 text-on-surface outline-none transition focus:ring-2 focus:ring-primary ${
              errors.nome ? 'border-error' : 'border-outline-variant'
            }`}
            placeholder="Ex: Manuel Pedro"
          />
          {errors.nome && (
            <p className="mt-1 text-xs text-error">{errors.nome}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-on-surface">
            Número do BI *
          </label>
          <input
            type="text"
            value={formData.bi}
            onChange={(e) => setFormData({ ...formData, bi: e.target.value.toUpperCase() })}
            className={`w-full rounded-xl border px-4 py-3 text-on-surface outline-none transition focus:ring-2 focus:ring-primary ${
              errors.bi ? 'border-error' : 'border-outline-variant'
            }`}
            placeholder="Ex: 001234567LA000"
            maxLength={14}
          />
          {errors.bi && (
            <p className="mt-1 text-xs text-error">{errors.bi}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-on-surface">
            Data de nascimento *
          </label>
          <input
            type="date"
            value={formData.dataNascimento}
            onChange={(e) =>
              setFormData({ ...formData, dataNascimento: e.target.value })
            }
            className={`w-full rounded-xl border px-4 py-3 text-on-surface outline-none transition focus:ring-2 focus:ring-primary ${
              errors.dataNascimento ? 'border-error' : 'border-outline-variant'
            }`}
          />
          {errors.dataNascimento && (
            <p className="mt-1 text-xs text-error">{errors.dataNascimento}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-on-surface">
            Email *
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full rounded-xl border py-3 pl-10 pr-4 text-on-surface outline-none transition focus:ring-2 focus:ring-primary ${
                errors.email ? 'border-error' : 'border-outline-variant'
              }`}
              placeholder="seuemail@exemplo.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-error">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-on-surface">
            Telefone
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            />
            <input
              type="tel"
              value={formData.telefone}
              onChange={(e) =>
                setFormData({ ...formData, telefone: e.target.value })
              }
              className="w-full rounded-xl border border-outline-variant py-3 pl-10 pr-4 text-on-surface outline-none transition focus:ring-2 focus:ring-primary"
              placeholder="+244 923 456 789"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-on-surface">
            Motivo da consulta
          </label>
          <div className="relative">
            <FileText
              size={18}
              className="absolute left-3 top-3 text-outline"
            />
            <textarea
              value={formData.motivo}
              onChange={(e) =>
                setFormData({ ...formData, motivo: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-outline-variant py-3 pl-10 pr-4 text-on-surface outline-none transition focus:ring-2 focus:ring-primary"
              placeholder="Descreva brevemente o motivo da consulta..."
              maxLength={500}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-container"
          >
            Confirmar Consulta
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}