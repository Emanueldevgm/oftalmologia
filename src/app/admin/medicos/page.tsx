'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import { Plus, X, Stethoscope } from 'lucide-react'

interface Medico {
  id: string
  nome: string
  crm: string
  turno_manha: boolean
  turno_tarde: boolean
  vagas_por_turno: number
  ativo: boolean
}

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
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
        setFormData({ nome: '', crm: '', turno_manha: true, turno_tarde: false, vagas_por_turno: 9 })
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

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Médicos</h2>
              <p className="text-on-surface-variant">Gerir equipa médica</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-container"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? 'Cancelar' : 'Novo Médico'}
            </button>
          </div>

          {showForm && (
            <div className="rounded-xl border border-outline-variant bg-white p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Nome</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full rounded-xl border border-outline-variant px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">CRM</label>
                    <input
                      type="text"
                      value={formData.crm}
                      onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                      className="w-full rounded-xl border border-outline-variant px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.turno_manha}
                        onChange={(e) => setFormData({ ...formData, turno_manha: e.target.checked })}
                        className="h-4 w-4 rounded text-primary"
                      />
                      <span className="text-sm">Turno Manhã</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.turno_tarde}
                        onChange={(e) => setFormData({ ...formData, turno_tarde: e.target.checked })}
                        className="h-4 w-4 rounded text-primary"
                      />
                      <span className="text-sm">Turno Tarde</span>
                    </label>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Vagas por Turno</label>
                    <input
                      type="number"
                      value={formData.vagas_por_turno}
                      onChange={(e) => setFormData({ ...formData, vagas_por_turno: parseInt(e.target.value) })}
                      className="w-full rounded-xl border border-outline-variant px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                      min={1}
                      max={20}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-container"
                >
                  Cadastrar Médico
                </button>
              </form>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-xl bg-surface-container" />
              ))
            ) : (
              medicos.map((medico) => (
                <div key={medico.id} className="rounded-xl border border-outline-variant bg-white p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-full bg-primary-container/20 p-2 text-primary">
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-on-surface">{medico.nome}</h3>
                      <p className="text-xs text-on-surface-variant">{medico.crm}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-on-surface-variant">
                    <p>Manhã: {medico.turno_manha ? '✅ Sim' : '❌ Não'}</p>
                    <p>Tarde: {medico.turno_tarde ? '✅ Sim' : '❌ Não'}</p>
                    <p>Vagas: {medico.vagas_por_turno}/turno</p>
                  </div>
                  <button
                    onClick={() => toggleStatus(medico.id, medico.ativo)}
                    className={`mt-3 w-full rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      medico.ativo
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {medico.ativo ? 'Ativo' : 'Inativo'} - Clique para alternar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}