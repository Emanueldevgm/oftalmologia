'use client'

import { useState } from 'react'
import { X, AlertTriangle, Loader2 } from 'lucide-react'

interface CancelModalProps {
  isOpen: boolean
  onClose: () => void
  consultaId: string
  bi: string
  senha: string
  onSuccess: () => void
}

export default function CancelModal({
  isOpen,
  onClose,
  consultaId,
  bi,
  senha,
  onSuccess,
}: CancelModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmText, setConfirmText] = useState('')

  if (!isOpen) return null

  const handleCancel = async () => {
    if (confirmText !== 'CANCELAR') return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `/api/appointments/${consultaId}/cancel`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bi, senha }),
        }
      )

      const data = await response.json()

      if (data.success) {
        onSuccess()
      } else {
        setError(data.error || 'Erro ao cancelar consulta')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle size={24} />
            <h3 className="text-lg font-semibold">Cancelar Consulta</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-outline hover:bg-surface-container"
          >
            <X size={20} />
          </button>
        </div>

        {/* Warning */}
        <div className="mb-4 rounded-xl bg-warning/10 border border-warning/30 p-4">
          <p className="text-sm text-on-surface">
            Tem certeza que deseja cancelar esta consulta? Esta ação não pode
            ser desfeita.
          </p>
          <p className="mt-2 text-sm font-medium text-error">
            ⚠️ Cancelamentos com menos de 24h de antecedência serão
            registados como falta.
          </p>
        </div>

        {/* Confirmation input */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-on-surface">
            Digite <strong>CANCELAR</strong> para confirmar:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="CANCELAR"
            className="w-full rounded-xl border border-outline-variant px-4 py-2 text-center font-bold text-on-surface outline-none focus:ring-2 focus:ring-error"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-error-container/20 p-3">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border-2 border-outline-variant px-4 py-2 text-sm font-medium text-on-surface-variant transition hover:bg-surface-container"
          >
            Manter Consulta
          </button>
          <button
            onClick={handleCancel}
            disabled={loading || confirmText !== 'CANCELAR'}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-error px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              'Cancelar Consulta'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}