/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import { Search, User, Calendar, Clock, AlertCircle, Mail, Phone, ShieldAlert, CheckCircle2, XCircle, Eye, FilterX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConsultaHistorico {
  id: string
  data_hora: string
  status: string
  medicos: { nome: string } | null
}

interface PacienteData {
  bi: string
  nome: string
  email: string
  telefone: string | null
  consultas: ConsultaHistorico[]
  faltas: number
  bloqueado: boolean
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; variant: 'success' | 'danger' | 'info' | 'warning' | 'neutral' }> = {
  confirmada: { label: 'Confirmada', icon: CheckCircle2, variant: 'success' },
  cancelada: { label: 'Cancelada', icon: XCircle, variant: 'danger' },
  realizada: { label: 'Realizada', icon: CheckCircle2, variant: 'info' },
  faltou: { label: 'Faltou', icon: AlertCircle, variant: 'warning' },
  confirmada_pelo_paciente: { label: 'Atendimento Confirmado', icon: CheckCircle2, variant: 'success' },
}

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'bi' | 'nome'>('bi')
  const [paciente, setPaciente] = useState<PacienteData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!searchTerm) return
    setLoading(true)
    setError('')
    setPaciente(null)

    try {
      let url = '/api/admin/patients/search?'

      if (searchType === 'bi') {
        url += `bi=${searchTerm.toUpperCase().trim()}`
      } else {
        url += `nome=${encodeURIComponent(searchTerm.trim())}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.paciente) {
        setPaciente(data.paciente)
      } else if (data.pacientes && Array.isArray(data.pacientes) && data.pacientes.length > 0) {
        // Se veio múltiplos pacientes (busca por nome), mostrar o primeiro
        setPaciente(data.pacientes[0])
      } else {
        setError(data.error || 'Paciente não encontrado')
      }
    } catch {
      setError('Erro ao buscar paciente')
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setPaciente(null)
    setError('')
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Pacientes</h2>
            <p className="text-text-secondary">Buscar e visualizar informações de pacientes por BI ou Nome</p>
          </div>

          {/* Search Bar */}
          <div className="space-y-3">
            {/* Toggle Search Type */}
            <div className="flex rounded-xl bg-surface-secondary p-1 w-fit">
              <button
                onClick={() => { setSearchType('bi'); setSearchTerm(''); setPaciente(null); setError('') }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  searchType === 'bi'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                <FileTextIcon className="mr-1 inline" size={16} />
                Por BI
              </button>
              <button
                onClick={() => { setSearchType('nome'); setSearchTerm(''); setPaciente(null); setError('') }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  searchType === 'nome'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                <User size={16} className="mr-1 inline" />
                Por Nome
              </button>
            </div>

            {/* Search Input */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    searchType === 'bi'
                      ? 'Buscar por BI (ex: 001234567LA000)...'
                      : 'Buscar por nome do paciente...'
                  }
                  className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-text-tertiary"
                  maxLength={searchType === 'bi' ? 14 : 100}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || searchTerm.length < 2}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <Search size={18} />
                )}
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
              {(searchTerm || paciente) && (
                <button
                  onClick={clearSearch}
                  className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-3 text-xs text-text-tertiary transition hover:bg-surface-secondary hover:text-text-primary"
                >
                  <FilterX size={14} />
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              <div className="h-32 animate-pulse rounded-2xl bg-surface-tertiary" />
              <div className="h-48 animate-pulse rounded-2xl bg-surface-tertiary" />
            </div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700">Paciente não encontrado</p>
                  <p className="text-xs text-red-600/70">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resultado */}
          <AnimatePresence>
            {paciente && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-5"
              >
                {/* Card do Paciente */}
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
                  <div className="border-b border-border/60 bg-surface-secondary/30 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 shadow-sm">
                          <User size={28} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-text-primary">{paciente.nome}</h3>
                          <p className="text-sm text-text-tertiary">BI: {paciente.bi}</p>
                        </div>
                      </div>
                      {paciente.bloqueado && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                          <ShieldAlert size={16} />
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 p-6 sm:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-xl bg-surface-secondary/50 p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                        <Mail size={16} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-text-tertiary">Email</p>
                        <p className="truncate text-sm font-medium text-text-primary">{paciente.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-surface-secondary/50 p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                        <Phone size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">Telefone</p>
                        <p className="text-sm font-medium text-text-primary">{paciente.telefone || 'Não informado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-surface-secondary/50 p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                        <AlertCircle size={16} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">Faltas (6 meses)</p>
                        <p className="text-sm font-bold text-text-primary">{paciente.faltas}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Histórico de Consultas */}
                {paciente.consultas.length > 0 && (
                  <div className="rounded-2xl border border-border/60 bg-white shadow-sm">
                    <div className="border-b border-border/60 px-6 py-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                        Histórico de Consultas ({paciente.consultas.length})
                      </h4>
                    </div>
                    <div className="divide-y divide-border/40">
                      {paciente.consultas.map((consulta, index) => {
                        const status = statusConfig[consulta.status] || { label: consulta.status, icon: Eye, variant: 'neutral' as const }
                        const StatusIcon = status.icon
                        const variantStyles: Record<string, string> = {
                          success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                          danger: 'bg-red-50 text-red-700 border-red-200',
                          warning: 'bg-amber-50 text-amber-700 border-amber-200',
                          info: 'bg-blue-50 text-blue-700 border-blue-200',
                          neutral: 'bg-slate-50 text-slate-600 border-slate-200',
                        }

                        return (
                          <motion.div
                            key={consulta.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-surface-secondary/30"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <Calendar size={15} className="text-text-tertiary" />
                                <span>{formatDate(consulta.data_hora)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <Clock size={15} className="text-text-tertiary" />
                                <span>{formatTime(consulta.data_hora)}</span>
                              </div>
                              {consulta.medicos && (
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                  <User size={15} className="text-text-tertiary" />
                                  <span>Dr(a). {consulta.medicos.nome}</span>
                                </div>
                              )}
                            </div>
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${variantStyles[status.variant]}`}>
                              <StatusIcon size={12} />
                              {status.label}
                            </span>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State (quando não buscou nada ainda) */}
          {!loading && !paciente && !error && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary">
                <Search size={28} className="text-text-tertiary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Buscar Paciente</h3>
              <p className="max-w-sm text-sm text-text-secondary">
                Pesquise pelo número do BI ou pelo nome do paciente para visualizar suas informações e histórico de consultas.
              </p>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

// Ícone para o tab de BI
function FileTextIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}