/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import { Eye, Users, Calendar, Clock, TrendingUp, XCircle } from 'lucide-react'

interface Stats {
  total_consultas: number
  confirmadas: number
  realizadas: number
  canceladas: number
  faltas: number
  novos_pacientes: number
  taxa_ocupacao: number
  taxa_absenteismo: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/reports?tipo=mensal')
        const data = await response.json()
        if (data.resumo) {
          setStats(data.resumo)
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    {
      label: 'Total Consultas',
      value: stats?.total_consultas ?? '-',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Confirmadas',
      value: stats?.confirmadas ?? '-',
      icon: Eye,
      color: 'bg-green-100 text-green-800',
    },
    {
      label: 'Realizadas',
      value: stats?.realizadas ?? '-',
      icon: TrendingUp,
      color: 'bg-teal-100 text-teal-800',
    },
    {
      label: 'Canceladas',
      value: stats?.canceladas ?? '-',
      icon: XCircle,
      color: 'bg-red-100 text-red-800',
    },
    {
      label: 'Faltas',
      value: stats?.faltas ?? '-',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      label: 'Novos Pacientes',
      value: stats?.novos_pacientes ?? '-',
      icon: Users,
      color: 'bg-purple-100 text-purple-800',
    },
  ]

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Dashboard</h2>
            <p className="text-on-surface-variant">
              Visão geral do mês atual
            </p>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl bg-surface-container" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-xl border border-outline-variant bg-white p-5 transition hover:shadow-card-hover"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-on-surface-variant">{card.label}</p>
                        <p className="mt-1 text-3xl font-bold text-on-surface">
                          {card.value}
                        </p>
                      </div>
                      <div className={`rounded-full p-3 ${card.color}`}>
                        <card.icon size={24} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Taxas */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-outline-variant bg-white p-5">
                  <h3 className="mb-2 text-sm font-medium text-on-surface-variant">
                    Taxa de Ocupação
                  </h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {stats?.taxa_ocupacao ?? 0}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-surface-container">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${stats?.taxa_ocupacao ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-outline-variant bg-white p-5">
                  <h3 className="mb-2 text-sm font-medium text-on-surface-variant">
                    Taxa de Absenteísmo
                  </h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-error">
                      {stats?.taxa_absenteismo ?? 0}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-surface-container">
                    <div
                      className="h-2 rounded-full bg-error transition-all"
                      style={{ width: `${stats?.taxa_absenteismo ?? 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}