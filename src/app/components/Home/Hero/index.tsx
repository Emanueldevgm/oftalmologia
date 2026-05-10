'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, Eye, Shield, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface pb-0 pt-16 md:pt-24">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.03]" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-fixed/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary-container/20 blur-3xl" />

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-container/10 px-4 py-2">
              <Eye size={16} className="text-primary-container" />
              <span className="text-sm font-medium text-primary-container">
                Serviço de Oftalmologia
              </span>
            </div>

            <h1 className="mb-6">
              A sua{' '}
              <span className="text-primary-container">saúde ocular</span>{' '}
              começa aqui
            </h1>

            <p className="mb-8 text-body-lg text-on-surface-variant">
              Marque a sua consulta de Oftalmologia no Hospital Geral do Uíge
              de forma rápida, gratuita e sem sair de casa. Atendimento
              especializado para toda a população.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/agendar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-primary-container hover:shadow-card-hover"
              >
                <Calendar size={20} />
                Agendar Consulta
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/consultar"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-8 py-4 text-base font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
              >
                Consultar Marcação
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Shield size={16} className="text-secondary" />
                <span>Consulta Gratuita</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Clock size={16} className="text-secondary" />
                <span>Atendimento Rápido</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Eye size={16} className="text-secondary" />
                <span>Especialistas</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:justify-self-end"
          >
            <div className="relative">
              {/* Main Visual Card */}
              <div className="relative overflow-hidden rounded-2xl bg-primary-container p-8 text-white shadow-card-hover">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-full bg-white/20 p-3">
                    <Eye size={32} />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Especialidade</p>
                    <p className="text-xl font-semibold">Oftalmologia</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-sm text-white/70">Consultas</p>
                    <p className="text-2xl font-bold">+1,500</p>
                    <p className="text-sm text-white/70">realizadas este ano</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-sm text-white/70">Médicos</p>
                    <p className="text-2xl font-bold">7</p>
                    <p className="text-sm text-white/70">especialistas ativos</p>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-4 shadow-card-hover">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-2">
                    <Shield size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">Status</p>
                    <p className="text-sm font-semibold text-on-surface">
                      Aberto para Marcações
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="mt-16 h-16 bg-gradient-to-b from-transparent to-surface-container" />
    </section>
  )
}