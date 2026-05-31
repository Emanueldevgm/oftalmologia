/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Stethoscope, Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, Check, CheckCircle2 } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Badge } from '@/app/components/ui/Badge'

interface Medico {
  id: string
  nome: string
  crm: string
  especialidade?: string
  turno_manha: boolean
  turno_tarde: boolean
  vagas_por_turno: number
  ativo: boolean
  foto_url: string | null
}

interface DoctorsListProps {
  medicos: Medico[]
  onEdit?: (medico: Medico) => void
  onDelete?: (medico: Medico) => void
  onToggleStatus?: (id: string, ativo: boolean) => void
  onActivate?: (medicoId: string) => void
}

const especialidades = [
  'Oftalmologia Geral',
  'Retina e Vítreo',
  'Catarata e Glaucoma',
  'Oftalmologia Pediátrica',
  'Córnea e Superfície Ocular',
  'Plástica Ocular',
  'Neuroftalmologia',
  'Uveíte',
]

export default function DoctorsList({ medicos, onEdit, onDelete, onToggleStatus, onActivate }: DoctorsListProps) {
  const [search, setSearch] = useState('')
  const [especialidadeFilter, setEspecialidadeFilter] = useState('')
  const [turnoFilter, setTurnoFilter] = useState('')
  const [page, setPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const itemsPerPage = 8

  // Filtrar
  const filtered = medicos.filter((m) => {
    const matchSearch = m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.crm.toLowerCase().includes(search.toLowerCase())
    const matchEspecialidade = !especialidadeFilter || m.especialidade === especialidadeFilter
    const matchTurno = !turnoFilter ||
      (turnoFilter === 'manha' && m.turno_manha) ||
      (turnoFilter === 'tarde' && m.turno_tarde) ||
      (turnoFilter === 'ambos' && m.turno_manha && m.turno_tarde)
    return matchSearch && matchEspecialidade && matchTurno
  })

  // Paginação
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por nome ou CRM..."
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-text-tertiary"
          />
        </div>

        {/* Especialidade filter */}
        <select
          value={especialidadeFilter}
          onChange={(e) => { setEspecialidadeFilter(e.target.value); setPage(1) }}
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="">Todas especialidades</option>
          {especialidades.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        {/* Turno filter */}
        <select
          value={turnoFilter}
          onChange={(e) => { setTurnoFilter(e.target.value); setPage(1) }}
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="">Todos turnos</option>
          <option value="manha">Manhã</option>
          <option value="tarde">Tarde</option>
          <option value="ambos">Manhã e Tarde</option>
        </select>

        {/* Count */}
        <span className="text-xs text-text-tertiary">
          {filtered.length} médico{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-surface-secondary/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Médico
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  CRM
                </th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary md:table-cell">
                  Especialidade
                </th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary sm:table-cell">
                  Turnos
                </th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary lg:table-cell">
                  Vagas
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Status
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Stethoscope size={36} className="mx-auto mb-3 text-text-tertiary/50" />
                    <p className="text-sm font-medium text-text-secondary">Nenhum médico encontrado</p>
                    <p className="mt-1 text-xs text-text-tertiary">
                      {search || especialidadeFilter || turnoFilter
                        ? 'Tente ajustar os filtros de busca'
                        : 'Cadastre o primeiro médico'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((medico, index) => (
                  <motion.tr
                    key={medico.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="group transition-colors duration-150 hover:bg-surface-secondary/30"
                  >
                    {/* Nome + Foto */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {medico.foto_url ? (
                          <img
                            src={medico.foto_url}
                            alt={medico.nome}
                            className="h-9 w-9 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
                            <Stethoscope size={16} className="text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{medico.nome}</p>
                          <p className="text-xs text-text-tertiary md:hidden">
                            {medico.especialidade || 'Oftalmologia'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CRM */}
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-text-secondary">{medico.crm}</span>
                    </td>

                    {/* Especialidade (desktop) */}
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      <span className="inline-flex rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                        {medico.especialidade || 'Oftalmologia Geral'}
                      </span>
                    </td>

                    {/* Turnos (tablet+) */}
                    <td className="hidden px-5 py-3.5 sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex h-2 w-2 rounded-full ${medico.turno_manha ? 'bg-emerald-400' : 'bg-border'}`} />
                        <span className="text-xs text-text-tertiary">M</span>
                        <span className={`inline-flex h-2 w-2 rounded-full ${medico.turno_tarde ? 'bg-amber-400' : 'bg-border'}`} />
                        <span className="text-xs text-text-tertiary">T</span>
                      </div>
                    </td>

                    {/* Vagas (desktop) */}
                    <td className="hidden px-5 py-3.5 lg:table-cell">
                      <span className="text-sm text-text-secondary">{medico.vagas_por_turno}/turno</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      {medico.ativo ? (
                        <button
                          onClick={() => onToggleStatus?.(medico.id, medico.ativo)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition-all duration-200 hover:scale-105 hover:bg-emerald-100"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Ativo
                        </button>
                      ) : (
                        <button
                          onClick={() => onActivate?.(medico.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition-all duration-200 hover:scale-105 hover:bg-emerald-100"
                        >
                          <CheckCircle2 size={12} />
                          Ativar Médico
                        </button>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit?.(medico)}
                          className="rounded-lg p-2 text-text-tertiary transition-all duration-200 hover:bg-surface-secondary hover:text-primary"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(medico.id)}
                          className="rounded-lg p-2 text-text-tertiary transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/60 px-5 py-3">
            <p className="text-xs text-text-tertiary">
              Página {page} de {totalPages} • {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="rounded-lg p-1.5 text-text-tertiary transition hover:bg-surface-secondary hover:text-text-primary disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition ${
                    page === p
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-tertiary hover:bg-surface-secondary hover:text-text-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="rounded-lg p-1.5 text-text-tertiary transition hover:bg-surface-secondary hover:text-text-primary disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setDeleteConfirm(null)}
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
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Remover médico</h3>
              <p className="mb-6 text-sm text-text-secondary">
                Tem certeza que deseja remover este médico? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary"
                >
                  <X size={16} className="mr-1 inline" />
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onDelete?.(medicos.find(m => m.id === deleteConfirm)!)
                    setDeleteConfirm(null)
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <Check size={16} />
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}