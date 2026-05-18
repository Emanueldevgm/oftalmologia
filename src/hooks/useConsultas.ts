'use client'

import { useState, useCallback } from 'react'

interface Medico {
  nome: string
  crm: string
}

interface Consulta {
  id: string
  data_hora: string
  status: string
  motivo: string | null
  qr_code: string | null
  criado_em: string
  medicos: Medico | null
}

interface UseConsultasReturn {
  consultas: Consulta[]
  loading: boolean
  error: string | null
  fetchConsultas: (bi: string, senha: string) => Promise<void>
  cancelarConsulta: (id: string, bi: string, senha: string) => Promise<{ success: boolean; error?: string }>
}

export function useConsultas(): UseConsultasReturn {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConsultas = useCallback(async (bi: string, senha: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/patient/consultas?bi=${bi}&senha=${senha}`)
      const data = await response.json()

      if (data.consultas) {
        setConsultas(data.consultas)
      } else {
        setError(data.error || 'Erro ao carregar consultas')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }, [])

  const cancelarConsulta = useCallback(
    async (id: string, bi: string, senha: string) => {
      try {
        const response = await fetch(`/api/appointments/${id}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bi, senha }),
        })

        const data = await response.json()

        if (data.success) {
          // Atualizar lista local
          setConsultas((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: 'cancelada' } : c))
          )
          return { success: true }
        }

        return { success: false, error: data.error || 'Erro ao cancelar' }
      } catch {
        return { success: false, error: 'Erro de conexão' }
      }
    },
    []
  )

  return {
    consultas,
    loading,
    error,
    fetchConsultas,
    cancelarConsulta,
  }
}