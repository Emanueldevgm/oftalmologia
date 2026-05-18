'use client'

import { useState, useEffect, useCallback } from 'react'

interface Slot {
  hora_inicio: string
  hora_fim: string
  disponivel: boolean
  medico_id: string
  medico_nome: string
  bloqueado_ate: string | null
}

interface SlotsResponse {
  data: string
  turno: string
  total_slots: number
  slots_disponiveis: number
  percentual_encaixe: number
  slots: Slot[]
}

interface UseSlotsReturn {
  slots: Slot[]
  slotsAgrupados: Record<string, Slot[]>
  totalSlots: number
  disponiveis: number
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useSlots(date: string, turno: 'manha' | 'tarde'): UseSlotsReturn {
  const [data, setData] = useState<SlotsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSlots = useCallback(async () => {
    if (!date) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/public/slots?data=${date}&turno=${turno}`)
      const result = await response.json()

      if (result.slots) {
        setData(result)
      } else {
        setError(result.error || 'Erro ao carregar horários')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }, [date, turno])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  // Agrupar slots por médico
  const slotsAgrupados = data?.slots.reduce(
    (acc, slot) => {
      const nome = slot.medico_nome || 'Sem médico'
      if (!acc[nome]) acc[nome] = []
      acc[nome].push(slot)
      return acc
    },
    {} as Record<string, Slot[]>
  ) || {}

  return {
    slots: data?.slots || [],
    slotsAgrupados,
    totalSlots: data?.total_slots || 0,
    disponiveis: data?.slots_disponiveis || 0,
    loading,
    error,
    refresh: fetchSlots,
  }
}