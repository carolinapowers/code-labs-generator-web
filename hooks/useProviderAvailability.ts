'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllApiKeys } from '@/lib/api-key-storage'

export type ProviderId = 'anthropic' | 'openai' | 'google' | 'template'

export interface ProviderInfo {
  id: ProviderId
  name: string
  description: string
  available: boolean
  requiresApiKey: boolean
  isFree: boolean
}

export interface ProviderAvailability {
  providers: ProviderInfo[]
  isLoading: boolean
  error: string | null
  availableProviders: ProviderInfo[]
  defaultProvider: ProviderId
}

export function useProviderAvailability(): ProviderAvailability {
  const {
    data,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['provider-availability'],
    queryFn: async () => {
      const response = await fetch('/api/providers/availability')
      if (!response.ok) {
        throw new Error('Failed to check provider availability')
      }
      return response.json()
    },
    staleTime: 60000, // Cache for 1 minute
    refetchOnWindowFocus: false,
  })

  const userKeys = getAllApiKeys()

  const defaultProviders: ProviderInfo[] = [
    {
      id: 'template',
      name: 'Template (Free)',
      description: 'Uses predefined template - always available',
      available: true,
      requiresApiKey: false,
      isFree: true,
    },
    {
      id: 'anthropic',
      name: 'Claude (Best Quality)',
      description: 'Anthropic Claude - requires API key',
      available: false,
      requiresApiKey: true,
      isFree: false,
    },
    {
      id: 'openai',
      name: 'GPT-4 (Fast)',
      description: 'OpenAI GPT-4 - requires API key',
      available: false,
      requiresApiKey: true,
      isFree: false,
    },
    {
      id: 'google',
      name: 'Gemini (Economical)',
      description: 'Google Gemini - requires API key',
      available: false,
      requiresApiKey: true,
      isFree: false,
    },
  ]

  const serverProviders: ProviderInfo[] = data?.providers || defaultProviders

  // Merge server availability with user-configured keys from localStorage.
  // If the user has stored a key for a provider, mark it as available even if
  // the server has no environment-variable key configured.
  const providers: ProviderInfo[] = serverProviders.map((p) => {
    if (p.id === 'template') return p
    const hasUserKey = !!userKeys[p.id as keyof typeof userKeys]
    return { ...p, available: p.available || hasUserKey }
  })

  const availableProviders = providers.filter(p => p.available)
  const defaultProvider: ProviderId = availableProviders[0]?.id ?? 'template'

  return {
    providers,
    isLoading,
    error: error instanceof Error ? error.message : null,
    availableProviders,
    defaultProvider,
  }
}

