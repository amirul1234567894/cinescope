/**
 * Security utilities for input validation and sanitization
 * Use these throughout the app to prevent XSS, SQL injection, and other attacks
 */

// Strip HTML tags and dangerous characters
export function sanitizeText(input: string, maxLength = 1000): string {
  if (!input || typeof input !== 'string') return ''

  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '')                      // Remove HTML tags
    .replace(/javascript:/gi, '')                 // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '')                   // Remove inline event handlers
    .trim()
    .slice(0, maxLength)
}

// Validate and sanitize username (alphanumeric + underscore only)
export function sanitizeUsername(input: string): string {
  if (!input) return ''
  return input.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20)
}

// Email validation
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Check password strength
export function checkPasswordStrength(password: string): {
  valid: boolean
  score: number
  feedback: string
} {
  if (!password || password.length < 8) {
    return { valid: false, score: 0, feedback: 'Password must be at least 8 characters' }
  }

  let score = 0
  const feedback: string[] = []

  if (password.length >= 12) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letter')
  if (!/[0-9]/.test(password)) feedback.push('Add number')
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add special character')

  return {
    valid: score >= 3,
    score,
    feedback: feedback.length > 0 ? feedback.join(', ') : 'Strong password!',
  }
}

// Validate URL is safe (only http/https, no javascript:)
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

// Detect SQL injection attempts (defense-in-depth, Supabase RLS is primary defense)
export function hasSqlInjectionPattern(input: string): boolean {
  if (!input || typeof input !== 'string') return false

  const patterns = [
    /(\bunion\b.*\bselect\b)/i,
    /(\bselect\b.*\bfrom\b.*\binformation_schema\b)/i,
    /(\bdrop\b\s+\btable\b)/i,
    /(\binsert\b\s+\binto\b.*\bvalues\b)/i,
    /(\bdelete\b\s+\bfrom\b)/i,
    /(\bupdate\b\s+.*\bset\b)/i,
    /(--|\#|\/\*).*$/,
  ]

  return patterns.some(p => p.test(input))
}

// Sanitize search query
export function sanitizeSearchQuery(query: string): string {
  if (!query) return ''

  return query
    .replace(/[<>'"\\]/g, '') // Remove special chars
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim()
    .slice(0, 200)
}

// Generate CSRF-like token
export function generateRandomToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

// Validate redirect URL (prevent open redirect attacks)
export function isSafeRedirect(url: string, allowedDomains: string[] = []): boolean {
  if (!url) return false

  // Allow only relative URLs or same-domain
  if (url.startsWith('/') && !url.startsWith('//')) return true

  try {
    const parsed = new URL(url)
    return allowedDomains.includes(parsed.hostname)
  } catch {
    return false
  }
}

// Mask sensitive data for logging
export function maskSensitive(value: string, visibleChars = 4): string {
  if (!value || value.length <= visibleChars * 2) return '***'
  return `${value.slice(0, visibleChars)}...${value.slice(-visibleChars)}`
}
