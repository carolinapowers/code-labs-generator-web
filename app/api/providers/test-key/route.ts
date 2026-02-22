import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

type ProviderId = 'openai' | 'anthropic' | 'google'

interface TestKeyRequest {
  provider: ProviderId
  apiKey: string
}

/**
 * Validates an API key by making a minimal request to the provider's API.
 * Returns { valid: boolean, message: string }
 */
export async function POST(req: NextRequest) {
  try {
    const isTestingMode = process.env.TESTING_MODE === 'true'
    if (!isTestingMode) {
      const { userId } = await auth()
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body: TestKeyRequest = await req.json()
    const { provider, apiKey } = body

    if (!provider || !apiKey) {
      return NextResponse.json(
        { valid: false, message: 'provider and apiKey are required' },
        { status: 400 }
      )
    }

    // Basic format validation before attempting a live test
    const formatErrors = validateKeyFormat(provider, apiKey)
    if (formatErrors) {
      return NextResponse.json({ valid: false, message: formatErrors })
    }

    // Attempt a minimal live API call to verify the key is active
    const result = await testKeyWithProvider(provider, apiKey)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Test key error:', error)
    return NextResponse.json(
      { valid: false, message: 'Failed to test API key' },
      { status: 500 }
    )
  }
}

function validateKeyFormat(provider: ProviderId, apiKey: string): string | null {
  switch (provider) {
    case 'anthropic':
      if (!apiKey.startsWith('sk-ant-')) return 'Anthropic keys should start with sk-ant-'
      break
    case 'openai':
      if (!apiKey.startsWith('sk-')) return 'OpenAI keys should start with sk-'
      break
    case 'google':
      if (!apiKey.startsWith('AIza')) return 'Google API keys should start with AIza'
      break
    default:
      return 'Unknown provider'
  }
  return null
}

async function testKeyWithProvider(
  provider: ProviderId,
  apiKey: string
): Promise<{ valid: boolean; message: string }> {
  try {
    switch (provider) {
      case 'anthropic': {
        const res = await fetch('https://api.anthropic.com/v1/models', {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
        })
        if (res.status === 200) return { valid: true, message: 'Anthropic API key is valid' }
        if (res.status === 401) return { valid: false, message: 'Invalid Anthropic API key' }
        return { valid: false, message: `Anthropic API returned status ${res.status}` }
      }

      case 'openai': {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
        if (res.status === 200) return { valid: true, message: 'OpenAI API key is valid' }
        if (res.status === 401) return { valid: false, message: 'Invalid OpenAI API key' }
        return { valid: false, message: `OpenAI API returned status ${res.status}` }
      }

      case 'google': {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        )
        if (res.status === 200) return { valid: true, message: 'Google API key is valid' }
        if (res.status === 400 || res.status === 403)
          return { valid: false, message: 'Invalid Google API key' }
        return { valid: false, message: `Google API returned status ${res.status}` }
      }

      default:
        return { valid: false, message: 'Unknown provider' }
    }
  } catch {
    return { valid: false, message: 'Could not reach provider API — check your network connection' }
  }
}
