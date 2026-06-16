import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RootLayoutClient from './RootLayoutClient'
import { SEO_CONFIG } from '@/config/site'
import { AgentChat } from './components/AgentChat/AgentChat'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: SEO_CONFIG.titleTemplate,
  },
  description: SEO_CONFIG.description,
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-AO" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-on-surface antialiased">
        <RootLayoutClient>
             {children}
             <AgentChat />
        </RootLayoutClient>
      </body>
    </html>
  )
}