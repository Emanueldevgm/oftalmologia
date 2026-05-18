import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que NÃO precisam de proteção
const PUBLIC_ROUTES = [
  '/',
  '/agendar',
  '/consultar',
  '/cancelar',
  '/api/public',
  '/api/appointments',
  '/api/patient',
]

// Rotas que SEMPRE redirecionam para /admin/dashboard se já autenticado
const AUTH_ROUTES = ['/admin/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é rota admin
  const isAdminRoute = pathname.startsWith('/admin')
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith('/api')
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/images')

  // Não interferir em arquivos estáticos
  if (isStaticFile) return NextResponse.next()

  // Não interferir em APIs públicas
  if (isApiRoute && isPublicRoute) return NextResponse.next()

  // Verificar cookie de autenticação admin
  const adminCookie = request.cookies.get('admin_session')

  // Se está na rota de login mas já tem sessão
  if (isAuthRoute && adminCookie) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Se é rota admin mas NÃO tem sessão
  if (isAdminRoute && !isAuthRoute && !adminCookie) {
    // Permitir acesso à API de login
    if (pathname === '/api/admin/login') return NextResponse.next()
    
    // Redirecionar para login
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}