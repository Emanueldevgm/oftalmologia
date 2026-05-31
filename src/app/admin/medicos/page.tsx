/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import DoctorsList from '@/app/components/Admin/Doctors/DoctorsList'
import { Plus, X, Stethoscope, Upload, Trash2, LayoutGrid, List, CheckCircle2, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Medico {
  id: string
  nome: string
  crm: string
  turno_manha: boolean
  turno_tarde: boolean
  vagas_por_turno: number
  ativo: boolean
  foto_url: string | null
  especialidade?: string
}

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
    especialidade: '',
    turno_manha: true,
    turno_tarde: false,
    vagas_por_turno: 9,
  })

  const fetchMedicos = async () => {
    try {
      const response = await fetch('/api/admin/doctors')
      const data = await response.json()
      if (data.medicos) setMedicos(data.medicos)
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMedicos() }, [])

  const resetForm = () => {
    setFormData({ nome: '', crm: '', especialidade: '', turno_manha: true, turno_tarde: false, vagas_por_turno: 9 })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const response = await fetch(`/api/admin/doctors/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          resetForm()
          fetchMedicos()
        } else {
          const data = await response.json()
          alert(data.error || 'Erro ao atualizar médico')
        }
      } else {
        const response = await fetch('/api/admin/doctors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          resetForm()
          fetchMedicos()
        } else {
          const data = await response.json()
          alert(data.error || 'Erro ao cadastrar médico')
        }
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro de conexão ao salvar')
    }
  }

  const toggleStatus = async (id: string, ativo: boolean) => {
    try {
      await fetch(`/api/admin/doctors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !ativo }),
      })
      fetchMedicos()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const handleActivate = async (medicoId: string) => {
    try {
      await fetch(`/api/admin/doctors/${medicoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: true }),
      })
      fetchMedicos()
    } catch (error) {
      console.error('Erro ao ativar:', error)
    }
  }

  const handleDelete = async (medico: Medico) => {
    if (medico.ativo) {
      try {
        const response = await fetch(`/api/admin/doctors/${medico.id}`, {
          method: 'DELETE',
        })
        const data = await response.json()
        if (data.success) {
          fetchMedicos()
        } else {
          alert(data.error || 'Erro ao desativar médico')
        }
      } catch (error) {
        console.error('Erro ao desativar:', error)
      }
    } else {
      if (!confirm('Este médico já está inativo. Deseja eliminá-lo PERMANENTEMENTE? Esta ação não pode ser desfeita.')) return

      try {
        const response = await fetch(`/api/admin/doctors/${medico.id}?force=true`, {
          method: 'DELETE',
        })
        const data = await response.json()

        if (data.success) {
          fetchMedicos()
        } else {
          alert(data.error || 'Erro ao eliminar médico')
        }
      } catch (error) {
        console.error('Erro ao eliminar:', error)
      }
    }
  }

  const handleEdit = (medico: Medico) => {
    setFormData({
      nome: medico.nome,
      crm: medico.crm,
      especialidade: medico.especialidade || '',
      turno_manha: medico.turno_manha,
      turno_tarde: medico.turno_tarde,
      vagas_por_turno: medico.vagas_por_turno,
    })
    setEditingId(medico.id)
    setShowForm(true)
  }

  const handlePhotoUpload = async (medicoId: string, file: File) => {
    setUploading(medicoId)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('medicoId', medicoId)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        fetchMedicos()
      } else {
        alert(data.error || 'Erro ao carregar foto')
      }
    } catch (error) {
      console.error('Erro upload:', error)
      alert('Erro ao carregar foto')
    } finally {
      setUploading(null)
    }
  }

  const handlePhotoRemove = async (medicoId: string) => {
    if (!confirm('Remover foto deste médico?')) return
    try {
      await fetch(`/api/admin/doctors/${medicoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foto_url: null }),
      })
      fetchMedicos()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Médicos</h2>
              <p className="text-text-secondary">Gerir equipa médica e fotos</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl bg-surface-secondary p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    viewMode === 'table'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
              <button
                onClick={() => {
                  if (showForm) {
                    resetForm()
                  } else {
                    setShowForm(true)
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
              >
                {showForm ? <X size={18} /> : <Plus size={18} />}
                {showForm ? 'Cancelar' : 'Novo Médico'}
              </button>
            </div>
          </div>

          {/* Formulário */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
                      <Stethoscope size={18} className="text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                      {editingId ? 'Editar Médico' : 'Novo Médico'}
                    </h3>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-text-primary">Nome</label>
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-text-primary">CRM</label>
                        <input
                          type="text"
                          value={formData.crm}
                          onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                          className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-text-primary">Especialidade</label>
                        <input
                          type="text"
                          value={formData.especialidade}
                          onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                          className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          placeholder="Ex: Oftalmologia Geral"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-text-primary">Vagas/Turno</label>
                        <input
                          type="number"
                          value={formData.vagas_por_turno}
                          onChange={(e) => setFormData({ ...formData, vagas_por_turno: parseInt(e.target.value) || 1 })}
                          className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          min={1}
                          max={20}
                        />
                      </div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.turno_manha}
                            onChange={(e) => setFormData({ ...formData, turno_manha: e.target.checked })}
                            className="h-4 w-4 rounded accent-primary"
                          />
                          <span className="text-sm text-text-secondary">Turno Manhã</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.turno_tarde}
                            onChange={(e) => setFormData({ ...formData, turno_tarde: e.target.checked })}
                            className="h-4 w-4 rounded accent-primary"
                          />
                          <span className="text-sm text-text-secondary">Turno Tarde</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
                      >
                        {editingId ? (
                          <>
                            <CheckCircle2 size={16} />
                            Atualizar Médico
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            Cadastrar Médico
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex items-center gap-2 rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary"
                      >
                        <X size={16} />
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conteúdo principal */}
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-surface-tertiary" />
              ))}
            </div>
          ) : viewMode === 'table' ? (
            <DoctorsList
              medicos={medicos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={toggleStatus}
              onActivate={handleActivate}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {medicos.map((medico) => (
                <motion.div
                  key={medico.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="relative">
                      {medico.foto_url ? (
                        <img src={medico.foto_url} alt={medico.nome} className="h-16 w-16 rounded-2xl object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                          <Stethoscope size={28} className="text-primary" />
                        </div>
                      )}
                      <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:bg-primary-dark">
                        <Upload size={12} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handlePhotoUpload(medico.id, file)
                          }}
                        />
                      </label>
                      {medico.foto_url && (
                        <button
                          onClick={() => handlePhotoRemove(medico.id)}
                          className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary truncate">{medico.nome}</h3>
                      <p className="text-xs text-text-tertiary">{medico.crm}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      {medico.turno_manha ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <XCircle size={14} className="text-text-tertiary" />
                      )}
                      <span>Manhã</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {medico.turno_tarde ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <XCircle size={14} className="text-text-tertiary" />
                      )}
                      <span>Tarde</span>
                    </div>
                    <p>Vagas: {medico.vagas_por_turno}/turno</p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {medico.ativo ? (
                      <button
                        onClick={() => toggleStatus(medico.id, medico.ativo)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <CheckCircle2 size={12} />
                        Ativo
                        <span className="opacity-60">— Clique para desativar</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleActivate(medico.id)}
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <CheckCircle2 size={12} />
                          Ativar Médico
                        </button>
                        <button
                          onClick={() => handleDelete(medico)}
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 size={12} />
                          Eliminar Permanentemente
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}