import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getMCPClient } from '@/lib/mcp-client'

export interface MCPProxyRequest {
  tool: string
  params: any
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: MCPProxyRequest = await req.json()

    if (!body.tool) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 })
    }

    // Initialize MCP client
    const mcpClient = getMCPClient({
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3002/mcp',
    })

    // Connect if not connected
    if (!mcpClient.isConnected()) {
      await mcpClient.connect()
    }

    let result: any

    // Route to appropriate tool based on tool name
    switch (body.tool) {
      case 'brainstorm_lab_opportunity':
        result = await mcpClient.brainstormLabOpportunity(body.params)
        break

      case 'scaffold_react_project':
        result = await mcpClient.scaffoldReactProject(body.params)
        break

      case 'scaffold_csharp_project':
        result = await mcpClient.scaffoldCSharpProject(body.params)
        break

      case 'scaffold_go_project':
        result = await mcpClient.scaffoldGoProject(body.params)
        break

      case 'create_step':
        result = await mcpClient.createStep(body.params)
        break

      case 'run_tests':
        result = await mcpClient.runTests(body.params.stepNumber, body.params.tags)
        break

      case 'list_tools':
        result = await mcpClient.listTools()
        break

      default:
        return NextResponse.json(
          { error: `Unknown tool: ${body.tool}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      result,
      tool: body.tool,
    })
  } catch (error) {
    console.error('MCP proxy error:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

// Test connection endpoint
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mcpClient = getMCPClient({
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3002/mcp',
    })

    const isConnected = await mcpClient.testConnection()
    const tools = isConnected ? await mcpClient.listTools() : []

    return NextResponse.json({
      connected: isConnected,
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL,
      tools,
    })
  } catch (error) {
    console.error('MCP connection test error:', error)

    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
      },
      { status: 500 }
    )
  }
}