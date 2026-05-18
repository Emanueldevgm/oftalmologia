/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Eye,
  XCircle,
  Clock,
  Activity,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const TIPOS_RELATORIO = [
  { key: 'diario' as const, label: 'Diário' },
  { key: 'semanal' as const, label: 'Semanal' },
  { key: 'mensal' as const, label: 'Mensal' },
]

const METRICA_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  total_consultas: { label: 'Total de Consultas', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  confirmadas: { label: 'Confirmadas', icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  realizadas: { label: 'Realizadas', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
  canceladas: { label: 'Canceladas', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  faltas: { label: 'Faltas', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  novos_pacientes: { label: 'Novos Pacientes', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
  taxa_ocupacao: { label: 'Taxa de Ocupação', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  taxa_absenteismo: { label: 'Taxa de Absenteísmo', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
}

export default function RelatoriosPage() {
  const [tipo, setTipo] = useState<'diario' | 'semanal' | 'mensal'>('mensal')
  const [dados, setDados] = useState<{
    periodo: { tipo: string; inicio: string; fim: string }
    resumo: Record<string, number>
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRelatorio = async () => {
    setLoading(true)
    setError('')
    setDados(null)
    try {
      const response = await fetch(`/api/admin/reports?tipo=${tipo}`)
      const data = await response.json()
      if (data.resumo) {
        setDados(data)
      } else {
        setError(data.error || 'Erro ao carregar relatório')
      }
    } catch {
      setError('Erro de conexão ao carregar relatório')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRelatorio()
  }, [tipo])

  const formatPeriodo = () => {
    if (!dados?.periodo) return ''
    const inicio = new Date(dados.periodo.inicio).toLocaleDateString('pt', { day: '2-digit', month: 'short' })
    const fim = new Date(dados.periodo.fim).toLocaleDateString('pt', { day: '2-digit', month: 'short', year: 'numeric' })
    return `${inicio} — ${fim}`
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Relatórios</h2>
              <p className="text-text-secondary">Indicadores de desempenho do serviço</p>
            </div>

            {/* Tipo Selector */}
            <div className="flex rounded-xl bg-surface-secondary p-1">
              {TIPOS_RELATORIO.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTipo(t.key)}
                  className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    tipo === t.key
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  {t.label}
                  {tipo === t.key && (
                    <motion.div
                      layoutId="activeRelatorioTab"
                      className="absolute inset-0 rounded-lg bg-white shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Período Info */}
          {dados && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-text-tertiary"
            >
              <Calendar size={14} />
              <span className="capitalize">Período {dados.periodo.tipo}:</span>
              <span className="font-medium text-text-secondary">{formatPeriodo()}</span>
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-surface-tertiary" />
              ))}
            </div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                  <XCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700">Erro ao carregar</p>
                  <p className="text-xs text-red-600/70">{error}</p>
                </div>
                <button
                  onClick={fetchRelatorio}
                  className="ml-auto rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                >
                  Tentar novamente
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards de Métricas */}
          <AnimatePresence mode="wait">
            {dados && !loading && (
              <motion.div
                key={tipo}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {Object.entries(dados.resumo).map(([key, value], index) => {
                  const config = METRICA_CONFIG[key] || {
                    label: key.replace(/_/g, ' '),
                    icon: FileText,
                    color: 'text-text-secondary',
                    bg: 'bg-surface-secondary',
                  }
                  const Icon = config.icon
                  const isPercentage = key.includes('taxa')
                  const displayValue = isPercentage ? `${value}%` : value.toLocaleString()

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                      whileHover={{ y: -3 }}
                      className="group relative cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white p-5 transition-all duration-300 hover:border-primary/10 hover:shadow-lg">
                        {/* Hover gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="relative">
                          {/* Header */}
                          <div className="mb-3 flex items-center justify-between">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.bg}`}>
                              <Icon size={18} className={config.color} />
                            </div>
                          </div>

                          {/* Value */}
                          <p className="text-2xl font-bold text-text-primary">{displayValue}</p>

                          {/* Label */}
                          <p className="mt-1 text-xs capitalize text-text-tertiary">{config.label}</p>

                          {/* Mini barra de progresso para taxas */}
                          {isPercentage && typeof value === 'number' && (
                            <div className="mt-3 h-1.5 rounded-full bg-surface-secondary">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, value)}%` }}
                                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                                className={`h-full rounded-full ${
                                  key === 'taxa_absenteismo' ? 'bg-red-400' : 'bg-emerald-400'
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State (quando não tem dados e não está carregando) */}
          {!loading && !dados && !error && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-16">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary">
                <FileText size={28} className="text-text-tertiary" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-text-primary">Selecione o período</h3>
              <p className="text-sm text-text-secondary">Escolha diário, semanal ou mensal para visualizar os indicadores</p>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}