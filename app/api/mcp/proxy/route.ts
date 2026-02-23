import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getMCPClient } from '@/lib/mcp-client'

/**
 * MCP Proxy Route
 *
 * Provides a unified endpoint for all MCP tool calls from the web UI.
 * This proxy handles:
 * - Authentication via Clerk
 * - MCP client connection management
 * - Tool routing to the MCP server
 * - Error handling and response formatting
 *
 * The MCP server has been refactored to use HTTP bridge with tools only
 * available via MCP protocol at the /mcp endpoint.
 */

export interface MCPProxyRequest {
  tool: string
  params: any
}

export interface MCPProxyResponse {
  success: boolean
  result?: any
  error?: string
  tool?: string
  cost?: number
  tokensUsed?: number
}

/**
 * POST /api/mcp/proxy
 *
 * Call any MCP tool through the proxy
 */
export async function POST(req: NextRequest): Promise<NextResponse<MCPProxyResponse>> {
  const startTime = Date.now()
  let toolName = 'unknown'

  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      console.error('[MCP Proxy] Unauthorized request')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: MCPProxyRequest = await req.json()
    toolName = body.tool || 'unknown'

    console.log(`[MCP Proxy] ========================================`)
    console.log(`[MCP Proxy] Received request for tool: ${toolName}`)
    console.log(`[MCP Proxy] Params:`, JSON.stringify(body.params, null, 2))

    if (!body.tool) {
      console.error('[MCP Proxy] Missing tool name in request')
      return NextResponse.json(
        { success: false, error: 'Tool name is required' },
        { status: 400 }
      )
    }

    // Initialize MCP client
    const serverUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3002/mcp'
    console.log(`[MCP Proxy] Initializing MCP client with server: ${serverUrl}`)

    const mcpClient = getMCPClient({
      serverUrl,
    })

    // Connect if not connected
    if (!mcpClient.isConnected()) {
      console.log('[MCP Proxy] MCP client not connected, connecting...')
      await mcpClient.connect()
      console.log('[MCP Proxy] MCP client connected successfully')
    } else {
      console.log('[MCP Proxy] MCP client already connected')
    }

    let result: any

    // Route to appropriate MCP tool
    // Note: The MCP client methods handle the actual MCP protocol communication
    console.log(`[MCP Proxy] Routing to tool handler: ${body.tool}`)
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

      case 'generate_step_content':
        result = await mcpClient.generateStepContent(
          body.params.stepNumber,
          body.params.title,
          body.params.tasks
        )
        break

      case 'generate_tests_content':
        result = await mcpClient.generateTestsContent(
          body.params.stepNumber,
          body.params.title,
          body.params.tasks
        )
        break

      case 'generate_solution_content':
        result = await mcpClient.generateSolutionContent(
          body.params.stepNumber,
          body.params.title,
          body.params.tasks
        )
        break

      case 'run_tests':
        result = await mcpClient.runTests(body.params.stepNumber, body.params.tags)
        break

      case 'list_tools':
        result = await mcpClient.listTools()
        break

      default:
        console.error(`[MCP Proxy] Unknown tool requested: ${body.tool}`)
        return NextResponse.json(
          {
            success: false,
            error: `Unknown tool: ${body.tool}`,
          },
          { status: 400 }
        )
    }

    const duration = Date.now() - startTime
    console.log(`[MCP Proxy] Tool ${toolName} executed successfully in ${duration}ms`)
    console.log(`[MCP Proxy] Result type:`, typeof result, Array.isArray(result) ? '(array)' : '')
    console.log(`[MCP Proxy] Result preview:`, JSON.stringify(result).substring(0, 200))

    return NextResponse.json({
      success: true,
      result,
      tool: body.tool,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[MCP Proxy] ========================================`)
    console.error(`[MCP Proxy] Error executing tool ${toolName} after ${duration}ms`)
    console.error(`[MCP Proxy] Error type:`, error?.constructor?.name)
    console.error(`[MCP Proxy] Error message:`, error instanceof Error ? error.message : error)
    console.error(`[MCP Proxy] Full error:`, error)
    console.error(`[MCP Proxy] Stack trace:`, error instanceof Error ? error.stack : 'N/A')

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

/**
 * GET /api/mcp/proxy
 *
 * Test MCP connection and list available tools
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', connected: false },
        { status: 401 }
      )
    }

    const mcpClient = getMCPClient({
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3002/mcp',
    })

    const isConnected = await mcpClient.testConnection()

    if (!isConnected) {
      return NextResponse.json({
        connected: false,
        serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL,
        error: 'Failed to connect to MCP server',
      })
    }

    // Get available tools
    await mcpClient.connect()
    const tools = await mcpClient.listTools()

    return NextResponse.json({
      connected: true,
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL,
      tools,
      toolCount: tools.length,
    })
  } catch (error) {
    console.error('MCP connection test error:', error)

    return NextResponse.json(
      {
        connected: false,
        serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL,
        error: error instanceof Error ? error.message : 'Connection test failed',
      },
      { status: 500 }
    )
  }
}
