'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Eye,
  Shield,
} from 'lucide-react'

const MENU_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/agenda', label: 'Agenda', icon: Calendar },
  { href: '/admin/medicos', label: 'Médicos', icon: Stethoscope },
  { href: '/admin/pacientes', label: 'Pacientes', icon: Users },
  { href: '/admin/relatorios', label: 'Relatórios', icon: FileText },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [adminFuncao, setAdminFuncao] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('adminUser')
    
    if (!stored && pathname !== '/admin/login') {
      router.replace('/admin/login')
      return
    }

    if (stored) {
      try {
        const admin = JSON.parse(stored)
        setAdminName(admin.email || 'Admin')
        setAdminFuncao(admin.funcao || 'STAFF')
      } catch {
        localStorage.removeItem('adminUser')
        router.replace('/admin/login')
      }
    }
  }, [pathname, router])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminUser')
    router.replace('/admin/login')
  }, [router])

  const handleSiteClick = useCallback(() => {
    // Apenas vai para o site, sem perder a sessão admin
    window.open('/', '_blank')
  }, [])

  // Não mostrar sidebar na página de login
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-outline-variant transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-outline-variant px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Eye size={24} className="text-primary" />
            <span className="font-semibold text-on-surface">HGU Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-outline hover:bg-surface-container lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary-container/20 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer da Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-outline-variant p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-full bg-primary-container/20 p-1.5">
              <Shield size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-on-surface">{adminName}</p>
              <p className="text-xs text-on-surface-variant">{adminFuncao}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-error/10 px-3 py-2 text-sm font-medium text-error transition hover:bg-error/20"
            >
              <LogOut size={16} />
              Terminar Sessão
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-outline-variant bg-white px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-outline hover:bg-surface-container lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-on-surface">
              Painel Administrativo
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSiteClick}
              className="text-sm text-primary hover:underline"
            >
              Ver Site
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-error/10 px-4 py-2 text-sm font-medium text-error transition hover:bg-error/20 lg:hidden"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}