/**
 * MCP API Helpers
 *
 * Shared utilities for MCP API routes to reduce duplication and ensure consistency
 */

import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getMCPClient } from '@/lib/mcp-client'

/**
 * Standard MCP API response format
 */
export interface StandardMCPResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    tool?: string
    cost?: number
    tokensUsed?: number
    duration?: number
  }
}

/**
 * MCP tool configuration
 */
export interface MCPToolConfig<TInput = unknown, TOutput = unknown> {
  toolName: string
  schema: z.ZodSchema<TInput>
  extractParams: (data: TInput) => Record<string, unknown>
  formatResponse: (result: unknown) => TOutput
}

/**
 * Generic handler for MCP tool calls
 * Handles auth, validation, connection, and error formatting
 */
export async function handleMCPToolCall<TInput = unknown, TOutput = unknown>(
  req: NextRequest,
  config: MCPToolConfig<TInput, TOutput>
): Promise<NextResponse<StandardMCPResponse<TOutput>>> {
  const startTime = Date.now()

  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json<StandardMCPResponse<TOutput>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = config.schema.parse(body)

    // Initialize MCP client
    const mcpClient = getMCPClient({
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3002/mcp',
    })

    // Connect if not connected
    if (!mcpClient.isConnected()) {
      await mcpClient.connect()
    }

    // Extract params for the specific tool
    const params = config.extractParams(validatedData)

    // Call the MCP tool via transport
    const mcpMethod = mcpClient[config.toolName as keyof typeof mcpClient] as any
    const result = await mcpMethod.apply(mcpClient, Object.values(params))

    // Format response consistently
    const formattedData = config.formatResponse(result)

    const duration = Date.now() - startTime

    return NextResponse.json<StandardMCPResponse<TOutput>>({
      success: true,
      data: formattedData,
      meta: {
        tool: config.toolName,
        duration,
      },
    })
  } catch (error) {
    const duration = Date.now() - startTime

    console.error(`[MCP API] Tool call failed (${config.toolName}):`, error)

    if (error instanceof z.ZodError) {
      return NextResponse.json<StandardMCPResponse<TOutput>>(
        {
          success: false,
          error: 'Validation error',
          data: { details: error.issues } as any,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Check for MCP server connection errors
      if (error.message.includes('not connected') || error.message.includes('ECONNREFUSED')) {
        return NextResponse.json<StandardMCPResponse<TOutput>>(
          {
            success: false,
            error: 'MCP server not running. Please ensure the server is running on port 3002.',
          },
          { status: 503 }
        )
      }

      return NextResponse.json<StandardMCPResponse<TOutput>>(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json<StandardMCPResponse<TOutput>>(
      { success: false, error: `Failed to execute ${config.toolName}` },
      { status: 500 }
    )
  }
}

/**
 * Parse MCP response format
 * Handles various MCP response formats and extracts the actual data
 */
export function parseMCPResponse(result: unknown): unknown {
  // Handle array format: [{ type: "text", text: "..." }]
  if (Array.isArray(result) && result.length > 0) {
    const firstItem = result[0] as any
    const textContent = firstItem.text || firstItem.content

    // Try to parse as JSON if it's a string
    if (typeof textContent === 'string') {
      try {
        return JSON.parse(textContent)
      } catch {
        return textContent
      }
    }

    return textContent
  }

  // Handle object with content property
  if (result && typeof result === 'object' && 'content' in result) {
    const resultObj = result as Record<string, any>
    if (Array.isArray(resultObj.content) && resultObj.content.length > 0) {
      return parseMCPResponse(resultObj.content)
    }
    return resultObj.content
  }

  // Already in expected format
  return result
}

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove potentially dangerous characters
    .replace(/[<>]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
}

/**
 * Sanitize array of strings
 */
export function sanitizeInputArray(inputs: string[]): string[] {
  return inputs.map(sanitizeInput).filter(s => s.length > 0)
}
