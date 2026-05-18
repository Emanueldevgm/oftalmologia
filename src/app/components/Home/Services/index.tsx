'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { servicos } from '@/config/services'

const cardColors = [
  { bg: 'from-blue-500/5 to-blue-600/5', border: 'group-hover:border-blue-200', icon: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-500/20', accent: 'from-blue-400/0 via-blue-400/40 to-blue-400/0' },
  { bg: 'from-emerald-500/5 to-emerald-600/5', border: 'group-hover:border-emerald-200', icon: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-emerald-500/20', accent: 'from-emerald-400/0 via-emerald-400/40 to-emerald-400/0' },
  { bg: 'from-violet-500/5 to-violet-600/5', border: 'group-hover:border-violet-200', icon: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-violet-500/20', accent: 'from-violet-400/0 via-violet-400/40 to-violet-400/0' },
  { bg: 'from-amber-500/5 to-amber-600/5', border: 'group-hover:border-amber-200', icon: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white group-hover:shadow-amber-500/20', accent: 'from-amber-400/0 via-amber-400/40 to-amber-400/0' },
  { bg: 'from-rose-500/5 to-rose-600/5', border: 'group-hover:border-rose-200', icon: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white group-hover:shadow-rose-500/20', accent: 'from-rose-400/0 via-rose-400/40 to-rose-400/0' },
  { bg: 'from-cyan-500/5 to-cyan-600/5', border: 'group-hover:border-cyan-200', icon: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white group-hover:shadow-cyan-500/20', accent: 'from-cyan-400/0 via-cyan-400/40 to-cyan-400/0' },
]

export default function Services() {
  return (
    <section id="servicos" className="relative bg-white py-20 sm:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#f8fafc_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e2e8f0_0.5px,transparent_0.5px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,black_20%,transparent_70%)] pointer-events-none" />

      <div className="container relative max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50/50 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Nossos Serviços</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Cuidamos da sua{' '}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              saúde ocular
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Oferecemos uma gama completa de cuidados oftalmológicos com equipamentos modernos e especialistas dedicados.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((servico, index) => {
            const color = cardColors[index % cardColors.length]
            
            return (
              <motion.div
                key={servico.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative cursor-pointer perspective-[1000px]"
              >
                <div className={`
                  relative h-full overflow-hidden rounded-2xl border border-border/60 bg-white p-6
                  transition-all duration-500 ease-out
                  ${color.border}
                  hover:shadow-2xl hover:shadow-slate-200/50
                `}>
                  
                  {/* Background gradient colorido */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100`} />

                  {/* Top accent */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color.accent} opacity-0 transition-all duration-700 ease-out group-hover:opacity-100`} />

                  {/* Corner glow */}
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-slate-100 to-transparent opacity-0 blur-2xl transition-all duration-700 ease-out group-hover:opacity-60" />

                  <div className="relative">
                    {/* Icon */}
                    <div className={`
                      mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl
                      transition-all duration-500 ease-out
                      ${color.icon}
                      shadow-sm group-hover:shadow-lg group-hover:scale-110
                    `}>
                      <servico.icon size={22} />
                    </div>

                    {/* Title */}
                    <h3 className="mb-2.5 text-base font-semibold text-text-primary transition-all duration-300 group-hover:translate-x-0.5">
                      {servico.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-text-secondary transition-all duration-300 group-hover:text-text-primary/80">
                      {servico.description}
                    </p>

                    {/* Arrow */}
                    <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-transparent transition-all duration-500 ease-out group-hover:text-primary">
                      <span>Saber mais</span>
                      <ArrowRight size={12} className="transition-all duration-500 group-hover:translate-x-1.5" strokeWidth={2.5} />
                    </div>

                    {/* Bottom accent on hover */}
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color.accent} scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}