import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check which API keys are configured
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY
    const hasGoogleKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY

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
