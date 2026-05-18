/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import { Settings, Plus, X, Trash2, Calendar, Percent, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/config')
      const d = await r.json()
      if (d.percentual_encaixe) setPercentual(d.percentual_encaixe)
      if (d.feriados) setFeriados(d.feriados)
    } catch (error) {
      console.error('Erro ao carregar config:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ percentual_encaixe: percentual }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const addFeriado = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFeriado.data || !newFeriado.descricao) return
    try {
      await fetch('/api/admin/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeriado),
      })
      setNewFeriado({ data: '', descricao: '' })
      setShowForm(false)
      fetchConfig()
    } catch (error) {
      console.error('Erro ao adicionar feriado:', error)
    }
  }

  const removeFeriado = async (id: string) => {
    try {
      await fetch(`/api/admin/holidays/${id}`, { method: 'DELETE' })
      fetchConfig()
    } catch (error) {
      console.error('Erro ao remover feriado:', error)
    } finally {
      setDeleteId(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Configurações</h2>
            <p className="text-text-secondary">Gerir parâmetros do sistema e feriados</p>
          </div>

          {/* Card: Percentual de Encaixe */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm"
          >
            <div className="border-b border-border/60 bg-surface-secondary/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                  <Percent size={18} className="text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                  Percentual de Encaixe
                </h3>
              </div>
              <p className="mt-1 text-xs text-text-tertiary">
                Vagas reservadas para emergências não visíveis no portal público
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={percentual}
                  onChange={(e) => setPercentual(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-28 rounded-xl border border-border px-4 py-3 text-center text-lg font-bold text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  min={0}
                  max={50}
                />
                <span className="text-sm text-text-secondary">% das vagas totais</span>
                <button
                  onClick={saveConfig}
                  className="ml-auto flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {saved ? (
                    <>
                      <CheckCircle2 size={16} />
                      Salvo!
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Salvar
                    </>
                  )}
                </button>
              </div>
              {saved && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-xs text-emerald-600"
                >
                  Configuração atualizada com sucesso
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Card: Feriados */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-border/60 bg-surface-secondary/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                  <Calendar size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                    Feriados
                  </h3>
                  <p className="text-xs text-text-tertiary">{feriados.length} cadastrado{feriados.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                {showForm ? <X size={16} /> : <Plus size={16} />}
                {showForm ? 'Cancelar' : 'Adicionar'}
              </button>
            </div>

            {/* Add Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-b border-border/60"
                >
                  <form onSubmit={addFeriado} className="flex flex-wrap gap-3 px-6 py-4">
                    <input
                      type="date"
                      value={newFeriado.data}
                      onChange={(e) => setNewFeriado({ ...newFeriado, data: e.target.value })}
                      className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      required
                    />
                    <input
                      type="text"
                      value={newFeriado.descricao}
                      onChange={(e) => setNewFeriado({ ...newFeriado, descricao: e.target.value })}
                      placeholder="Descrição do feriado"
                      className="flex-[2] rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      required
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                    >
                      <Plus size={16} />
                      Adicionar
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feriados List */}
            <div className="divide-y divide-border/40">
              {loading ? (
                <div className="p-6 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-xl bg-surface-tertiary" />
                  ))}
                </div>
              ) : feriados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-secondary">
                    <Calendar size={24} className="text-text-tertiary" />
                  </div>
                  <p className="text-sm font-medium text-text-secondary">Nenhum feriado cadastrado</p>
                  <p className="text-xs text-text-tertiary">Adicione feriados para bloqueá-los no agendamento</p>
                </div>
              ) : (
                feriados.map((feriado) => (
                  <motion.div
                    key={feriado.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-surface-secondary/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{feriado.descricao}</p>
                        <p className="text-xs text-text-tertiary">{formatDate(feriado.data)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteId(feriado.id)}
                      className="rounded-xl p-2 text-text-tertiary transition hover:bg-red-50 hover:text-red-600"
                      title="Remover feriado"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {deleteId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                onClick={() => setDeleteId(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <Trash2 size={24} className="text-red-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-text-primary">Remover feriado</h3>
                  <p className="mb-6 text-sm text-text-secondary">
                    Tem certeza que deseja remover este feriado? Esta ação não pode ser desfeita.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteId(null)}
                      className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => removeFeriado(deleteId)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      <X size={16} />
                      Remover
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}