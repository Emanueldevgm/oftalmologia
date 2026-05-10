// ============================================
// Rate Limiting
// RN23
// ============================================

import { redis } from '@/lib/redis'

interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number
}

/**
 * RN23 - Rate limit de 10 submissões/hora por IP
 */
export async function checkRateLimit(
  ip: string,
  limit: number = 10,
  windowSeconds: number = 3600
): Promise<RateLimitResult> {
  const key = `rate:${ip}`
  const current = await redis.incr(key)

  if (current === 1) {
    await redis.expire(key, windowSeconds)
  }

  const ttl = await redis.ttl(key)

  return {
    success: current <= limit,
    remaining: Math.max(0, limit - current),
    resetIn: ttl > 0 ? ttl : windowSeconds,
  }
}

/**
 * Incrementa tentativas falhas (para CAPTCHA)
 */
export async function incrementFailedAttempts(ip: string): Promise<number> {
  const key = `failed:${ip}`
  const count = await redis.incr(key)
  await redis.expire(key, 3600)
  return count
}

/**
 * Retorna número de tentativas falhas
 */
export async function getFailedAttempts(ip: string): Promise<number> {
  const key = `failed:${ip}`
  const count = await redis.get<number>(key)
  return count ?? 0
}