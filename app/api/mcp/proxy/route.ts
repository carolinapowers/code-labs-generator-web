import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getMCPClient } from '@/lib/mcp-client'
import { mcpLogger } from '@/lib/logger'

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
      mcpLogger.error(' Unauthorized request')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: MCPProxyRequest = await req.json()
    toolName = body.tool || 'unknown'

    mcpLogger.debug(` ========================================`)
    mcpLogger.debug(` Received request for tool: ${toolName}`)
    mcpLogger.debug(` Params:`, JSON.stringify(body.params, null, 2))

    if (!body.tool) {
      mcpLogger.error(' Missing tool name in request')
      return NextResponse.json(
        { success: false, error: 'Tool name is required' },
        { status: 400 }
      )
    }

    // Initialize MCP client
    const serverUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3002/mcp'
    mcpLogger.debug(` Initializing MCP client with server: ${serverUrl}`)

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
    mcpLogger.debug(` Routing to tool handler: ${body.tool}`)
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
        mcpLogger.error(` Unknown tool requested: ${body.tool}`)
        return NextResponse.json(
          {
            success: false,
            error: `Unknown tool: ${body.tool}`,
          },
          { status: 400 }
        )
    }

    const duration = Date.now() - startTime
    mcpLogger.debug(` Tool ${toolName} executed successfully in ${duration}ms`)
    mcpLogger.debug(` Result type:`, typeof result, Array.isArray(result) ? '(array)' : '')
    mcpLogger.debug(` Result preview:`, JSON.stringify(result).substring(0, 200))

    return NextResponse.json({
      success: true,
      result,
      tool: body.tool,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    mcpLogger.error(` ========================================`)
    mcpLogger.error(` Error executing tool ${toolName} after ${duration}ms`)
    mcpLogger.error(` Error type:`, error?.constructor?.name)
    mcpLogger.error(` Error message:`, error instanceof Error ? error.message : error)
    mcpLogger.error(` Full error:`, error)
    mcpLogger.error(` Stack trace:`, error instanceof Error ? error.stack : 'N/A')

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
    mcpLogger.error('MCP connection test error:', error)

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
