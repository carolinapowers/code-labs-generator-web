import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { brainstormSchema } from '@/lib/validators'
import { getMCPClient } from '@/lib/mcp-client'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = brainstormSchema.parse(body)

    // Extract provider from validated data
    const { provider = 'template', ...brainstormData } = validatedData

    // Pick up any user-provided API keys forwarded from the client
    const userAnthropicKey = req.headers.get('x-anthropic-key') || undefined
    const userOpenAIKey = req.headers.get('x-openai-key') || undefined
    const userGoogleKey = req.headers.get('x-google-key') || undefined

    // Resolve the active API key for the chosen provider
    const resolvedApiKey =
      provider === 'anthropic'
        ? userAnthropicKey || process.env.ANTHROPIC_API_KEY
        : provider === 'openai'
        ? userOpenAIKey || process.env.OPENAI_API_KEY
        : provider === 'google'
        ? userGoogleKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY
        : undefined

    // Initialize MCP client
    const mcpClient = getMCPClient({
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3002/mcp',
    })

    // Connect if not connected
    if (!mcpClient.isConnected()) {
      await mcpClient.connect()
    }

    // Call brainstorm tool with provider and resolved API key
    const result = await mcpClient.brainstormLabOpportunity({
      ...brainstormData,
      provider,
      ...(resolvedApiKey ? { apiKey: resolvedApiKey } : {}),
    })

    // Extract content from MCP response format
    // MCP returns: [{ type: "text", text: "..." }]
    let content: string
    if (typeof result === 'string') {
      content = result
    } else if (Array.isArray(result) && result.length > 0 && result[0].text) {
      content = result[0].text
    } else if (result.content) {
      content = result.content
    } else {
      console.warn('Unexpected MCP brainstorm response format:', result)
      throw new Error('Unexpected MCP response format from brainstormLabOpportunity')
    }

    const actualCost = result.cost || 0
    const actualTokens = result.tokensUsed || 0

    // If no actual cost/tokens from server, estimate for template mode
    const finalCost = actualCost || (provider === 'template' ? 0 : Math.ceil(content.length / 4) * 0.00003)
    const finalTokens = actualTokens || (provider === 'template' ? 0 : Math.ceil(content.length / 4))

    return NextResponse.json({
      success: true,
      content,
      cost: finalCost,
      tokensUsed: finalTokens,
      provider,
      mode: provider === 'template' ? 'template' : 'llm'
    })

  } catch (error) {
    console.error('Brainstorm API error:', error)

    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
        success: false
      }, { status: 400 })
    }

    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false
    }, { status: 500 })
  }
}
