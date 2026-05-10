import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RootLayoutClient from './RootLayoutClient'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'HGU Oftalmologia | Hospital Geral do Uíge',
    template: '%s | HGU Oftalmologia',
  },
  description:
    'Marque sua consulta de Oftalmologia no Hospital Geral do Uíge. Atendimento gratuito e especializado em saúde ocular.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-AO" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-on-surface antialiased">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}