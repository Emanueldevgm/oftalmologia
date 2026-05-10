import { NextResponse } from 'next/server'

export async function GET() {
  // Verificar se as variáveis de ambiente existem
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return NextResponse.json({
    hasUrl: !!url,
    hasAnonKey: !!anonKey,
    hasServiceKey: !!serviceKey,
    urlPreview: url ? `${url.substring(0, 20)}...` : 'MISSING',
    environment: process.env.NODE_ENV,
  })
}