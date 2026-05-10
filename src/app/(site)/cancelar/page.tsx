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
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from 'lucide-react'

// Componente interno que usa useSearchParams
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
      // Primeiro buscar consulta pelo token para obter o ID
      const searchResponse = await fetch(
        `/api/appointments?token=${token}`
      )
      
      // Como não temos endpoint de busca por token, vamos direto para o cancelamento
      // O token está no link do email, mas precisamos do ID da consulta
      // Vamos usar o endpoint de cancelamento que aceita token
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
      // Primeiro buscar consultas do paciente
      const consultasResponse = await fetch(
        `/api/patient/consultas?bi=${bi.toUpperCase().trim()}&senha=${senha}`
      )
      const consultasData = await consultasResponse.json()

      if (!consultasData.consultas || consultasData.consultas.length === 0) {
        setError('Nenhuma consulta ativa encontrada para este BI')
        setLoading(false)
        return
      }

      // Pegar a primeira consulta confirmada
      const consultaAtiva = consultasData.consultas.find(
        (c: { status: string }) => c.status === 'confirmada'
      )

      if (!consultaAtiva) {
        setError('Nenhuma consulta ativa para cancelar')
        setLoading(false)
        return
      }

      // Cancelar a consulta
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
      <div className="min-h-screen bg-surface py-8 md:py-12">
        <div className="container">
          <div className="mx-auto max-w-lg text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-on-surface">
              Consulta Cancelada
            </h1>
            <p className="mb-6 text-on-surface-variant">
              Sua consulta foi cancelada com sucesso.
            </p>

            {consultaInfo && (
              <div className="mb-6 rounded-xl bg-surface-container p-4 text-left">
                <p className="text-sm text-on-surface-variant">
                  <strong>Data:</strong> {consultaInfo.data}
                </p>
                <p className="text-sm text-on-surface-variant">
                  <strong>Hora:</strong> {consultaInfo.hora}
                </p>
                <p className="text-sm text-on-surface-variant">
                  <strong>Médico:</strong> {consultaInfo.medico}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/agendar"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-container"
              >
                Marcar Nova Consulta
              </Link>
              <Link
                href="/"
                className="rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
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
    <div className="min-h-screen bg-surface py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-primary hover:underline">
            Início
          </Link>
          <span className="mx-2 text-outline">/</span>
          <span className="text-sm text-on-surface-variant">
            Cancelar Consulta
          </span>
        </div>

        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
              <XCircle size={32} className="text-error" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-on-surface">
              Cancelar Consulta
            </h1>
            <p className="text-on-surface-variant">
              Cancele sua consulta usando o link recebido por email ou o seu BI
              + senha de acesso.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex rounded-full bg-surface-container p-1">
            <button
              onClick={() => setActiveTab('token')}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'token'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Search size={16} className="mr-1 inline" />
              Pelo Token
            </button>
            <button
              onClick={() => setActiveTab('bisenha')}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'bisenha'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Lock size={16} className="mr-1 inline" />
              BI + Senha
            </button>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-outline-variant bg-white p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'token' ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-on-surface">
                    Token de Cancelamento
                  </label>
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                    />
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Cole o token do email"
                      className="w-full rounded-xl border border-outline-variant py-3 pl-10 pr-4 text-sm text-on-surface outline-none transition focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-on-surface-variant">
                    Encontre o token no link de cancelamento enviado por email
                    após a marcação.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-on-surface">
                      Número do BI
                    </label>
                    <div className="relative">
                      <FileText
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                      />
                      <input
                        type="text"
                        value={bi}
                        onChange={(e) => setBi(e.target.value.toUpperCase())}
                        placeholder="001234567LA000"
                        maxLength={14}
                        className="w-full rounded-xl border border-outline-variant py-3 pl-10 pr-4 text-sm text-on-surface outline-none transition focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-on-surface">
                      Senha de Acesso (4 dígitos)
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                      />
                      <input
                        type="password"
                        value={senha}
                        onChange={(e) =>
                          setSenha(e.target.value.replace(/\D/g, '').slice(0, 4))
                        }
                        placeholder="4829"
                        maxLength={4}
                        className="w-full rounded-xl border border-outline-variant py-3 pl-10 pr-4 text-center text-2xl tracking-[8px] text-on-surface outline-none transition focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-error-container/20 p-3">
                  <AlertTriangle size={18} className="text-error" />
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-error px-6 py-3 text-base font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
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
            <p className="text-sm text-on-surface-variant">
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
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 size={40} className="animate-spin text-primary" />
        </div>
      }
    >
      <CancelarContent />
    </Suspense>
  )
}