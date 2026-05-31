import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import Logo from '@/app/components/Shared/Logo'

const PHONE_NUMBER = '+244 934 567 890'
const EMAIL_OFTALMOLOGIA = 'oftalmologia@hgu.gov.ao'
const HOSPITAL_ADDRESS = 'Bairro Popular, Uíge, Angola'

const FOOTER_LINKS = [
  { href: '/agendar', label: 'Agendar Consulta' },
  { href: '/consultar', label: 'Consultar Marcação' },
  { href: '/cancelar', label: 'Cancelar' },
  { href: '/admin/login', label: '.' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-white">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          
          {/* Brand */}
          <div className="space-y-4">
            <Logo className="inline-flex items-center gap-2.5" />
            <p className="max-w-xs text-sm leading-relaxed text-text-tertiary">
              Serviço de Oftalmologia do Hospital Geral do Uíge. 
              Cuidando da sua visão com tecnologia e dedicação.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">
              Links Rápidos
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-tertiary transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">
              Contactos
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-text-tertiary">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary/60" />
                <span>{HOSPITAL_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-tertiary">
                <Phone size={16} className="shrink-0 text-primary/60" />
                <span>{PHONE_NUMBER}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-tertiary">
                <Mail size={16} className="shrink-0 text-primary/60" />
                <span>{EMAIL_OFTALMOLOGIA}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-tertiary">
                <Clock size={16} className="shrink-0 text-primary/60" />
                <span>Seg-Sex: 08h00 - 16h00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-6 md:flex-row">
          <p className="text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} Hospital Geral do Uíge — Serviço de Oftalmologia.
          </p>
          <p className="text-xs text-text-tertiary">
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
