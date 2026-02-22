import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Check authentication (skip in testing mode)
    const isTestingMode = process.env.TESTING_MODE === 'true'
    if (!isTestingMode) {
      const { userId } = await auth()
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Check server-configured API keys (environment variables)
    const hasAnthropicEnvKey = !!process.env.ANTHROPIC_API_KEY
    const hasOpenAIEnvKey = !!process.env.OPENAI_API_KEY
    const hasGoogleEnvKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY

    // Also accept user-provided keys forwarded via request headers
    const userAnthropicKey = req.headers.get('x-anthropic-key') || ''
    const userOpenAIKey = req.headers.get('x-openai-key') || ''
    const userGoogleKey = req.headers.get('x-google-key') || ''

    const hasAnthropicKey = hasAnthropicEnvKey || !!userAnthropicKey
    const hasOpenAIKey = hasOpenAIEnvKey || !!userOpenAIKey
    const hasGoogleKey = hasGoogleEnvKey || !!userGoogleKey

    const providers = [
      {
        id: 'template',
        name: 'Template (Free)',
        description: 'Uses predefined template structure - no AI generation',
        available: true,
        requiresApiKey: false,
        isFree: true,
      },
      {
        id: 'anthropic',
        name: 'Claude (Best Quality)',
        description: 'Anthropic Claude Sonnet - highest quality output',
        available: hasAnthropicKey,
        requiresApiKey: true,
        isFree: false,
      },
      {
        id: 'openai',
        name: 'GPT-4 (Fast)',
        description: 'OpenAI GPT-4 - fast and reliable',
        available: hasOpenAIKey,
        requiresApiKey: true,
        isFree: false,
      },
      {
        id: 'google',
        name: 'Gemini (Economical)',
        description: 'Google Gemini - cost-effective option',
        available: hasGoogleKey,
        requiresApiKey: true,
        isFree: false,
      },
    ]

    return NextResponse.json({
      providers,
      hasAnyLLM: hasAnthropicKey || hasOpenAIKey || hasGoogleKey,
    })
  } catch (error) {
    console.error('Provider availability check error:', error)
    return NextResponse.json(
      { error: 'Failed to check provider availability' },
      { status: 500 }
    )
  }
}
