'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface AdminUser {
  id: string
  email: string
  funcao: string
}

interface UseAuthReturn {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar sessão ao montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem('adminUser')
      if (stored) {
        const admin = JSON.parse(stored) as AdminUser
        setUser(admin)
      }
    } catch {
      localStorage.removeItem('adminUser')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Login
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (data.success && data.admin) {
          const adminUser: AdminUser = {
            id: data.admin.id,
            email: data.admin.email,
            funcao: data.admin.funcao,
          }
          localStorage.setItem('adminUser', JSON.stringify(adminUser))
          setUser(adminUser)
          return { success: true }
        }

        return { success: false, error: data.error || 'Credenciais inválidas' }
      } catch {
        return { success: false, error: 'Erro de conexão' }
      }
    },
    []
  )

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('adminUser')
    setUser(null)
    router.push('/admin/login')
  }, [router])

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }
}