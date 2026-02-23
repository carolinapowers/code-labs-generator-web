import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getMCPClient } from '@/lib/mcp-client'

const generateStepSchema = z.object({
  stepNumber: z.number().int().min(2).max(20),
  title: z.string().min(5).max(200),
  tasks: z.array(z.string().min(3).max(200)).min(1).max(10),
})

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = generateStepSchema.parse(body)

    // Initialize MCP client
    const mcpClient = getMCPClient({
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3002/mcp',
    })

    // Connect if not connected
    if (!mcpClient.isConnected()) {
      await mcpClient.connect()
    }

    // Call the new web-optimized MCP tool
    const result = await mcpClient.generateStepContent(
      data.stepNumber,
      data.title,
      data.tasks
    )

    // Parse the MCP response
    // MCP tools return: { content: [{ type: 'text', text: JSON.stringify({filename, content, language}) }] }
    const responseText = result.content?.[0]?.text || result
    const parsedData = typeof responseText === 'string' ? JSON.parse(responseText) : responseText

    return NextResponse.json({
      success: true,
      file: {
        filename: parsedData.filename,
        content: parsedData.content,
        language: parsedData.language,
      },
    })
  } catch (error) {
    console.error('Generate step error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Check for MCP server connection errors
      if (error.message.includes('not connected') || error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          {
            error: 'MCP server not running',
            details: 'Please ensure the MCP server is running on port 3002 with /mcp endpoint',
          },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate step content' },
      { status: 500 }
    )
  }
}
