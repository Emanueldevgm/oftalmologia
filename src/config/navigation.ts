/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Home,
  Calendar,
  Search,
  XCircle,
  Shield,
  type LucideIcon,
} from 'lucide-react'

interface NavLink {
  href: string
  label: string
  icon?: LucideIcon
}

interface NavSection {
  title?: string
  links: NavLink[]
}

// Navegação principal (Header público)
export const mainNavigation: NavLink[] = [
  { href: '/', label: 'Início' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#servicos', label: 'Serviços' },
  { href: '/agendar', label: 'Agendar' },
  { href: '/consultar', label: 'Consultar' },
]

// Navegação do Footer
export const footerLinks: NavLink[] = [
  { href: '/agendar', label: 'Agendar Consulta' },
  { href: '/consultar', label: 'Consultar Marcação' },
  { href: '/cancelar', label: 'Cancelar Consulta' },
  { href: '/admin/login', label: 'Painel Administrativo' },
]

// Navegação do Admin (Sidebar)
export const adminNavigation: NavSection[] = [
  {
    links: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
      { href: '/admin/agenda', label: 'Agenda', icon: Calendar },
      { href: '/admin/medicos', label: 'Médicos', icon: Shield },
      { href: '/admin/pacientes', label: 'Pacientes', icon: Search },
      { href: '/admin/relatorios', label: 'Relatórios', icon: Calendar },
      { href: '/admin/configuracoes', label: 'Configurações', icon: Shield },
    ],
  },
]

// Breadcrumbs
export const breadcrumbMap: Record<string, string> = {
  '/agendar': 'Agendar Consulta',
  '/consultar': 'Consultar Marcações',
  '/cancelar': 'Cancelar Consulta',
  '/admin': 'Painel Admin',
  '/admin/dashboard': 'Dashboard',
  '/admin/agenda': 'Agenda',
  '/admin/medicos': 'Médicos',
  '/admin/pacientes': 'Pacientes',
  '/admin/relatorios': 'Relatórios',
  '/admin/configuracoes': 'Configurações',
}