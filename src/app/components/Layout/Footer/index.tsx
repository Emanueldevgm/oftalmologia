import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

const USEFUL_LINKS = [
  { href: '/agendar', label: 'Agendar Consulta' },
  { href: '/consultar', label: 'Consultar Marcação' },
  { href: '/cancelar', label: 'Cancelar Consulta' },
  { href: '/admin/login', label: 'Painel Administrativo' },
]

const SCHEDULE = [
  { days: 'Segunda - Sexta', hours: '08h00 - 16h00' },
  { days: 'Turno Manhã', hours: '08h00 - 12h00' },
  { days: 'Turno Tarde', hours: '13h30 - 16h00' },
  { days: 'Sábado', hours: 'Fechado' },
  { days: 'Domingo', hours: 'Fechado' },
]

const CONTACTS = [
  { icon: MapPin, value: 'Bairro Popular, Uíge, Angola' },
  { icon: Mail, value: 'oftalmologia@hgu.gov.ao' },
  { icon: Phone, value: '+244 934 567 890' },
]

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-white">
      <div className="container px-4 py-10 md:px-6 lg:py-16">
        {/* Newsletter */}
        <div className="mb-10 rounded-3xl border border-white/10 bg-inverse-surface/90 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-xl font-semibold text-white">HGU Oftalmologia</p>
            <p className="mt-2 text-sm text-white/70">
              Inscreva-se para receber novidades sobre o serviço de oftalmologia.
            </p>
          </div>
          <form className="mt-4 flex w-full flex-col gap-3 sm:mt-0 sm:w-auto sm:flex-row">
            <input
              type="email"
              placeholder="O seu email"
              className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 sm:w-64"
            />
            <button
              type="submit"
              className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary-container"
            >
              Inscrever
            </button>
          </form>
        </div>

        {/* Grid */}
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {/* Sobre */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-white">Sobre o HGU</p>
            <p className="text-sm text-white/70">
              O Hospital Geral do Uíge oferece atendimento oftalmológico
              gratuito e especializado para garantir a saúde ocular de toda a
              comunidade.
            </p>
          </div>

          {/* Links Úteis */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-white">Links Úteis</p>
            <ul className="space-y-3 text-sm text-white/70">
              {USEFUL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Horários */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-white">
              Horário de Funcionamento
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              {SCHEDULE.map((item) => (
                <li key={item.days} className="flex items-center gap-3">
                  <Clock size={18} className="shrink-0 text-secondary" />
                  <div>
                    <p className="font-medium text-white">{item.days}</p>
                    <p className="text-white/70">{item.hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contactos */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-white">Contactos</p>
            <ul className="space-y-3 text-sm text-white/70">
              {CONTACTS.map((item) => (
                <li key={item.value} className="flex items-center gap-3">
                  <item.icon size={18} className="shrink-0 text-secondary" />
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/60">
          &copy; {new Date().getFullYear()} Hospital Geral do Uíge. Todos os
          direitos reservados.
        </div>
      </div>
    </footer>
  )
}