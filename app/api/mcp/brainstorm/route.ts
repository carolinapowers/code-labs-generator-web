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

    // Initialize MCP client
    const mcpClient = getMCPClient({
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3001',
      demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
    })

    // Connect if not connected
    if (!mcpClient.isConnected()) {
      await mcpClient.connect()
    }

    // Call brainstorm tool
    const content = await mcpClient.brainstormLabOpportunity(validatedData)

    // Calculate estimated cost (rough estimate based on content length)
    const estimatedTokens = Math.ceil(content.length / 4) // Rough token estimate
    const costPerToken = 0.00003 // Example rate
    const estimatedCost = estimatedTokens * costPerToken

    return NextResponse.json({
      success: true,
      content,
      cost: estimatedCost,
      tokensUsed: estimatedTokens,
      mode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'demo' : 'live'
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
