'use client'

import { usePathname } from 'next/navigation'
import Header from '@/app/components/Layout/Header'
import Footer from '@/app/components/Layout/Footer'
import ScrollToTop from '@/app/components/ScrollToTop'
import Aoscompo from '@/utils/aos'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() ?? '/'
  const isAdmin = pathname.startsWith('/admin')
  const hideFooterPaths = ['/agendar', '/consultar', '/cancelar']
  const showFooter = !hideFooterPaths.includes(pathname)

  if (isAdmin) {
    return (
      <>
        {children}
        <ScrollToTop />
      </>
    )
  }

  return (
    <Aoscompo>
      <Header />
      <main>{children}</main>
      {showFooter && <Footer />}
      <ScrollToTop />
    </Aoscompo>
  )
}