'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section id="contactos" className="bg-primary">
      {/* Decorative Elements */}
      <div className="relative overflow-hidden">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/5" />

        <div className="container relative py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <Eye size={16} className="text-primary-fixed-dim" />
              <span className="text-sm font-medium text-primary-fixed-dim">
                Marcação Gratuita
              </span>
            </div>

            <h2 className="mb-4 text-white">
              Agende já a sua consulta de Oftalmologia
            </h2>

            <p className="mb-8 text-body-lg text-white/70">
              Não espere mais para cuidar da sua visão. Marque a sua consulta
              agora mesmo, de forma rápida e gratuita. O Hospital Geral do Uíge
              está de portas abertas para si.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/agendar"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-primary transition-all duration-200 hover:bg-primary-fixed hover:shadow-card-hover"
              >
                <Calendar size={20} />
                Agendar Consulta
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/consultar"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/10"
              >
                Já tenho consulta marcada
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/50">
              Chegue com 15 minutos de antecedência. Não se esqueça do seu
              Bilhete de Identidade (BI).
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}