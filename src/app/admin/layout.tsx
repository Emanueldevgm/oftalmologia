import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painel Admin | HGU Oftalmologia',
  description: 'Painel administrativo do Hospital Geral do Uíge - Oftalmologia',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface-secondary">
      {children}
    </div>
  )
}