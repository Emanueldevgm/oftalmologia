'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { mainNavigation } from '@/config/navigation'
import Logo from '@/app/components/Shared/Logo'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname() ?? '/' 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl border-b border-border/10 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <Logo
              className="flex items-center gap-2.5 group"
              imageClassName="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
              labelClassName={`text-lg font-bold tracking-tight transition-colors duration-700 ${
                scrolled ? 'text-text-primary' : 'text-white'
              }`}
              accentClassName={`transition-colors duration-700 ${
                scrolled ? 'text-primary' : 'text-blue-300'
              }`}
            />

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {mainNavigation.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    scrolled
                      ? 'text-blue-700 hover:text-blue-800'
                      : 'text-blue-200 hover:text-blue-100'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-colors duration-700 ${
                        scrolled ? 'bg-blue-700' : 'bg-blue-400'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/agendar"
                className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-500 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Agendar Consulta</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 transition-opacity duration-500 hover:opacity-100" />
              </Link>

              <Link
                href="/cancelar"
                className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-500 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Cancelar Consulta</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 transition-opacity duration-500 hover:opacity-100" />
              </Link>



            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`rounded-xl p-2 transition-colors md:hidden ${
                scrolled
                  ? 'text-text-secondary hover:text-primary hover:bg-surface-secondary'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-x-0 top-16 z-40 backdrop-blur-2xl border-b md:hidden ${
              scrolled
                ? 'bg-white/95 border-border/10'
                : 'bg-[#0A1628]/95 border-white/[0.06]'
            }`}
          >
            <nav className="container flex flex-col gap-1 py-4">
              {mainNavigation.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    scrolled
                      ? 'text-blue-700 hover:bg-surface-secondary hover:text-blue-800'
                      : 'text-blue-200 hover:bg-white/[0.04] hover:text-blue-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className={`mt-3 space-y-3 border-t pt-4 ${
                scrolled ? 'border-border' : 'border-white/[0.06]'
              }`}>
                <Link
                  href="/cancelar"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25"
                >
                  Cancelar Consulta
                </Link>
                <Link
                  href="/agendar"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25"
                >
                  Agendar Consulta
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
