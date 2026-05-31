/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ThumbsUp,
  Loader2,
} from 'lucide-react'
import CancelModal from './CancelModal'
import { motion, AnimatePresence } from 'framer-motion'

interface Consulta {
  id: string
  data_hora: string
  status: string
  motivo: string | null
  qr_code: string | null
  medicos: {
    nome: string
    crm: string
  } | null
}

interface ConsultasListProps {
  bi: string
  senha: string
}

const STATUS_MAP: Record<
  string,
  {
    label: string
    icon: React.ElementType
    className: string
  }
> = {
  confirmada: {
    label: 'Confirmada',
    icon: CheckCircle,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  cancelada: {
    label: 'Cancelada',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  realizada: {
    label: 'Realizada',
    icon: CheckCircle,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  faltou: {
    label: 'Faltou',
    icon: AlertCircle,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  confirmada_pelo_paciente: {
    label: 'Atendimento Confirmado',
    icon: ThumbsUp,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
}

export default function ConsultasList({ bi, senha }: ConsultasListProps) {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmConsultaId, setConfirmConsultaId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  const fetchConsultas = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `/api/patient/consultas?bi=${bi}&senha=${senha}`
      )
      const data = await response.json()

      if (data.consultas) {
        setConsultas(data.consultas)
      } else {
        setError(data.error || 'Erro ao carregar consultas')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConsultas()
  }, [bi, senha])

  // Limpar mensagem de sucesso após 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateStr: string): string => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('pt', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isUpcoming = (dateStr: string): boolean => {
    return new Date(dateStr) > new Date()
  }

  const handleCancelClick = (consulta: Consulta) => {
    setSelectedConsulta(consulta)
    setCancelModalOpen(true)
  }

  const handleCancelSuccess = () => {
    setCancelModalOpen(false)
    setSelectedConsulta(null)
    fetchConsultas()
  }

  const handleConfirmClick = (consultaId: string) => {
    setConfirmConsultaId(consultaId)
    setConfirmModalOpen(true)
  }

  const handleConfirmAttendance = async () => {
    if (!confirmConsultaId) return

    setConfirmingId(confirmConsultaId)
    setConfirmModalOpen(false)

    try {
      const response = await fetch(`/api/appointments/${confirmConsultaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paciente_confirmou: true }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(data.message || 'Atendimento confirmado com sucesso!')
        fetchConsultas()
      } else {
        alert(data.error || 'Erro ao confirmar atendimento')
      }
    } catch {
      alert('Erro de conexão')
    } finally {
      setConfirmingId(null)
      setConfirmConsultaId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-surface-tertiary"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle size={48} className="mx-auto mb-3 text-red-500" />
        <p className="font-medium text-red-700">{error}</p>
        <button
          onClick={fetchConsultas}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (consultas.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary">
          <Eye size={28} className="text-text-tertiary" />
        </div>
        <p className="text-lg font-medium text-text-primary">
          Nenhuma consulta encontrada
        </p>
        <p className="mt-2 text-text-secondary">
          Você ainda não possui consultas marcadas nos últimos 90 dias.
        </p>
        <a
          href="/agendar"
          className="mt-4 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
        >
          Agendar Consulta
        </a>
      </div>
    )
  }

  return (
    <>
      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              <ThumbsUp size={18} className="text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {consultas.map((consulta) => {
          const statusInfo = STATUS_MAP[consulta.status] || {
            label: consulta.status,
            icon: AlertCircle,
            className: 'bg-slate-50 text-slate-600 border-slate-200',
          }
          const StatusIcon = statusInfo.icon
          const upcoming = isUpcoming(consulta.data_hora)
          const isConfirming = confirmingId === consulta.id

          return (
            <motion.div
              key={consulta.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md ${
                consulta.status === 'realizada'
                  ? 'border-blue-200 bg-blue-50/20'
                  : consulta.status === 'confirmada_pelo_paciente'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-border/60'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <span className="font-medium text-text-primary">
                      {formatDate(consulta.data_hora)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <span className="text-text-secondary">
                      {formatTime(consulta.data_hora)}
                    </span>
                  </div>
                  {consulta.medicos && (
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      <span className="text-text-secondary">
                        Dr(a). {consulta.medicos.nome} ({consulta.medicos.crm})
                      </span>
                    </div>
                  )}
                  {consulta.motivo && (
                    <p className="text-sm text-text-tertiary">
                      Motivo: {consulta.motivo}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
                  >
                    {isConfirming ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <StatusIcon size={14} />
                    )}
                    {statusInfo.label}
                  </span>

                  {/* Botão Cancelar (apenas consultas confirmadas futuras) */}
                  {consulta.status === 'confirmada' && upcoming && (
                    <button
                      onClick={() => handleCancelClick(consulta)}
                      className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <XCircle size={14} />
                      Cancelar
                    </button>
                  )}

                  {/* Botão Confirmar Atendimento (quando status = realizada) */}
                  {consulta.status === 'realizada' && (
                    <button
                      onClick={() => handleConfirmClick(consulta.id)}
                      disabled={isConfirming}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isConfirming ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ThumbsUp size={14} />
                      )}
                      {isConfirming ? 'Confirmando...' : 'Confirmar Atendimento'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Modal de Cancelamento */}
      {selectedConsulta && (
        <CancelModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          consultaId={selectedConsulta.id}
          bi={bi}
          senha={senha}
          onSuccess={handleCancelSuccess}
        />
      )}

      {/* Modal de Confirmação de Atendimento */}
      <AnimatePresence>
        {confirmModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setConfirmModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <ThumbsUp size={28} className="text-emerald-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Confirmar Atendimento</h3>
              <p className="mb-6 text-sm text-text-secondary">
                Ao confirmar, você atesta que foi atendido nesta consulta. Esta ação confirma que o serviço foi prestado pelo hospital.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModalOpen(false)}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary"
                >
                  Voltar
                </button>
                <button
                  onClick={handleConfirmAttendance}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  <ThumbsUp size={16} />
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}