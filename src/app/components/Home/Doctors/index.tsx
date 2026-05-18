'use client'

import { useState, useEffect } from 'react'
import { Stethoscope, GraduationCap, Clock, Star, X, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

const doctorColors = [
  { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600', shadow: 'shadow-blue-500/20', ring: 'ring-blue-200', badge: 'bg-blue-100 text-blue-700' },
  { gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600', shadow: 'shadow-emerald-500/20', ring: 'ring-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
  { gradient: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600', shadow: 'shadow-violet-500/20', ring: 'ring-violet-200', badge: 'bg-violet-100 text-violet-700' },
  { gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600', shadow: 'shadow-amber-500/20', ring: 'ring-amber-200', badge: 'bg-amber-100 text-amber-700' },
  { gradient: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', text: 'text-rose-600', shadow: 'shadow-rose-500/20', ring: 'ring-rose-200', badge: 'bg-rose-100 text-rose-700' },
]

export default function Doctors() {
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null)

  useEffect(() => {
    async function fetchMedicos() {
      try {
        const response = await fetch('/api/admin/doctors')
        const data = await response.json()
        if (data.medicos && Array.isArray(data.medicos)) {
          const ativos = data.medicos.filter((m: Medico) => m.ativo)
          setMedicos(ativos)
        }
      } catch (error) {
        console.error('Erro ao carregar médicos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMedicos()
  }, [])

  const getTurnos = (medico: Medico): string => {
    if (medico.turno_manha && medico.turno_tarde) return 'Manhã e Tarde'
    if (medico.turno_manha) return 'Manhã'
    if (medico.turno_tarde) return 'Tarde'
    return 'Não definido'
  }

  return (
    <>
      <section className="relative bg-surface-secondary py-20 sm:py-28">
        {/* Background decor */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f8fafc_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-emerald-50/50 blur-3xl" />

        <div className="container relative max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-1.5 shadow-sm">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Nossa Equipa
              </span>
            </div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Conheça os{' '}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                especialistas
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-lg text-text-secondary">
              Profissionais dedicados e experientes que cuidam da sua saúde ocular com excelência.
            </p>
          </motion.div>

          {/* Loading */}
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-white/50" />
              ))}
            </div>
          ) : medicos.length === 0 ? (
            <div className="py-20 text-center">
              <Stethoscope size={48} className="mx-auto mb-4 text-text-tertiary" />
              <p className="text-text-secondary">Nenhum médico disponível no momento.</p>
            </div>
          ) : (
            /* Grid */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {medicos.map((medico, index) => {
                const color = doctorColors[index % doctorColors.length]

                return (
                  <motion.div
                    key={medico.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -8 }}
                    className="group relative"
                  >
                    <div className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-white p-6 text-center transition-all duration-500 hover:border-primary/10 hover:shadow-2xl hover:shadow-slate-200/50">

                      {/* Hover gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.03]`} />

                      <div className="relative">
                        {/* Avatar */}
                        <div className="mx-auto mb-5">
                          <div
                            onClick={() => medico.foto_url && setSelectedMedico(medico)}
                            className={`
                              relative mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full
                              transition-all duration-500
                              ${!medico.foto_url ? color.bg : ''}
                              ${medico.foto_url ? 'cursor-pointer' : ''}
                              group-hover:ring-4 ${color.ring} group-hover:shadow-lg ${color.shadow}
                            `}
                          >
                            {medico.foto_url ? (
                              <>
                                <img
                                  src={medico.foto_url}
                                  alt={medico.nome}
                                  className="h-full w-full object-cover"
                                />
                                {/* Overlay de zoom */}
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                                  <ZoomIn size={20} className="text-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                </div>
                              </>
                            ) : (
                              <div className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${color.gradient}`}>
                                <Stethoscope size={36} className="text-white drop-shadow-sm" />
                              </div>
                            )}

                            {/* Online indicator */}
                            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-sm">
                              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                            </div>
                          </div>
                        </div>

                        {/* Nome */}
                        <h3 className="mb-1 text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary">
                          {medico.nome}
                        </h3>

                        {/* Especialidade */}
                        <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${color.badge}`}>
                          {medico.especialidade || 'Oftalmologia'}
                        </span>

                        {/* Separator */}
                        <div className="mx-auto my-4 h-px w-12 bg-gradient-to-r from-transparent via-border to-transparent" />

                        {/* Info */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-center gap-1.5 text-xs text-text-tertiary">
                            <GraduationCap size={13} className="text-text-tertiary/60" />
                            <span>{medico.crm}</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1 text-xs text-text-secondary">
                            <Clock size={12} className="text-text-tertiary" />
                            <span>{getTurnos(medico)}</span>
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-x-0 -bottom-2 h-1 rounded-full bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Visualização Expandida */}
      <AnimatePresence>
        {selectedMedico && selectedMedico.foto_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedMedico(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                    <Stethoscope size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{selectedMedico.nome}</p>
                    <p className="text-xs text-text-tertiary">{selectedMedico.crm}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMedico(null)}
                  className="rounded-xl p-2 text-text-tertiary transition hover:bg-surface-secondary hover:text-text-primary"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Imagem expandida */}
              <div className="p-4">
                <img
                  src={selectedMedico.foto_url}
                  alt={selectedMedico.nome}
                  className="max-h-[70vh] w-auto rounded-2xl object-contain"
                />
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4 text-center">
                <p className="text-sm font-medium text-text-primary">{selectedMedico.nome}</p>
                <p className="text-xs text-text-tertiary">{selectedMedico.especialidade || 'Oftalmologia'}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}