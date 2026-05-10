'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import { Calendar, Clock, User, Search, XCircle, CheckCircle, AlertCircle } from 'lucide-react'

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

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  confirmada: { label: 'Confirmada', className: 'bg-green-100 text-green-800' },
  cancelada: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
  realizada: { label: 'Realizada', className: 'bg-blue-100 text-blue-800' },
  faltou: { label: 'Faltou', className: 'bg-yellow-100 text-yellow-800' },
}

export default function AgendaPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [dataFilter, setDataFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

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
    try {
      await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchConsultas()
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    }
  }

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return {
      date: d.toLocaleDateString('pt', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Agenda</h2>
            <p className="text-on-surface-variant">Gerir consultas marcadas</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <input
              type="date"
              value={dataFilter}
              onChange={(e) => setDataFilter(e.target.value)}
              className="rounded-xl border border-outline-variant px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-outline-variant px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos os status</option>
              <option value="confirmada">Confirmada</option>
              <option value="realizada">Realizada</option>
              <option value="cancelada">Cancelada</option>
              <option value="faltou">Faltou</option>
            </select>
          </div>

          {/* Consultas List */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-surface-container" />
              ))}
            </div>
          ) : consultas.length === 0 ? (
            <div className="rounded-xl border border-outline-variant bg-white p-8 text-center">
              <Search size={48} className="mx-auto mb-3 text-outline-variant" />
              <p className="text-on-surface-variant">Nenhuma consulta encontrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {consultas.map((consulta) => {
                const { date, time } = formatDateTime(consulta.data_hora)
                const statusInfo = STATUS_MAP[consulta.status] || { label: consulta.status, className: 'bg-gray-100 text-gray-800' }

                return (
                  <div key={consulta.id} className="rounded-xl border border-outline-variant bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          <span className="font-medium">{date}</span>
                          <Clock size={16} className="text-primary ml-2" />
                          <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <User size={16} />
                          <span>{consulta.pacientes?.nome || 'N/A'}</span>
                        </div>
                        {consulta.medicos && (
                          <p className="text-xs text-on-surface-variant">
                            Dr(a). {consulta.medicos.nome}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>

                        {consulta.status === 'confirmada' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateStatus(consulta.id, 'realizada')}
                              className="rounded-full bg-green-100 p-2 text-green-700 hover:bg-green-200"
                              title="Marcar como realizada"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => updateStatus(consulta.id, 'faltou')}
                              className="rounded-full bg-yellow-100 p-2 text-yellow-700 hover:bg-yellow-200"
                              title="Marcar como falta"
                            >
                              <AlertCircle size={16} />
                            </button>
                            <button
                              onClick={() => updateStatus(consulta.id, 'cancelada')}
                              className="rounded-full bg-red-100 p-2 text-red-700 hover:bg-red-200"
                              title="Cancelar consulta"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}