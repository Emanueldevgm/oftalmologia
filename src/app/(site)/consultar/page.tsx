'use client'

import { useState } from 'react'
import { Eye, ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen bg-surface py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-primary hover:underline">
            Início
          </Link>
          <span className="mx-2 text-outline">/</span>
          <span className="text-sm text-on-surface-variant">
            Consultar Marcações
          </span>
        </div>

        <div className="mx-auto max-w-3xl">
          {!isLoggedIn ? (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/20">
                  <Eye size={32} className="text-primary" />
                </div>
                <h1 className="mb-2 text-3xl font-bold text-on-surface">
                  Consultar Marcações
                </h1>
                <p className="text-on-surface-variant">
                  Aceda às suas consultas marcadas usando o seu BI e a senha de
                  4 dígitos enviada por email.
                </p>
              </div>

              <LoginForm onLoginSuccess={handleLoginSuccess} />
            </>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-on-surface">
                    Minhas Consultas
                  </h1>
                  <p className="text-on-surface-variant">
                    Bem-vindo, {pacienteData?.nome}!
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full border-2 border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
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