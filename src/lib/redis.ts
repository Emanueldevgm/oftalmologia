// ============================================
// Conexão Redis via Upstash REST API
// ============================================

import { Redis } from '@upstash/redis'

const redisUrl = process.env.REDIS_URL || ''
const redisToken = process.env.REDIS_TOKEN || ''

if (!redisUrl || !redisToken) {
  console.error('❌ Redis: URL ou Token não configurados')
}

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
})

// Teste de conexão
redis.ping().then(() => {
  console.log('🟢 Redis conectado via REST API')
}).catch((err: Error) => {
  console.error('❌ Redis: Erro de conexão -', err.message)
})