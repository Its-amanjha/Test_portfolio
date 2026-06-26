import crypto from 'crypto'

/**
 * Hash a password using PBKDF2 SHA-512 with a random 16-byte salt.
 * Returns the hash formatted as `salt:hash`.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verify a password against a stored `salt:hash` string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false
  const parts = storedHash.split(':')
  if (parts.length !== 2) return false
  const [salt, hash] = parts
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === checkHash
}
