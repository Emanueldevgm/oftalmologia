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
} from 'lucide-react'
import CancelModal from './CancelModal'

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
    className: 'bg-green-100 text-green-800',
  },
  cancelada: {
    label: 'Cancelada',
    icon: XCircle,
    className: 'bg-red-100 text-red-800',
  },
  realizada: {
    label: 'Realizada',
    icon: CheckCircle,
    className: 'bg-blue-100 text-blue-800',
  },
  faltou: {
    label: 'Faltou',
    icon: AlertCircle,
    className: 'bg-yellow-100 text-yellow-800',
  },
}

export default function ConsultasList({ bi, senha }: ConsultasListProps) {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null)

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
    fetchConsultas() // Recarregar lista
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-surface-container"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-error/20 bg-error-container/20 p-6 text-center">
        <AlertCircle size={48} className="mx-auto mb-3 text-error" />
        <p className="text-error">{error}</p>
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
      <div className="rounded-xl border border-outline-variant bg-white p-8 text-center">
        <Eye size={48} className="mx-auto mb-3 text-outline-variant" />
        <p className="text-lg font-medium text-on-surface">
          Nenhuma consulta encontrada
        </p>
        <p className="mt-2 text-on-surface-variant">
          Você ainda não possui consultas marcadas nos últimos 90 dias.
        </p>
        <a
          href="/agendar"
          className="mt-4 inline-block rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-container"
        >
          Agendar Consulta
        </a>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {consultas.map((consulta) => {
          const statusInfo = STATUS_MAP[consulta.status] || {
            label: consulta.status,
            icon: AlertCircle,
            className: 'bg-gray-100 text-gray-800',
          }
          const StatusIcon = statusInfo.icon
          const upcoming = isUpcoming(consulta.data_hora)

          return (
            <div
              key={consulta.id}
              className="rounded-xl border border-outline-variant bg-white p-5 transition hover:shadow-card-hover"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <span className="font-medium text-on-surface">
                      {formatDate(consulta.data_hora)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <span className="text-on-surface-variant">
                      {formatTime(consulta.data_hora)}
                    </span>
                  </div>
                  {consulta.medicos && (
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      <span className="text-on-surface-variant">
                        {consulta.medicos.nome} ({consulta.medicos.crm})
                      </span>
                    </div>
                  )}
                  {consulta.motivo && (
                    <p className="text-sm text-on-surface-variant">
                      Motivo: {consulta.motivo}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
                  >
                    <StatusIcon size={14} />
                    {statusInfo.label}
                  </span>

                  {consulta.status === 'confirmada' && upcoming && (
                    <button
                      onClick={() => handleCancelClick(consulta)}
                      className="flex items-center gap-1 rounded-full border border-error/30 px-3 py-1 text-xs font-medium text-error transition hover:bg-error hover:text-white"
                    >
                      <XCircle size={14} />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
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
    </>
  )
}