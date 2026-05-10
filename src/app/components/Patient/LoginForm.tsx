'use client'

import { useState } from 'react'
import { Lock, FileText, Eye, EyeOff, LogIn } from 'lucide-react'

interface LoginFormProps {
  onLoginSuccess: (
    data: { bi: string; nome: string },
    bi: string,
    senha: string
  ) => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [bi, setBi] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/patient/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bi: bi.toUpperCase().trim(),
          senha,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onLoginSuccess(
          { bi: data.paciente.bi, nome: data.paciente.nome },
          bi.toUpperCase().trim(),
          senha
        )
      } else {
        setError(data.error || 'BI ou senha incorretos')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-outline-variant bg-white p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* BI */}
        <div>
          <label
            htmlFor="bi"
            className="mb-2 block text-sm font-medium text-on-surface"
          >
            Número do Bilhete de Identidade (BI)
          </label>
          <div className="relative">
            <FileText
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            />
            <input
              id="bi"
              type="text"
              value={bi}
              onChange={(e) => setBi(e.target.value.toUpperCase())}
              placeholder="Ex: 001234567LA000"
              maxLength={14}
              className="w-full rounded-xl border border-outline-variant py-3 pl-10 pr-4 text-on-surface outline-none transition focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            Formato: 9 dígitos + 2 letras + 3 dígitos
          </p>
        </div>

        {/* Senha */}
        <div>
          <label
            htmlFor="senha"
            className="mb-2 block text-sm font-medium text-on-surface"
          >
            Senha de acesso (4 dígitos)
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            />
            <input
              id="senha"
              type={showSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value.replace(/\D/g, '').slice(0, 4))
              }
              placeholder="Ex: 4829"
              maxLength={4}
              className="w-full rounded-xl border border-outline-variant py-3 pl-10 pr-12 text-center text-2xl tracking-[8px] text-on-surface outline-none transition focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant"
            >
              {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            Senha de 4 dígitos enviada por email após marcar a consulta.
          </p>
        </div>

        {/* Erro */}
        {error && (
          <div className="rounded-xl bg-error-container/20 border border-error/20 p-3">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || bi.length < 14 || senha.length < 4}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-white transition hover:bg-primary-container disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              A entrar...
            </>
          ) : (
            <>
              <LogIn size={20} />
              Consultar Marcações
            </>
          )}
        </button>
      </form>

      {/* Ajuda */}
      <div className="mt-6 border-t border-outline-variant pt-4 text-center">
        <p className="text-sm text-on-surface-variant">
          Não tem senha?{' '}
          <Link href="/agendar" className="font-medium text-primary hover:underline">
            Faça uma nova marcação
          </Link>{' '}
          para receber uma nova senha.
        </p>
      </div>
    </div>
  )
}

// Import adicional necessário
import Link from 'next/link'