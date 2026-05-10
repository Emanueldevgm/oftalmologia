import Link from 'next/link'
import { Eye } from 'lucide-react'

const LINKS_UTEIS = [
  { href: '/agendar', label: 'Agendar Consulta' },
  { href: '/consultar', label: 'Consultar Marcação' },
  { href: '/cancelar', label: 'Cancelar Consulta' },
  { href: '/admin/login', label: 'Painel Administrativo' },
]

export default function Header() {
  return (
    <header className="bg-surface shadow-sm">
      <div className="container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-container">
              HGU Oftalmologia
            </p>
            <p className="text-xs text-on-surface-variant">
              Hospital Geral do Uíge
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-on-surface">
          {LINKS_UTEIS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-on-surface transition-colors duration-200 hover:bg-primary hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}