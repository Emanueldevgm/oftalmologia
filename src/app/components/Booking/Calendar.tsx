/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarProps {
  onDateSelect: (date: string) => void
  selectedDate: string
}

export default function Calendar({ onDateSelect, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  const startDay = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthName = firstDayOfMonth.toLocaleString('pt', {
    month: 'long',
    year: 'numeric',
  })

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const isWeekend = (day: number): boolean => {
    const date = new Date(year, month, day)
    const dow = date.getDay()
    return dow === 0 || dow === 6
  }

  const isToday = (day: number): boolean => {
    const date = new Date(year, month, day)
    return date.toDateString() === today.toDateString()
  }

  const isPast = (day: number): boolean => {
    const date = new Date(year, month, day)
    date.setHours(23, 59, 59, 999)
    return date < today
  }

  const isSelected = (day: number): boolean => {
    const date = new Date(year, month, day)
    return date.toISOString().split('T')[0] === selectedDate
  }

  const formatDate = (day: number): string => {
    const date = new Date(year, month, day)
    return date.toISOString().split('T')[0]
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
    setHoveredDay(null)
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
    setHoveredDay(null)
  }

  const handleDayClick = (day: number) => {
    if (isPast(day) || isWeekend(day)) return
    onDateSelect(formatDate(day))
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      {/* Month Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="rounded-xl p-2 text-text-tertiary transition-all duration-200 hover:bg-surface-secondary hover:text-text-primary"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold capitalize text-text-primary">
          {monthName}
        </h3>
        <button
          onClick={handleNextMonth}
          className="rounded-xl p-2 text-text-tertiary transition-all duration-200 hover:bg-surface-secondary hover:text-text-primary"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day Names */}
      <div className="mb-2 grid grid-cols-7">
        {dayNames.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-text-tertiary"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7">
        {/* Empty cells for days before first of month */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-start-${i}`} className="aspect-square" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const disabled = isPast(day) || isWeekend(day)
          const selected = isSelected(day)
          const todayClass = isToday(day)
          const isHovered = hoveredDay === day

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => !disabled && setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              disabled={disabled}
              className={`
                group relative aspect-square transition-all duration-200
                ${disabled 
                  ? 'cursor-not-allowed' 
                  : 'cursor-pointer'
                }
              `}
            >
              {/* Hover background */}
              {!disabled && !selected && (
                <span
                  className={`
                    absolute inset-1 rounded-full transition-all duration-200
                    ${isHovered 
                      ? 'bg-primary-50 scale-100' 
                      : 'bg-transparent scale-75'
                    }
                  `}
                />
              )}

              {/* Selected background */}
              {selected && (
                <span className="absolute inset-1 rounded-full bg-primary shadow-md shadow-primary/20" />
              )}

              {/* Today ring */}
              {todayClass && !selected && (
                <span className="absolute inset-1 rounded-full border-2 border-primary" />
              )}

              {/* Day number */}
              <span
                className={`
                  relative z-10 text-sm font-medium transition-colors duration-200
                  ${disabled 
                    ? 'text-text-tertiary/40' 
                    : selected
                      ? 'text-white'
                      : isHovered
                        ? 'text-primary'
                        : todayClass
                          ? 'text-primary'
                          : 'text-text-secondary'
                  }
                `}
              >
                {day}
              </span>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex items-center gap-5 border-t border-border pt-4">
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <div className="h-3 w-3 rounded-full bg-primary shadow-sm shadow-primary/20" />
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <div className="h-3 w-3 rounded-full border-2 border-primary" />
          <span>Hoje</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <div className="h-3 w-3 rounded-full bg-surface-tertiary" />
          <span>Indisponível</span>
        </div>
      </div>
    </div>
  )
}