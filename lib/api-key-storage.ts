'use client'

/**
 * Client-side storage for LLM provider API keys.
 * Keys are stored in localStorage with basic obfuscation.
 * WARNING: localStorage is not fully secure. Use HTTPS and be aware that
 * extensions or scripts on the same origin can read these values.
 */

export type ProviderId = 'openai' | 'anthropic' | 'google'

const STORAGE_PREFIX = 'clg_apikey_'

/**
 * Simple obfuscation using base64 encoding with a fixed prefix.
 * This is not cryptographic security — it just prevents casual inspection.
 */
function obfuscate(value: string): string {
  return btoa(encodeURIComponent(`clg:${value}`))
}

function deobfuscate(value: string): string {
  try {
    const decoded = decodeURIComponent(atob(value))
    if (decoded.startsWith('clg:')) {
      return decoded.slice(4)
    }
    return decoded
  } catch {
    return ''
  }
}

export function saveApiKey(provider: ProviderId, key: string): void {
  if (typeof window === 'undefined') return
  if (!key.trim()) {
    removeApiKey(provider)
    return
  }
  localStorage.setItem(`${STORAGE_PREFIX}${provider}`, obfuscate(key.trim()))
}

export function getApiKey(provider: ProviderId): string {
  if (typeof window === 'undefined') return ''
  const stored = localStorage.getItem(`${STORAGE_PREFIX}${provider}`)
  if (!stored) return ''
  return deobfuscate(stored)
}

export function removeApiKey(provider: ProviderId): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(`${STORAGE_PREFIX}${provider}`)
}

export function removeAllApiKeys(): void {
  if (typeof window === 'undefined') return
  const providers: ProviderId[] = ['openai', 'anthropic', 'google']
  providers.forEach((p) => removeApiKey(p))
}

export function getAllApiKeys(): Record<ProviderId, string> {
  return {
    openai: getApiKey('openai'),
    anthropic: getApiKey('anthropic'),
    google: getApiKey('google'),
  }
}

export function hasApiKey(provider: ProviderId): boolean {
  return getApiKey(provider).length > 0
}

/**
 * Build request headers including any stored user API keys.
 * These are forwarded to Next.js API routes so the server can use them
 * in place of (or in addition to) environment-variable keys.
 */
export function buildApiKeyHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  const openai = getApiKey('openai')
  const anthropic = getApiKey('anthropic')
  const google = getApiKey('google')
  if (openai) headers['x-openai-key'] = openai
  if (anthropic) headers['x-anthropic-key'] = anthropic
  if (google) headers['x-google-key'] = google
  return headers
}
