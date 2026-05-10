/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import { FileText, Download } from 'lucide-react'

export default function RelatoriosPage() {
  const [tipo, setTipo] = useState<'diario' | 'semanal' | 'mensal'>('mensal')
  const [dados, setDados] = useState<{
    periodo: { tipo: string; inicio: string; fim: string }
    resumo: Record<string, number>
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchRelatorio = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/reports?tipo=${tipo}`)
      const data = await response.json()
      setDados(data)
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRelatorio() }, [tipo])

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Relatórios</h2>
              <p className="text-on-surface-variant">Indicadores de desempenho</p>
            </div>
            <div className="flex gap-2">
              {(['diario', 'semanal', 'mensal'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
                    tipo === t
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="h-64 animate-pulse rounded-xl bg-surface-container" />
          ) : dados ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(dados.resumo).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-outline-variant bg-white p-5">
                  <p className="text-sm capitalize text-on-surface-variant">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-on-surface">
                    {typeof value === 'number' && key.includes('taxa') ? `${value}%` : value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}