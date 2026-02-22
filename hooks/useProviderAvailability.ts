'use client'

import { useQuery } from '@tanstack/react-query'

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

  const providers: ProviderInfo[] = data?.providers || [
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

  const availableProviders = providers.filter(p => p.available)
  const firstAvailable = availableProviders[0]?.id
  const defaultProvider: ProviderId =
    firstAvailable === 'anthropic' ||
    firstAvailable === 'openai' ||
    firstAvailable === 'google' ||
    firstAvailable === 'template'
      ? firstAvailable
      : 'template'

  return {
    providers,
    isLoading,
    error: error instanceof Error ? error.message : null,
    availableProviders,
    defaultProvider,
  }
}
