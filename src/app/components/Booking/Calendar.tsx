/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarProps {
  onDateSelect: (date: string) => void
  selectedDate: string
}

export default function Calendar({ onDateSelect, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availableDays, setAvailableDays] = useState<Set<string>>(new Set())

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
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const handleDayClick = (day: number) => {
    if (isPast(day) || isWeekend(day)) return
    onDateSelect(formatDate(day))
  }

  return (
    <div className="rounded-xl border border-outline-variant bg-white p-6">
      {/* Month Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
        <button
          onClick={handleNextMonth}
          className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day Names */}
      <div className="mb-2 grid grid-cols-7">
        {dayNames.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-xs font-medium text-on-surface-variant"
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

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-full text-sm font-medium transition-all
                ${disabled ? 'cursor-not-allowed text-outline-variant' : 'cursor-pointer hover:bg-primary-container/20'}
                ${selected ? 'bg-primary text-white hover:bg-primary-container' : ''}
                ${todayClass && !selected ? 'border-2 border-primary text-primary' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full border-2 border-primary" />
          <span>Hoje</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-outline-variant" />
          <span>Indisponível</span>
        </div>
      </div>
    </div>
  )
}