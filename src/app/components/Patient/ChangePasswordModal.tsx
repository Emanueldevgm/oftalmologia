// src/app/components/Patient/ChangePasswordModal.tsx
'use client'

import { useState } from 'react'
import { Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  bi: string
  senhaAtual: string
  onPasswordChanged: (novaSenha: string) => void
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  bi,
  senhaAtual,
  onPasswordChanged,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (currentPassword !== senhaAtual) {
      setError('Senha atual incorreta')
      return
    }

    if (newPassword.length !== 4 || !/^\d{4}$/.test(newPassword)) {
      setError('A nova senha deve ter exatamente 4 dígitos numéricos')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (newPassword === senhaAtual) {
      setError('A nova senha deve ser diferente da senha atual')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/patient/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bi,
          senhaAtual: currentPassword,
          novaSenha: newPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          onPasswordChanged(newPassword)
          resetForm()
        }, 1500)
      } else {
        setError(data.error || 'Erro ao alterar senha')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {success ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"
              >
                <CheckCircle2 size={32} className="text-emerald-600" />
              </motion.div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Senha alterada!</h3>
              <p className="text-sm text-text-secondary">
                Sua nova senha de acesso foi definida com sucesso.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                  <Lock size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Alterar Senha</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Digite sua senha atual"
                      maxLength={4}
                      className="w-full rounded-xl border border-border py-2.5 pl-10 pr-10 text-center text-lg tracking-[6px] text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary">
                    Nova Senha (4 dígitos)
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Nova senha de 4 dígitos"
                      maxLength={4}
                      className="w-full rounded-xl border border-border py-2.5 pl-10 pr-10 text-center text-lg tracking-[6px] text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Repita a nova senha"
                      maxLength={4}
                      className="w-full rounded-xl border border-border py-2.5 pl-10 pr-10 text-center text-lg tracking-[6px] text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || currentPassword.length < 4 || newPassword.length < 4 || confirmPassword.length < 4}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}