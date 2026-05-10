// ============================================
// Utilitários de Hash e Tokens
// ============================================

import crypto from 'crypto'
import bcrypt from 'bcryptjs'

/**
 * Gera senha numérica de 4 dígitos (RN02)
 */
export function generateAccessPassword(): string {
  const digits = '0123456789'
  let password = ''
  for (let i = 0; i < 4; i++) {
    password += digits[Math.floor(Math.random() * digits.length)]
  }
  return password
}

/**
 * Hash da senha com bcrypt (12 rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

/**
 * Verifica senha contra hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Gera token único de cancelamento (RN11)
 */
export function generateCancelToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Sanitiza string contra XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}