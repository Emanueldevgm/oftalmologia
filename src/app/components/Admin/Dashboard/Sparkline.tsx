'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface SparklineProps {
  data: number[]
  color: string
  showTooltip?: boolean
}

const colorMap: Record<string, { stroke: string; gradient: string }> = {
  blue: { stroke: '#2563EB', gradient: 'from-blue-500/20 to-blue-500/0' },
  emerald: { stroke: '#10B981', gradient: 'from-emerald-500/20 to-emerald-500/0' },
  violet: { stroke: '#7C3AED', gradient: 'from-violet-500/20 to-violet-500/0' },
  amber: { stroke: '#F59E0B', gradient: 'from-amber-500/20 to-amber-500/0' },
  rose: { stroke: '#EF4444', gradient: 'from-rose-500/20 to-rose-500/0' },
  cyan: { stroke: '#06B6D4', gradient: 'from-cyan-500/20 to-cyan-500/0' },
}

export default function Sparkline({ data, color, showTooltip = false }: SparklineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const colorConfig = colorMap[color] || colorMap.blue
  const strokeColor = colorConfig.stroke
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 80
  const height = 36
  const padding = 3

  const points = data.map((value, index) => ({
    x: padding + (index / (data.length - 1)) * (width - padding * 2),
    y: padding + ((max - value) / range) * (height - padding * 2),
    value,
  }))

  const linePath = points.map(p => `${p.x},${p.y}`).join(' ')
  const areaPath = `${padding},${height - padding} ${linePath} ${width - padding},${height - padding}`

  return (
    <div className="relative">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id={`sparkline-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill={`url(#sparkline-${color})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* End dot */}
        {points.length > 0 && (
          <motion.circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="2.5"
            fill="white"
            stroke={strokeColor}
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          />
        )}

        {/* Hover dots */}
        {showTooltip &&
          points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 5 : 3}
              fill="white"
              stroke={strokeColor}
              strokeWidth={hoveredIndex === index ? 2.5 : 1.5}
              className="cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{
                opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.3 : 1,
                scale: hoveredIndex === index ? 1.5 : 1,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                filter: hoveredIndex === index
                  ? `drop-shadow(0 0 4px ${strokeColor}60)`
                  : 'none',
              }}
            />
          ))}

        {/* Invisible hover rects for easier interaction */}
        {showTooltip &&
          points.map((point, index) => (
            <rect
              key={`hover-${index}`}
              x={point.x - 6}
              y={0}
              width="12"
              height={height}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-lg bg-[#0A1628] px-2 py-1 text-xs font-semibold text-white shadow-lg"
        >
          {points[hoveredIndex].value}
        </motion.div>
      )}
    </div>
  )
}