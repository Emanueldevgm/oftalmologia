'use client'

import { useState, useEffect } from 'react'
import { Clock, User } from 'lucide-react'

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

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-surface-container"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-error/20 bg-error-container/20 p-4 text-center">
        <p className="text-sm text-error">{error}</p>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant bg-white p-8 text-center">
        <Clock size={48} className="mx-auto mb-3 text-outline-variant" />
        <p className="text-on-surface-variant">
          Nenhum horário disponível para esta data.
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
          <div className="mb-3 flex items-center gap-2">
            <User size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-on-surface">
              {medicoNome}
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {medicosSlots.map((slot) => (
              <button
                key={`${slot.medico_id}-${slot.hora_inicio}`}
                onClick={() =>
                  slot.disponivel &&
                  onSlotSelect({
                    medicoId: slot.medico_id,
                    medicoNome: slot.medico_nome,
                    data: date,
                    horaInicio: slot.hora_inicio,
                    horaFim: slot.hora_fim,
                  })
                }
                disabled={!slot.disponivel}
                className={`
                  rounded-lg px-3 py-2 text-center text-sm font-medium transition-all
                  ${
                    slot.disponivel
                      ? 'border-2 border-primary/30 bg-primary-fixed/20 text-primary hover:border-primary hover:bg-primary-fixed/40'
                      : 'cursor-not-allowed border border-outline-variant bg-surface-container text-outline-variant line-through'
                  }
                `}
              >
                <div>{slot.hora_inicio}</div>
                <div className="text-xs opacity-70">às {slot.hora_fim}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}