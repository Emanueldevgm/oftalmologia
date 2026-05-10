'use client'

import { useState, useEffect, useRef } from 'react'
import { Eye, Users, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatItem {
  icon: React.ElementType
  value: number
  suffix: string
  label: string
}

const STATS: StatItem[] = [
  {
    icon: Eye,
    value: 1500,
    suffix: '+',
    label: 'Consultas realizadas este ano',
  },
  {
    icon: Users,
    value: 3500,
    suffix: '+',
    label: 'Pacientes atendidos',
  },
  {
    icon: Calendar,
    value: 7,
    suffix: '',
    label: 'Médicos especialistas',
  },
  {
    icon: Clock,
    value: 15,
    suffix: ' min',
    label: 'Tempo médio de espera',
  },
]

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number
  suffix: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 2000
          const increment = value / (duration / 16)

          const timer = setInterval(() => {
            start += increment
            if (start >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)

          return () => clearInterval(timer)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="bg-white">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 inline-flex rounded-full bg-primary-fixed/30 p-4 text-primary-container">
                <stat.icon size={28} />
              </div>
              <p className="mb-2 text-[40px] font-bold text-primary">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-body-md text-on-surface-variant">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}