'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Sparkles } from 'lucide-react'

interface DashboardHeaderProps {
  title: string
  subtitle: string
  actionLabel?: string
  actionHref?: string
}

export default function DashboardHeader({
  title,
  subtitle,
  actionLabel = 'Ver relatórios',
  actionHref = '/admin/relatorios',
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A1628] p-6 shadow-xl shadow-black/20"
    >
      {/* Background Effects */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl transition-all duration-700 group-hover:bg-blue-500/10" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl transition-all duration-700 group-hover:bg-cyan-500/10" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 backdrop-blur-sm"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600">
              <BarChart3 size={14} className="text-white" />
            </div>
            <span className="text-sm font-medium text-blue-300">
              Painel de Desempenho
            </span>
            <Sparkles size={14} className="text-amber-400" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-white"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Link
            href={actionHref}
            className="group/btn inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0A1628] shadow-lg shadow-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/15 active:scale-[0.98]"
          >
            <span>{actionLabel}</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </motion.div>
  )
}