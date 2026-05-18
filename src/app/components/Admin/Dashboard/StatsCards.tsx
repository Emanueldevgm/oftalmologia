'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react'
import Sparkline from './Sparkline'

interface StatCardProps {
  title: string
  value: number | string
  suffix?: string
  change?: number
  changeLabel?: string
  icon: React.ElementType
  color: string
  sparklineData?: number[]
}

const cardColors: Record<string, { 
  bg: string
  iconBg: string
  iconColor: string
  glow: string
  border: string
  accent: string
  dot: string
}> = {
  blue: { 
    bg: 'from-blue-500/5 to-blue-600/5', 
    iconBg: 'bg-blue-50', 
    iconColor: 'text-blue-600', 
    glow: 'shadow-blue-500/10',
    border: 'group-hover:border-blue-200',
    accent: 'bg-blue-500',
    dot: 'bg-blue-400',
  },
  emerald: { 
    bg: 'from-emerald-500/5 to-emerald-600/5', 
    iconBg: 'bg-emerald-50', 
    iconColor: 'text-emerald-600', 
    glow: 'shadow-emerald-500/10',
    border: 'group-hover:border-emerald-200',
    accent: 'bg-emerald-500',
    dot: 'bg-emerald-400',
  },
  violet: { 
    bg: 'from-violet-500/5 to-violet-600/5', 
    iconBg: 'bg-violet-50', 
    iconColor: 'text-violet-600', 
    glow: 'shadow-violet-500/10',
    border: 'group-hover:border-violet-200',
    accent: 'bg-violet-500',
    dot: 'bg-violet-400',
  },
  amber: { 
    bg: 'from-amber-500/5 to-amber-600/5', 
    iconBg: 'bg-amber-50', 
    iconColor: 'text-amber-600', 
    glow: 'shadow-amber-500/10',
    border: 'group-hover:border-amber-200',
    accent: 'bg-amber-500',
    dot: 'bg-amber-400',
  },
  rose: { 
    bg: 'from-rose-500/5 to-rose-600/5', 
    iconBg: 'bg-rose-50', 
    iconColor: 'text-rose-600', 
    glow: 'shadow-rose-500/10',
    border: 'group-hover:border-rose-200',
    accent: 'bg-rose-500',
    dot: 'bg-rose-400',
  },
  cyan: { 
    bg: 'from-cyan-500/5 to-cyan-600/5', 
    iconBg: 'bg-cyan-50', 
    iconColor: 'text-cyan-600', 
    glow: 'shadow-cyan-500/10',
    border: 'group-hover:border-cyan-200',
    accent: 'bg-cyan-500',
    dot: 'bg-cyan-400',
  },
}

export default function StatsCards() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const stats: StatCardProps[] = [
    {
      title: 'Consultas Realizadas',
      value: '1,847',
      change: 12.5,
      changeLabel: 'vs mês anterior',
      icon: TrendingUp,
      color: 'blue',
      sparklineData: [30, 45, 38, 52, 48, 60, 55, 65, 58, 70, 62, 75],
    },
    {
      title: 'Pacientes Ativos',
      value: '3,520',
      change: 8.2,
      changeLabel: 'vs mês anterior',
      icon: TrendingUp,
      color: 'emerald',
      sparklineData: [20, 35, 28, 42, 38, 50, 45, 55, 48, 60, 52, 65],
    },
    {
      title: 'Taxa de Comparecimento',
      value: '94.8',
      suffix: '%',
      change: -1.2,
      changeLabel: 'vs mês anterior',
      icon: TrendingDown,
      color: 'amber',
      sparklineData: [95, 93, 96, 94, 97, 95, 93, 96, 94, 97, 95, 94],
    },
    {
      title: 'Médicos Disponíveis',
      value: '7',
      change: 0,
      changeLabel: 'sem alterações',
      icon: TrendingUp,
      color: 'violet',
      sparklineData: [5, 5, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7],
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const color = cardColors[stat.color]
        const isPositive = (stat.change ?? 0) >= 0
        const isExpanded = expandedCard === index

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -6 }}
            onClick={() => setExpandedCard(isExpanded ? null : index)}
            className="group relative cursor-pointer"
            layout
          >
            <div className={`
              relative overflow-hidden rounded-2xl border border-border/60 bg-white p-5
              transition-all duration-500
              ${color.border}
              hover:shadow-xl hover:shadow-slate-200/50
              ${isExpanded ? 'ring-2 ring-primary/10 shadow-xl' : ''}
            `}>
              
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${color.accent} origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 ${isExpanded ? 'scale-x-100' : ''}`} />

              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${isExpanded ? 'opacity-100' : ''}`} />

              {/* Corner glow */}
              <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-slate-50 opacity-0 blur-xl transition-all duration-700 group-hover:opacity-60" />

              <div className="relative">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <motion.div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${color.iconBg} ${color.iconColor} transition-all duration-500 group-hover:scale-110 group-hover:shadow-md`}
                    whileHover={{ rotate: [0, -5, 5, -3, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <stat.icon size={20} />
                  </motion.div>

                  <div className="flex items-center gap-2">
                    {/* Mini sparkline */}
                    {stat.sparklineData && (
                      <motion.div
                        className="h-9 w-24"
                        animate={{ width: isExpanded ? 120 : 96 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        <Sparkline data={stat.sparklineData} color={stat.color} />
                      </motion.div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedCard(isExpanded ? null : index)
                      }}
                      className="rounded-lg p-1 text-text-tertiary opacity-0 transition-all duration-200 hover:bg-surface-secondary hover:text-text-primary group-hover:opacity-100"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>

                {/* Value */}
                <motion.div
                  className="mb-1"
                  animate={{ scale: isExpanded ? 1.05 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span className="text-2xl font-bold text-text-primary">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-lg font-semibold text-text-tertiary">{stat.suffix}</span>
                  )}
                </motion.div>

                {/* Title */}
                <p className="text-xs font-medium text-text-tertiary transition-colors duration-300 group-hover:text-text-secondary">
                  {stat.title}
                </p>

                {/* Change indicator */}
                {stat.change !== undefined && (
                  <div className="mt-3 flex items-center gap-1.5 border-t border-border/50 pt-3">
                    <motion.span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isPositive
                          ? 'bg-emerald-50 text-emerald-700'
                          : stat.change === 0
                            ? 'bg-surface-secondary text-text-tertiary'
                            : 'bg-red-50 text-red-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {isPositive ? (
                        <TrendingUp size={12} />
                      ) : stat.change === 0 ? (
                        <span className="text-xs">—</span>
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {stat.change !== 0 ? `${Math.abs(stat.change)}%` : '0%'}
                    </motion.span>
                    <span className="text-xs text-text-tertiary">{stat.changeLabel}</span>
                  </div>
                )}

                {/* Expanded info */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-2 border-t border-border/50 pt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-tertiary">Média diária</span>
                          <span className="font-medium text-text-primary">
                            {stat.sparklineData 
                              ? Math.round(stat.sparklineData.reduce((a, b) => a + b, 0) / stat.sparklineData.length)
                              : '—'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-tertiary">Melhor dia</span>
                          <span className="font-medium text-text-primary">
                            {stat.sparklineData ? Math.max(...stat.sparklineData) : '—'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-tertiary">Tendência</span>
                          <span className={`flex items-center gap-1 font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {isPositive ? 'Crescimento' : 'Queda'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom indicator dots */}
              <div className="mt-3 flex items-center justify-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className={`h-1 w-1 rounded-full ${color.dot}`} />
                <div className="h-1 w-1 rounded-full bg-border" />
                <div className="h-1 w-1 rounded-full bg-border" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}