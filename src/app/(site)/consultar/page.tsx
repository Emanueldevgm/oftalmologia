/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { Eye, ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'
import LoginForm from '@/app/components/Patient/LoginForm'
import ConsultasList from '@/app/components/Patient/ConsultasList'

interface PacienteData {
  bi: string
  nome: string
}

export default function ConsultarPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pacienteData, setPacienteData] = useState<PacienteData | null>(null)
  const [bi, setBi] = useState('')
  const [senha, setSenha] = useState('')

  const handleLoginSuccess = (data: PacienteData, biValue: string, senhaValue: string) => {
    setPacienteData(data)
    setBi(biValue)
    setSenha(senhaValue)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setPacienteData(null)
    setBi('')
    setSenha('')
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
            Consultar Marcações
          </span>
        </div>

        <div className="mx-auto max-w-2xl">
          {!isLoggedIn ? (
            <>
              {/* Header */}
              <div className="mb-10 text-center">
                <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 shadow-sm">
                  <Search size={28} className="text-primary" />
                </div>
                <h1 className="mb-3 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
                  Consultar Marcações
                </h1>
                <p className="mx-auto max-w-md text-text-secondary">
                  Aceda às suas consultas marcadas usando o seu BI e a senha de
                  4 dígitos enviada por email.
                </p>
              </div>

              <LoginForm onLoginSuccess={handleLoginSuccess} />
            </>
          ) : (
            <>
              {/* Header logado */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary">
                    Minhas Consultas
                  </h1>
                  <p className="mt-1 text-text-secondary">
                    Bem-vindo, {pacienteData?.nome}!
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
                >
                  <ArrowLeft size={16} />
                  Sair
                </button>
              </div>

              <ConsultasList bi={bi} senha={senha} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}