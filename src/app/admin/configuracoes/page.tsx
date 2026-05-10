/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import { Settings, Plus, X } from 'lucide-react'

interface Feriado {
  id: string
  data: string
  descricao: string
}

export default function ConfiguracoesPage() {
  const [percentual, setPercentual] = useState(10)
  const [feriados, setFeriados] = useState<Feriado[]>([])
  const [newFeriado, setNewFeriado] = useState({ data: '', descricao: '' })
  const [showForm, setShowForm] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/config')
      .then((r) => r.json())
      .then((d) => {
        if (d.percentual_encaixe) setPercentual(d.percentual_encaixe)
        if (d.feriados) setFeriados(d.feriados)
      })
      .catch(console.error)
  }, [])

  const saveConfig = async () => {
    await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ percentual_encaixe: percentual }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addFeriado = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/admin/holidays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeriado),
    })
    setNewFeriado({ data: '', descricao: '' })
    setShowForm(false)
    const r = await fetch('/api/admin/config')
    const d = await r.json()
    setFeriados(d.feriados || [])
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Configurações</h2>
            <p className="text-on-surface-variant">Gerir parâmetros do sistema</p>
          </div>

          {/* Encaixe */}
          <div className="rounded-xl border border-outline-variant bg-white p-5">
            <h3 className="mb-3 font-semibold">Percentual de Encaixe (%)</h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={percentual}
                onChange={(e) => setPercentual(parseInt(e.target.value))}
                className="w-24 rounded-xl border border-outline-variant px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                min={0}
                max={50}
              />
              <button
                onClick={saveConfig}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-container"
              >
                {saved ? '✅ Salvo!' : 'Salvar'}
              </button>
            </div>
          </div>

          {/* Feriados */}
          <div className="rounded-xl border border-outline-variant bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Feriados</h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-container"
              >
                {showForm ? <X size={14} /> : <Plus size={14} />}
                Adicionar
              </button>
            </div>

            {showForm && (
              <form onSubmit={addFeriado} className="mb-4 flex gap-2">
                <input
                  type="date"
                  value={newFeriado.data}
                  onChange={(e) => setNewFeriado({ ...newFeriado, data: e.target.value })}
                  className="rounded-xl border border-outline-variant px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="text"
                  value={newFeriado.descricao}
                  onChange={(e) => setNewFeriado({ ...newFeriado, descricao: e.target.value })}
                  placeholder="Descrição"
                  className="flex-1 rounded-xl border border-outline-variant px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="submit"
                  className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white"
                >
                  Salvar
                </button>
              </form>
            )}

            <div className="space-y-2">
              {feriados.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-lg bg-surface-container px-4 py-2 text-sm">
                  <span className="font-medium">{f.data}</span>
                  <span className="text-on-surface-variant">{f.descricao}</span>
                </div>
              ))}
              {feriados.length === 0 && (
                <p className="text-sm text-on-surface-variant">Nenhum feriado cadastrado</p>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}