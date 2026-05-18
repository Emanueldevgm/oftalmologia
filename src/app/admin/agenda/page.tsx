/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import { Calendar, Clock, User, Search, XCircle, CheckCircle, AlertCircle, FilterX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Consulta {
  id: string
  data_hora: string
  status: string
  motivo: string | null
  pacientes: {
    nome: string
    email: string
    telefone: string | null
  } | null
  medicos: {
    nome: string
    crm: string
  } | null
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; variant: 'success' | 'danger' | 'info' | 'warning' | 'neutral' }> = {
  confirmada: { label: 'Confirmada', icon: CheckCircle, variant: 'success' },
  cancelada: { label: 'Cancelada', icon: XCircle, variant: 'danger' },
  realizada: { label: 'Realizada', icon: CheckCircle, variant: 'info' },
  faltou: { label: 'Faltou', icon: AlertCircle, variant: 'warning' },
}

const variantStyles: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
}

export default function AgendaPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [dataFilter, setDataFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchConsultas = async () => {
    setLoading(true)
    try {
      let url = '/api/admin/appointments?'
      if (dataFilter) url += `data=${dataFilter}&`
      if (statusFilter) url += `status=${statusFilter}&`

      const response = await fetch(url)
      const data = await response.json()
      if (data.consultas) {
        setConsultas(data.consultas)
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConsultas()
  }, [dataFilter, statusFilter])

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    try {
      await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchConsultas()
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return {
      date: d.toLocaleDateString('pt', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  const clearFilters = () => {
    setDataFilter('')
    setStatusFilter('')
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Agenda</h2>
            <p className="text-text-secondary">Gerir consultas marcadas</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="date"
                value={dataFilter}
                onChange={(e) => setDataFilter(e.target.value)}
                className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="">Todos os status</option>
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            {(dataFilter || statusFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-xs text-text-tertiary transition hover:bg-surface-secondary hover:text-text-primary"
              >
                <FilterX size={14} />
                Limpar
              </button>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-tertiary" />
              ))}
            </div>
          ) : consultas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-16"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary">
                <Search size={28} className="text-text-tertiary" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-text-primary">Nenhuma consulta encontrada</h3>
              <p className="text-sm text-text-secondary">
                {dataFilter || statusFilter ? 'Tente ajustar os filtros' : 'As consultas marcadas aparecerão aqui'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {consultas.map((consulta) => {
                  const { date, time } = formatDateTime(consulta.data_hora)
                  const status = STATUS_CONFIG[consulta.status] || { label: consulta.status, icon: AlertCircle, variant: 'neutral' as const }
                  const StatusIcon = status.icon

                  return (
                    <motion.div
                      key={consulta.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="group rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary/10 hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-2">
                          {/* Data e Hora */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-lg bg-surface-secondary px-2.5 py-1">
                              <Calendar size={14} className="text-primary" />
                              <span className="text-sm font-medium text-text-primary">{date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-lg bg-surface-secondary px-2.5 py-1">
                              <Clock size={14} className="text-primary" />
                              <span className="text-sm font-medium text-text-primary">{time}</span>
                            </div>
                          </div>

                          {/* Paciente */}
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                              <User size={14} className="text-blue-600" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-text-primary">
                                {consulta.pacientes?.nome || 'N/A'}
                              </span>
                              {consulta.pacientes?.telefone && (
                                <span className="ml-2 text-xs text-text-tertiary">{consulta.pacientes.telefone}</span>
                              )}
                            </div>
                          </div>

                          {/* Médico */}
                          {consulta.medicos && (
                            <p className="text-xs text-text-tertiary">
                              Dr(a). {consulta.medicos.nome} • {consulta.medicos.crm}
                            </p>
                          )}

                          {/* Motivo (se existir) */}
                          {consulta.motivo && (
                            <p className="text-xs italic text-text-tertiary/80">
                              &ldquo;{consulta.motivo}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Status + Ações */}
                        <div className="flex flex-col items-end gap-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${variantStyles[status.variant]}`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>

                          {consulta.status === 'confirmada' && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => updateStatus(consulta.id, 'realizada')}
                                disabled={updatingId === consulta.id}
                                className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:shadow-sm disabled:opacity-50"
                                title="Marcar como realizada"
                              >
                                <CheckCircle size={13} />
                                Realizada
                              </button>
                              <button
                                onClick={() => updateStatus(consulta.id, 'faltou')}
                                disabled={updatingId === consulta.id}
                                className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 hover:shadow-sm disabled:opacity-50"
                                title="Marcar como falta"
                              >
                                <AlertCircle size={13} />
                                Falta
                              </button>
                              <button
                                onClick={() => updateStatus(consulta.id, 'cancelada')}
                                disabled={updatingId === consulta.id}
                                className="flex items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 hover:shadow-sm disabled:opacity-50"
                                title="Cancelar consulta"
                              >
                                <XCircle size={13} />
                                Cancelar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}