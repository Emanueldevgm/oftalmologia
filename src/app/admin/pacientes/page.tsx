/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import { Search, User, Calendar, Clock, AlertCircle } from 'lucide-react'

export default function PacientesPage() {
  const [bi, setBi] = useState('')
  const [paciente, setPaciente] = useState<{
    bi: string
    nome: string
    email: string
    telefone: string | null
    consultas: Array<{
      id: string
      data_hora: string
      status: string
      medicos: { nome: string } | null
    }>
    faltas: number
    bloqueado: boolean
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!bi) return
    setLoading(true)
    setError('')
    setPaciente(null)

    try {
      const response = await fetch(`/api/admin/patients/${bi.toUpperCase().trim()}`)
      const data = await response.json()
      if (data.paciente) {
        setPaciente(data.paciente)
      } else {
        setError(data.error || 'Paciente não encontrado')
      }
    } catch {
      setError('Erro ao buscar paciente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Pacientes</h2>
            <p className="text-on-surface-variant">Buscar e visualizar pacientes</p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={bi}
              onChange={(e) => setBi(e.target.value.toUpperCase())}
              placeholder="Buscar por BI..."
              className="flex-1 rounded-xl border border-outline-variant px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              maxLength={14}
            />
            <button
              onClick={handleSearch}
              disabled={loading || bi.length < 14}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-container disabled:opacity-50"
            >
              <Search size={18} />
              Buscar
            </button>
          </div>

          {loading && (
            <div className="h-48 animate-pulse rounded-xl bg-surface-container" />
          )}

          {error && (
            <div className="rounded-xl bg-error-container/20 p-4 text-sm text-error">
              {error}
            </div>
          )}

          {paciente && (
            <div className="space-y-4">
              <div className="rounded-xl border border-outline-variant bg-white p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-primary-container/20 p-3 text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{paciente.nome}</h3>
                    <p className="text-sm text-on-surface-variant">BI: {paciente.bi}</p>
                  </div>
                  {paciente.bloqueado && (
                    <span className="ml-auto rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                      Bloqueado
                    </span>
                  )}
                </div>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p>📧 {paciente.email}</p>
                  <p>📱 {paciente.telefone || 'N/A'}</p>
                  <p>⚠️ Faltas (6m): {paciente.faltas}</p>
                </div>
              </div>

              {paciente.consultas.length > 0 && (
                <div>
                  <h4 className="mb-3 font-medium">Histórico de Consultas</h4>
                  <div className="space-y-2">
                    {paciente.consultas.map((c) => (
                      <div key={c.id} className="flex items-center justify-between rounded-lg border border-outline-variant bg-white p-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-primary" />
                          <span>{new Date(c.data_hora).toLocaleDateString('pt')}</span>
                          <Clock size={16} className="text-primary" />
                          <span>{new Date(c.data_hora).toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.status === 'confirmada' ? 'bg-green-100 text-green-800' :
                          c.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}