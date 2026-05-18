/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, TrendingUp } from 'lucide-react'

// Dados mock
const monthlyData = [
  { month: 'Jan', consultas: 145, exames: 98 },
  { month: 'Fev', consultas: 162, exames: 112 },
  { month: 'Mar', consultas: 178, exames: 125 },
  { month: 'Abr', consultas: 156, exames: 108 },
  { month: 'Mai', consultas: 198, exames: 142 },
  { month: 'Jun', consultas: 184, exames: 135 },
]

const statusData = [
  { label: 'Realizadas', value: 65, color: '#10B981' },
  { label: 'Confirmadas', value: 20, color: '#2563EB' },
  { label: 'Canceladas', value: 10, color: '#EF4444' },
  { label: 'Faltas', value: 5, color: '#F59E0B' },
]

// ============================================
// TOOLTIP COMPONENT
// ============================================
function Tooltip({ children, content }: { children: React.ReactNode; content: React.ReactNode }) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-full rounded-xl border border-border/50 bg-white px-3 py-2 shadow-xl"
            style={{ left: position.x, top: position.y - 10 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// BAR CHART
// ============================================
function BarChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const maxValue = Math.max(...monthlyData.map(d => d.consultas + d.exames))

  return (
    <div className="h-64">
      <div className="flex h-full items-end gap-3">
        {monthlyData.map((item, index) => (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
            <Tooltip
              content={
                <div className="text-center">
                  <p className="text-xs font-semibold text-text-primary">{item.month}</p>
                  <p className="text-xs text-text-secondary">Consultas: <span className="font-semibold text-primary">{item.consultas}</span></p>
                  <p className="text-xs text-text-secondary">Exames: <span className="font-semibold text-blue-400">{item.exames}</span></p>
                </div>
              }
            >
              <div
                className="flex w-full cursor-pointer flex-col gap-1"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Exames */}
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(item.exames / maxValue) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                  animate={{
                    height: hoveredBar === index
                      ? `${((item.exames / maxValue) * 180) * 1.05}px`
                      : `${(item.exames / maxValue) * 180}px`,
                    opacity: hoveredBar !== null && hoveredBar !== index ? 0.5 : 1,
                  }}
                  className="w-full min-h-[4px] rounded-t-md bg-blue-200 transition-colors duration-200"
                  style={{ height: `${(item.exames / maxValue) * 180}px` }}
                />
                {/* Consultas */}
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(item.consultas / maxValue) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                  animate={{
                    height: hoveredBar === index
                      ? `${((item.consultas / maxValue) * 180) * 1.05}px`
                      : `${(item.consultas / maxValue) * 180}px`,
                    opacity: hoveredBar !== null && hoveredBar !== index ? 0.5 : 1,
                  }}
                  className="w-full min-h-[4px] rounded-t-md bg-primary transition-all duration-200"
                  style={{ height: `${(item.consultas / maxValue) * 180}px` }}
                />
              </div>
            </Tooltip>
            <span className={`text-xs font-medium transition-colors duration-200 ${
              hoveredBar === index ? 'text-primary' : 'text-text-tertiary'
            }`}>
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// DONUT CHART
// ============================================
function DonutChart() {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
  const total = statusData.reduce((acc, d) => acc + d.value, 0)
  let cumulativePercent = 0

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
      {/* Donut SVG */}
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          {statusData.map((item, index) => {
            const percent = (item.value / total) * 100
            const dashArray = (percent / 100) * 100
            const dashOffset = -cumulativePercent
            cumulativePercent += dashArray

            return (
              <motion.circle
                key={item.label}
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={item.color}
                strokeWidth={hoveredSegment === index ? 4.5 : 3}
                strokeDasharray={`${dashArray} ${100 - dashArray}`}
                strokeDashoffset={dashOffset}
                className="cursor-pointer transition-all duration-300"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{
                  filter: hoveredSegment === index
                    ? `drop-shadow(0 0 8px ${item.color}40)`
                    : 'none',
                }}
              />
            )
          })}
        </svg>
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          animate={{ scale: hoveredSegment !== null ? 1.05 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {hoveredSegment !== null ? (
            <>
              <span className="text-2xl font-bold" style={{ color: statusData[hoveredSegment].color }}>
                {statusData[hoveredSegment].value}
              </span>
              <span className="text-xs text-text-tertiary">{statusData[hoveredSegment].label}</span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold text-text-primary">{total}</span>
              <span className="text-xs text-text-tertiary">Total</span>
            </>
          )}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {statusData.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex cursor-pointer items-center gap-3"
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
            animate={{
              scale: hoveredSegment === index ? 1.05 : 1,
              x: hoveredSegment === index ? 4 : 0,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <motion.div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
              animate={{
                scale: hoveredSegment === index ? 1.4 : 1,
              }}
            />
            <div>
              <p className={`text-sm font-medium transition-colors duration-200 ${
                hoveredSegment === index ? 'text-text-primary' : 'text-text-secondary'
              }`}>
                {item.label}
              </p>
              <p className="text-xs text-text-tertiary">
                {item.value} ({Math.round((item.value / total) * 100)}%)
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// LINE CHART
// ============================================
function LineChart() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const width = 500
  const height = 200
  const padding = 35
  const maxValue = Math.max(...monthlyData.map(d => d.consultas))

  const points = monthlyData.map((item, index) => ({
    x: padding + (index / (monthlyData.length - 1)) * (width - padding * 2),
    y: padding + ((maxValue - item.consultas) / maxValue) * (height - padding * 2),
  }))

  const linePath = points.map(p => `${p.x},${p.y}`).join(' ')
  const areaPath = `${padding},${height - padding} ${linePath} ${width - padding},${height - padding}`

  return (
    <div className="h-52">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={padding}
            y1={padding + ratio * (height - padding * 2)}
            x2={width - padding}
            y2={padding + ratio * (height - padding * 2)}
            stroke="#E2E8F0"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}

        {/* Area */}
        <motion.path
          d={areaPath}
          fill="url(#lineGradient)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Hover area */}
        {hoveredPoint !== null && (
          <>
            {/* Vertical line */}
            <motion.line
              x1={points[hoveredPoint].x}
              y1={padding}
              x2={points[hoveredPoint].x}
              y2={height - padding}
              stroke="#2563EB"
              strokeWidth="1"
              strokeDasharray="3 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />
            {/* Horizontal line */}
            <motion.line
              x1={padding}
              y1={points[hoveredPoint].y}
              x2={width - padding}
              y2={points[hoveredPoint].y}
              stroke="#2563EB"
              strokeWidth="1"
              strokeDasharray="3 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />
            {/* Value label */}
            <motion.rect
              x={points[hoveredPoint].x - 20}
              y={points[hoveredPoint].y - 30}
              width="40"
              height="22"
              rx="6"
              fill="#2563EB"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            />
            <motion.text
              x={points[hoveredPoint].x}
              y={points[hoveredPoint].y - 16}
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {monthlyData[hoveredPoint].consultas}
            </motion.text>
          </>
        )}

        {/* Dots */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={hoveredPoint === index ? 6 : 4}
            fill="white"
            stroke="#2563EB"
            strokeWidth={hoveredPoint === index ? 3 : 2}
            className="cursor-pointer"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
            animate={{
              scale: hoveredPoint === index ? 1.5 : 1,
            }}
            onMouseEnter={() => setHoveredPoint(index)}
            onMouseLeave={() => setHoveredPoint(null)}
            style={{
              filter: hoveredPoint === index
                ? 'drop-shadow(0 0 6px rgba(37, 99, 235, 0.4))'
                : 'none',
            }}
          />
        ))}

        {/* Invisible larger hover targets */}
        {points.map((point, index) => (
          <motion.rect
            key={`hover-${index}`}
            x={point.x - 15}
            y={padding}
            width="30"
            height={height - padding * 2}
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint(index)}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between px-8">
        {monthlyData.map((item, index) => (
          <motion.span
            key={item.month}
            className={`text-xs font-medium cursor-pointer transition-colors duration-200 ${
              hoveredPoint === index ? 'text-primary' : 'text-text-tertiary'
            }`}
            onMouseEnter={() => setHoveredPoint(index)}
            animate={{
              scale: hoveredPoint === index ? 1.15 : 1,
            }}
          >
            {item.month}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ============================================
// MAIN CHARTS COMPONENT
// ============================================
export default function Charts() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -2 }}
        className="group rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/10 hover:shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Evolução de Consultas</h3>
            <p className="text-xs text-text-tertiary">Últimos 6 meses</p>
          </div>
          <button className="rounded-lg p-2 text-text-tertiary transition hover:bg-surface-secondary hover:text-primary">
            <Download size={16} />
          </button>
        </div>
        <LineChart />
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -2 }}
        className="group rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/10 hover:shadow-xl"
      >
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Consultas vs Exames</h3>
          <p className="text-xs text-text-tertiary">Por mês</p>
        </div>
        <BarChart />
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-primary" />
            <span className="text-xs text-text-tertiary">Consultas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-blue-200" />
            <span className="text-xs text-text-tertiary">Exames</span>
          </div>
        </div>
      </motion.div>

      {/* Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -2 }}
        className="group rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/10 hover:shadow-xl lg:col-span-2"
      >
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Distribuição de Status</h3>
          <p className="text-xs text-text-tertiary">Visão geral das consultas</p>
        </div>
        <DonutChart />
      </motion.div>
    </div>
  )
}