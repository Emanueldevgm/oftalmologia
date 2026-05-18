'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, Eye, Shield, Clock, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section id="contactos" className="relative bg-primary">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Bolhas decorativas */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/10 blur-3xl" />
      </div>

      <div className="container relative py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
              <Eye size={12} className="text-white" />
            </div>
            <span className="text-sm font-medium text-blue-200">
              Marcação 100% Gratuita
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Agende já a sua{' '}
            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              consulta
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/60">
            Não espere mais para cuidar da sua visão. Marque a sua consulta agora mesmo, 
            de forma rápida e gratuita. O Hospital Geral do Uíge está de portas abertas para si.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/agendar"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-2xl shadow-black/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30 active:scale-[0.98]"
            >
              <Calendar size={20} />
              <span>Agendar Consulta</span>
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>

            <Link
              href="/consultar"
              className="group relative inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-500 hover:border-white/40 hover:bg-white/10"
            >
              Já tenho consulta marcada
              <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
          >
            {[
              { icon: Shield, text: 'Consulta Gratuita' },
              { icon: Clock, text: 'Chegue 15min antes' },
              { icon: Eye, text: 'Traga seu BI' },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 text-sm text-white/50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                  <item.icon size={14} className="text-blue-300" />
                </div>
                {item.text}
              </div>
            ))}
          </motion.div>

          {/* Bottom note */}
          <p className="mt-8 text-sm text-white/30">
            Atendimento de Segunda a Sexta, das 08h00 às 16h00
          </p>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-surface-secondary to-transparent pointer-events-none" />
    </section>
  )
}