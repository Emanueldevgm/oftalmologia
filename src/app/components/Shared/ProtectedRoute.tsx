'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldAlert } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const adminData = localStorage.getItem('adminUser')
        
        if (!adminData) {
          router.replace('/admin/login')
          return
        }

        const admin = JSON.parse(adminData)
        
        if (!admin.id || !admin.email) {
          localStorage.removeItem('adminUser')
          router.replace('/admin/login')
          return
        }

        setIsAuthorized(true)
      } catch {
        localStorage.removeItem('adminUser')
        router.replace('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <Loader2 size={40} className="mx-auto animate-spin text-primary" />
          <p className="mt-4 text-sm text-on-surface-variant">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <ShieldAlert size={48} className="mx-auto text-error" />
          <p className="mt-4 text-lg font-medium text-on-surface">Acesso negado</p>
          <p className="mt-2 text-sm text-on-surface-variant">Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}