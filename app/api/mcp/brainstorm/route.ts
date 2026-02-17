import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { brainstormSchema } from '@/lib/validators'
import { getMCPClient } from '@/lib/mcp-client'

export async function POST(req: NextRequest) {
  try {
    // Check authentication (skip in demo mode for testing)
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    if (!isDemoMode) {
      const { userId } = await auth()
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = brainstormSchema.parse(body)

    // Extract provider from validated data
    const { provider = 'template', ...brainstormData } = validatedData

    // Initialize MCP client
    const mcpClient = getMCPClient({
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3002',
      demoMode: false, // Always use real MCP server now
    })

    // Connect if not connected
    if (!mcpClient.isConnected()) {
      await mcpClient.connect()
    }

    // Call brainstorm tool with provider
    const result = await mcpClient.brainstormLabOpportunity({
      ...brainstormData,
      provider
    })

    // Extract content, cost, and tokens from result
    const content = typeof result === 'string' ? result : result.content
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
