'use client'

import { useState, useEffect } from 'react'
import { Clock, User, AlertCircle } from 'lucide-react'

interface Slot {
  hora_inicio: string
  hora_fim: string
  disponivel: boolean
  medico_id: string
  medico_nome: string
  bloqueado_ate: string | null
}

interface SlotSelectorProps {
  date: string
  turno: 'manha' | 'tarde'
  onSlotSelect: (slot: {
    medicoId: string
    medicoNome: string
    data: string
    horaInicio: string
    horaFim: string
  }) => void
}

export default function SlotSelector({
  date,
  turno,
  onSlotSelect,
}: SlotSelectorProps) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSlots() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `/api/public/slots?data=${date}&turno=${turno}`
        )
        const data = await response.json()

        if (data.slots) {
          setSlots(data.slots)
        } else {
          setError(data.error || 'Erro ao carregar horários')
        }
      } catch {
        setError('Erro ao carregar horários')
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [date, turno])

  const handleSlotClick = (slot: Slot) => {
    if (!slot.disponivel) return

    const slotKey = `${slot.medico_id}-${slot.hora_inicio}`
    setSelectedSlot(slotKey)

    onSlotSelect({
      medicoId: slot.medico_id,
      medicoNome: slot.medico_nome,
      data: date,
      horaInicio: slot.hora_inicio,
      horaFim: slot.hora_fim,
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-surface-tertiary"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
        <AlertCircle size={24} className="mx-auto mb-2 text-red-500" />
        <p className="text-sm font-medium text-red-700">{error}</p>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary">
          <Clock size={28} className="text-text-tertiary" />
        </div>
        <p className="text-sm font-medium text-text-secondary">
          Nenhum horário disponível para esta data.
        </p>
        <p className="mt-1 text-xs text-text-tertiary">
          Tente outro dia ou turno.
        </p>
      </div>
    )
  }

  // Group slots by doctor
  const grouped = slots.reduce(
    (acc, slot) => {
      if (!acc[slot.medico_nome]) {
        acc[slot.medico_nome] = []
      }
      acc[slot.medico_nome].push(slot)
      return acc
    },
    {} as Record<string, Slot[]>
  )

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([medicoNome, medicosSlots]) => (
        <div key={medicoNome}>
          {/* Doctor Header */}
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <User size={16} className="text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">
              {medicoNome}
            </h3>
            <span className="text-xs text-text-tertiary">
              {medicosSlots.filter(s => s.disponivel).length} vagas
            </span>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {medicosSlots.map((slot) => {
              const slotKey = `${slot.medico_id}-${slot.hora_inicio}`
              const isSelected = selectedSlot === slotKey

              return (
                <button
                  key={slotKey}
                  onClick={() => handleSlotClick(slot)}
                  disabled={!slot.disponivel}
                  className={`
                    group relative rounded-xl px-3 py-3 text-center transition-all duration-200
                    ${
                      slot.disponivel
                        ? isSelected
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                          : 'border-2 border-blue-100 bg-blue-50/50 text-primary hover:border-primary hover:bg-blue-50 hover:shadow-sm hover:scale-[1.01]'
                        : 'cursor-not-allowed border border-border bg-surface-secondary text-text-tertiary/50 line-through'
                    }
                  `}
                >
                  <span className={`text-sm font-semibold ${slot.disponivel ? '' : 'opacity-50'}`}>
                    {slot.hora_inicio}
                  </span>
                  <span className={`mt-0.5 block text-xs ${slot.disponivel && !isSelected ? 'text-blue-500/70' : ''} ${isSelected ? 'text-blue-100' : ''} ${!slot.disponivel ? 'opacity-40' : ''}`}>
                    às {slot.hora_fim}
                  </span>

                  {/* Selected check indicator */}
                  {isSelected && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}