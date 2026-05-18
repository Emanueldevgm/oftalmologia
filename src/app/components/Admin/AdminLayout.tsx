'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/app/components/Shared/Logo'
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
  Shield,
  Bell,
  Search,
  ChevronRight,
  Clock,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  read: boolean
  timestamp: string
}

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [adminFuncao, setAdminFuncao] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifLoading, setNotifLoading] = useState(false)

  // Buscar notificações reais da API
  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true)
    try {
      const res = await fetch('/api/admin/notifications')
      const data = await res.json()
      if (data.notificacoes) {
        // Preservar estado "read" localmente, se já existir
        setNotifications(prev => {
          const prevMap = new Map(prev.map(n => [n.id, n.read]))
          return data.notificacoes.map((n: Notification) => ({
            ...n,
            read: prevMap.get(n.id) || false,
          }))
        })
      }
    } catch (err) {
      console.error('Erro ao buscar notificações:', err)
    } finally {
      setNotifLoading(false)
    }
  }, [])

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auth check
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
        setAdminFuncao(admin.funcao || 'SUPER_ADMIN')
      } catch {
        localStorage.removeItem('adminUser')
        router.replace('/admin/login')
      }
    }
  }, [pathname, router])

  // Buscar notificações ao montar e a cada 2 minutos
  useEffect(() => {
    if (pathname !== '/admin/login') {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 120000) // 2 min
      return () => clearInterval(interval)
    }
  }, [pathname, fetchNotifications])

  const handleLogout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    localStorage.removeItem('adminUser')
    router.replace('/admin/login')
  }, [router])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `${diffMins}m atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    return `${diffDays}d atrás`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-emerald-500" />
      case 'warning':
        return <AlertCircle size={18} className="text-amber-500" />
      case 'error':
        return <AlertCircle size={18} className="text-red-500" />
      default:
        return <Bell size={18} className="text-blue-500" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const currentPage = MENU_ITEMS.find(item => pathname === item.href)?.label || 'Painel Admin'
  const today = new Date().toLocaleDateString('pt', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex min-h-screen bg-surface-secondary">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform border-r border-white/[0.06] bg-[#0A1628] transition-all duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'w-20 lg:w-20' : 'w-72 lg:w-72'}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
            <Logo
              href="/admin/dashboard"
              className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}
              imageClassName="h-9 w-auto flex-shrink-0"
              showLabel={!sidebarCollapsed}
              labelClassName="text-sm font-bold text-white"
              title="HGU Admin"
              accentText=""
              showSubtitle={!sidebarCollapsed}
              subtitle="Oftalmologia"
              subtitleClassName="text-[10px] text-white/30"
            />
            <button
              onClick={() => setSidebarOpen(false)}
              className={`rounded-lg p-1 text-white/40 hover:bg-white/5 hover:text-white lg:hidden ${sidebarCollapsed ? 'hidden' : ''}`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    sidebarCollapsed ? 'justify-center px-2' : ''
                  } ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebar"
                      className={`absolute top-1/2 h-8 w-0.5 rounded-r-full bg-blue-400 -translate-y-1/2 ${
                        sidebarCollapsed ? '-right-1.5' : 'left-0'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon size={20} className={isActive ? 'text-blue-400' : 'text-white/40 group-hover:text-white/70'} />
                  {!sidebarCollapsed && (
                    <>
                      <span>{item.label}</span>
                      {isActive && (
                        <ChevronRight size={14} className="ml-auto text-blue-400" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-white/[0.06] p-4">
            <div className={`mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex-shrink-0">
                <Shield size={16} className="text-blue-400" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium text-white">{adminName}</p>
                  <p className="text-[10px] text-white/30">{adminFuncao}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              title={sidebarCollapsed ? 'Terminar Sessão' : undefined}
              className={`flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/40 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
            >
              <LogOut size={16} />
              {!sidebarCollapsed && 'Terminar Sessão'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header
          className={`sticky top-0 z-30 border-b transition-all duration-300 ${
            scrolled
              ? 'border-border/50 bg-white/80 backdrop-blur-xl shadow-sm'
              : 'border-transparent bg-white'
          }`}
        >
          <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
            {/* Mobile menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-text-secondary hover:bg-surface-secondary lg:hidden"
            >
              <Menu size={20} />
            </button>

            {/* Sidebar toggle - Desktop only */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden rounded-xl p-2 text-text-secondary transition-all duration-200 hover:bg-surface-secondary lg:flex items-center"
              title={sidebarCollapsed ? 'Expandir sidebar' : 'Retrair sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Page title */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-text-primary">{currentPage}</h1>
              <p className="text-xs text-text-tertiary capitalize">{today}</p>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search */}
            <div className={`hidden items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-300 md:flex ${
              searchFocused
                ? 'border-primary/30 bg-white ring-2 ring-primary/5 w-64'
                : 'border-border bg-surface-secondary w-48'
            }`}>
              <Search size={16} className="text-text-tertiary" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen)
                  if (!notificationsOpen) fetchNotifications() // atualiza ao abrir
                }}
                className="relative rounded-xl p-2 text-text-secondary transition hover:bg-surface-secondary"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Overlay */}
              <AnimatePresence>
                {notificationsOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                )}
              </AnimatePresence>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-96 max-h-[80vh] rounded-2xl border border-border bg-white shadow-xl z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="border-b border-border px-5 py-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-text-primary">Notificações</h3>
                        <p className="text-xs text-text-tertiary">
                          {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {notifLoading && (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        )}
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="rounded-lg p-1 text-text-tertiary hover:bg-surface-secondary"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto max-h-96 divide-y divide-border/50">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary">
                            <Bell size={20} className="text-text-tertiary" />
                          </div>
                          <p className="text-sm font-medium text-text-secondary">Sem notificações</p>
                          <p className="text-xs text-text-tertiary mt-1">Você está em dia</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`px-5 py-4 transition-colors hover:bg-surface-secondary/50 ${
                              !notification.read ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-medium text-text-primary text-sm">{notification.title}</p>
                                  {!notification.read && (
                                    <div className="flex h-2 w-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-text-secondary mt-1">{notification.message}</p>
                                <p className="text-[10px] text-text-tertiary mt-2">
                                  {formatTime(notification.timestamp)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 ml-8">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs px-2 py-1 rounded text-blue-600 hover:bg-blue-50 transition"
                                >
                                  Marcar como lido
                                </button>
                              )}
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="p-1 rounded text-text-tertiary hover:text-red-600 hover:bg-red-50 transition"
                                title="Remover"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Time */}
            <div className="hidden items-center gap-2 text-sm text-text-secondary lg:flex">
              <Clock size={16} />
              <span>{new Date().toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
