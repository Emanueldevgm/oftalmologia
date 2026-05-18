/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  XCircle,
  FileText,
  Lock,
  Search,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from 'lucide-react'

function CancelarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tokenFromUrl = searchParams.get('token') || ''

  const [activeTab, setActiveTab] = useState<'token' | 'bisenha'>(
    tokenFromUrl ? 'token' : 'bisenha'
  )
  const [token, setToken] = useState(tokenFromUrl)
  const [bi, setBi] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [consultaInfo, setConsultaInfo] = useState<{
    data: string
    hora: string
    medico: string
  } | null>(null)

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      setActiveTab('token')
    }
  }, [tokenFromUrl])

  const handleTokenCancel = async () => {
    if (!token) {
      setError('Token de cancelamento é obrigatório')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/appointments/cancel-by-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (data.success) {
        setConsultaInfo({
          data: data.consulta?.data || 'Data não disponível',
          hora: data.consulta?.hora || 'Hora não disponível',
          medico: data.consulta?.medico || 'Médico não disponível',
        })
        setSuccess(true)
      } else {
        setError(data.error || 'Token inválido ou consulta já cancelada')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleBiSenhaCancel = async () => {
    if (!bi || !senha) {
      setError('BI e senha são obrigatórios')
      return
    }

    if (bi.length < 14) {
      setError('Formato de BI inválido')
      return
    }

    if (senha.length < 4) {
      setError('Senha deve ter 4 dígitos')
      return
    }

    setLoading(true)
    setError('')

    try {
      const consultasResponse = await fetch(
        `/api/patient/consultas?bi=${bi.toUpperCase().trim()}&senha=${senha}`
      )
      const consultasData = await consultasResponse.json()

      if (!consultasData.consultas || consultasData.consultas.length === 0) {
        setError('Nenhuma consulta ativa encontrada para este BI')
        setLoading(false)
        return
      }

      const consultaAtiva = consultasData.consultas.find(
        (c: { status: string }) => c.status === 'confirmada'
      )

      if (!consultaAtiva) {
        setError('Nenhuma consulta ativa para cancelar')
        setLoading(false)
        return
      }

      const cancelResponse = await fetch(
        `/api/appointments/${consultaAtiva.id}/cancel`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bi: bi.toUpperCase().trim(),
            senha,
          }),
        }
      )

      const cancelData = await cancelResponse.json()

      if (cancelData.success) {
        setConsultaInfo({
          data: new Date(consultaAtiva.data_hora).toLocaleDateString('pt', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          hora: new Date(consultaAtiva.data_hora).toLocaleTimeString('pt', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          medico: consultaAtiva.medicos?.nome || 'Não informado',
        })
        setSuccess(true)
      } else {
        setError(cancelData.error || 'Erro ao cancelar consulta')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 'token') {
      handleTokenCancel()
    } else {
      handleBiSenhaCancel()
    }
  }

  // Tela de sucesso
  if (success) {
    return (
      <div className="min-h-screen bg-surface-secondary pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/" className="text-sm text-primary hover:underline">
              Início
            </Link>
            <span className="mx-2 text-text-tertiary">/</span>
            <span className="text-sm text-text-secondary">Cancelar Consulta</span>
          </div>

          <div className="mx-auto max-w-lg text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 shadow-sm">
              <CheckCircle size={40} className="text-emerald-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-text-primary">
              Consulta Cancelada
            </h1>
            <p className="mb-8 text-text-secondary">
              Sua consulta foi cancelada com sucesso.
            </p>

            {consultaInfo && (
              <div className="mb-8 rounded-2xl border border-border bg-white p-5 text-left shadow-sm">
                <div className="space-y-2 text-sm">
                  <p className="text-text-secondary">
                    <strong className="text-text-primary">Data:</strong> {consultaInfo.data}
                  </p>
                  <p className="text-text-secondary">
                    <strong className="text-text-primary">Hora:</strong> {consultaInfo.hora}
                  </p>
                  <p className="text-text-secondary">
                    <strong className="text-text-primary">Médico:</strong> {consultaInfo.medico}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/agendar"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01]"
              >
                Marcar Nova Consulta
              </Link>
              <Link
                href="/"
                className="rounded-xl border-2 border-border px-6 py-3 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-secondary pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-primary hover:underline">
            Início
          </Link>
          <span className="mx-2 text-text-tertiary">/</span>
          <span className="text-sm text-text-secondary">
            Cancelar Consulta
          </span>
        </div>

        <div className="mx-auto max-w-lg">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 shadow-sm">
              <XCircle size={28} className="text-red-600" />
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
              Cancelar Consulta
            </h1>
            <p className="mx-auto max-w-md text-text-secondary">
              Cancele sua consulta usando o link recebido por email ou o seu BI
              + senha de acesso.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex rounded-xl bg-surface-tertiary p-1">
            <button
              onClick={() => setActiveTab('token')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === 'token'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Search size={16} />
              Pelo Token
            </button>
            <button
              onClick={() => setActiveTab('bisenha')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === 'bisenha'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Lock size={16} />
              BI + Senha
            </button>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {activeTab === 'token' ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    Token de Cancelamento
                  </label>
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                    />
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Cole o token do email"
                      className="w-full rounded-xl border border-border py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-text-tertiary">
                    Encontre o token no link de cancelamento enviado por email
                    após a marcação.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">
                      Número do BI
                    </label>
                    <div className="relative">
                      <FileText
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                      />
                      <input
                        type="text"
                        value={bi}
                        onChange={(e) => setBi(e.target.value.toUpperCase())}
                        placeholder="001234567LA000"
                        maxLength={14}
                        className="w-full rounded-xl border border-border py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">
                      Senha de Acesso (4 dígitos)
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                      />
                      <input
                        type="password"
                        value={senha}
                        onChange={(e) =>
                          setSenha(e.target.value.replace(/\D/g, '').slice(0, 4))
                        }
                        placeholder="4829"
                        maxLength={4}
                        className="w-full rounded-xl border border-border py-3 pl-10 pr-4 text-center text-2xl tracking-[8px] text-text-primary placeholder:text-text-tertiary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
                  <AlertTriangle size={18} className="text-red-600 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30 hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  <>
                    <XCircle size={20} />
                    Cancelar Consulta
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Ajuda */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-tertiary">
              Perdeu sua senha?{' '}
              <Link
                href="/agendar"
                className="font-medium text-primary hover:underline"
              >
                Faça uma nova marcação
              </Link>{' '}
              para receber uma nova senha.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal com Suspense
export default function CancelarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-secondary">
          <Loader2 size={40} className="animate-spin text-primary" />
        </div>
      }
    >
      <CancelarContent />
    </Suspense>
  )
}