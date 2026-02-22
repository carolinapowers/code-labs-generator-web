/**
 * MCP Transport Layer
 * Handles HTTP communication with the MCP server
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'

export interface MCPTransportConfig {
  serverUrl: string
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
}

export interface MCPRequest {
  method: string
  params?: any
}

export interface MCPResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Custom HTTP Transport for MCP
 */
class HttpTransport implements Transport {
  private serverUrl: string
  private abortController: AbortController | null = null
  private timeout: number

  constructor(serverUrl: string, timeout: number = 180000) {
    this.serverUrl = serverUrl
    this.timeout = timeout
  }

  async start(): Promise<void> {
    // HTTP transport doesn't need persistent connection
    this.abortController = new AbortController()
  }

  async send(message: any): Promise<void> {
    if (!this.abortController) {
      throw new Error('Transport not started')
    }

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        this.abortController?.abort()
        reject(new Error(`Request timed out after ${this.timeout}ms`))
      }, this.timeout)
    })

    try {
      const fetchPromise = fetch(this.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
        },
        body: JSON.stringify(message),
        signal: this.abortController.signal,
      })

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Parse SSE response from MCP server
      // NOTE: This is a simplified SSE parser that only handles single-line 'data:' fields.
      // It does NOT support:
      // - Multi-line data fields (where multiple 'data:' lines should be concatenated)
      // - Other SSE fields like 'event:', 'id:', or 'retry:'
      // - Event types or IDs
      // This implementation is sufficient for the current MCP server which sends simple
      // single-line data responses. If you need full SSE spec compliance, consider using
      // a dedicated SSE parsing library.
      const text = await response.text()

      // Handle empty responses (e.g., from notifications that don't expect a response)
      if (!text || text.trim() === '') {
        // Empty response is OK for notifications
        return
      }

      // Extract JSON from SSE format (event: message\ndata: {...})
      const lines = text.split('\n')
      const dataLine = lines.find(line => line.startsWith('data: '))

      if (dataLine) {
        const jsonStr = dataLine.substring(6) // Remove 'data: ' prefix
        const data = JSON.parse(jsonStr)

        // Handle the response through the onmessage callback
        if (this.onmessage) {
          this.onmessage(data)
        }
      } else {
        console.error('Failed to find data line in SSE response:', text)
        throw new Error('Invalid SSE response format')
      }
    } catch (error) {
      if (this.onerror) {
        this.onerror(error as Error)
      }
      throw error
    }
  }

  async close(): Promise<void> {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
    if (this.onclose) {
      this.onclose()
    }
  }

  // Required by Transport interface
  onmessage?: (message: any) => void
  onerror?: (error: Error) => void
  onclose?: () => void
}

export class MCPTransport {
  private serverUrl: string
  private timeout: number
  private retryAttempts: number
  private retryDelay: number
  private client: Client | null = null

  constructor(config: MCPTransportConfig) {
    this.serverUrl = config.serverUrl
    this.timeout = config.timeout || 180000 // Default 3 minutes
    this.retryAttempts = config.retryAttempts || 3
    this.retryDelay = config.retryDelay || 1000
  }

  async connect(): Promise<void> {
    try {
      const transport = new HttpTransport(this.serverUrl, this.timeout)

      this.client = new Client({
        name: 'code-labs-web',
        version: '1.0.0',
      }, {
        capabilities: {}
      })

      await this.client.connect(transport)
    } catch (error) {
      console.error('Failed to connect to MCP server:', error)
      throw new Error(`MCP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
  }

  async callTool(toolName: string, params: any): Promise<any> {
    if (!this.client) {
      throw new Error('MCP client not connected')
    }

    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const result = await this.client.callTool({
          name: toolName,
          arguments: params
        })
        return result.content
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        console.error(`MCP tool call attempt ${attempt} failed:`, error)

        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt) // Exponential backoff
        }
      }
    }

    throw lastError || new Error('Tool call failed after retries')
  }

  async listTools(): Promise<any[]> {
    if (!this.client) {
      throw new Error('MCP client not connected')
    }

    try {
      const response = await this.client.listTools()
      return response.tools
    } catch (error) {
      console.error('Failed to list tools:', error)
      throw error
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.connect()
      const tools = await this.listTools()
      await this.disconnect()
      return tools && tools.length > 0
    } catch (error) {
      console.error('Connection test failed:', error)
      // Ensure we disconnect even on error
      try {
        await this.disconnect()
      } catch (disconnectError) {
        // Ignore disconnect errors during cleanup
      }
      return false
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Singleton instance
let mcpTransportInstance: MCPTransport | null = null

export function getMCPTransport(config?: MCPTransportConfig): MCPTransport {
  if (!mcpTransportInstance && config) {
    mcpTransportInstance = new MCPTransport(config)
  }

  if (!mcpTransportInstance) {
    throw new Error('MCP Transport not initialized')
  }

  return mcpTransportInstance
}

// Helper function to make MCP requests from the client
export async function makeMCPRequest(
  endpoint: string,
  request: MCPRequest
): Promise<MCPResponse> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data: data.result,
    }
  } catch (error) {
    console.error('MCP request failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}