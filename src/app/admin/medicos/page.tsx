/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import DoctorsList from '@/app/components/Admin/Doctors/DoctorsList'
import { Plus, X, Stethoscope, Upload, Trash2, LayoutGrid, List } from 'lucide-react'
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
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table') // Toggle visualização
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setShowForm(false)
        setFormData({ nome: '', crm: '', especialidade: '', turno_manha: true, turno_tarde: false, vagas_por_turno: 9 })
        fetchMedicos()
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
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

  const handleDelete = async (medico: Medico) => {
    try {
      await fetch(`/api/admin/doctors/${medico.id}`, {
        method: 'DELETE',
      })
      fetchMedicos()
    } catch (error) {
      console.error('Erro ao remover:', error)
    }
  }

  const handleEdit = (medico: Medico) => {
    // Preencher formulário e abrir
    setFormData({
      nome: medico.nome,
      crm: medico.crm,
      especialidade: medico.especialidade || '',
      turno_manha: medico.turno_manha,
      turno_tarde: medico.turno_tarde,
      vagas_por_turno: medico.vagas_por_turno,
    })
    setShowForm(true)
    // TODO: atualizar médico via PUT, não só POST
    // Pode ser adaptado para um modal de edição separado
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
              {/* Toggle de visualização */}
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
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
              >
                {showForm ? <X size={18} /> : <Plus size={18} />}
                {showForm ? 'Cancelar' : 'Novo Médico'}
              </button>
            </div>
          </div>

          {/* Formulário de Cadastro/Edição */}
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
                          onChange={(e) => setFormData({ ...formData, vagas_por_turno: parseInt(e.target.value) })}
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
                        className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
                      >
                        {formData.nome ? 'Atualizar Médico' : 'Cadastrar Médico'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary"
                      >
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
            />
          ) : (
            /* Grid de Cards (mantida para alternativa) */
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
                    <p>Manhã: {medico.turno_manha ? '✅ Sim' : '❌ Não'}</p>
                    <p>Tarde: {medico.turno_tarde ? '✅ Sim' : '❌ Não'}</p>
                    <p>Vagas: {medico.vagas_por_turno}/turno</p>
                  </div>
                  <button
                    onClick={() => toggleStatus(medico.id, medico.ativo)}
                    className={`mt-3 w-full rounded-xl px-4 py-1.5 text-xs font-semibold transition ${
                      medico.ativo
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    {medico.ativo ? '🟢 Ativo' : '🔴 Inativo'} — Clique para alternar
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}