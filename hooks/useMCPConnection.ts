'use client'

import { useEffect, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'

export interface MCPConnectionStatus {
  connected: boolean
  serverUrl: string
  demoMode: boolean
  tools: string[]
  error?: string
}

export function useMCPConnection() {
  const [status, setStatus] = useState<MCPConnectionStatus>({
    connected: false,
    serverUrl: '',
    demoMode: true,
    tools: [],
  })

  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['mcp-connection'],
    queryFn: async () => {
      const response = await fetch('/api/mcp/proxy')
      if (!response.ok) {
        throw new Error('Failed to check MCP connection')
      }
      return response.json()
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: 1,
  })

  useEffect(() => {
    if (data) {
      setStatus({
        connected: data.connected,
        serverUrl: data.serverUrl || '',
        demoMode: data.demoMode || false,
        tools: data.tools || [],
        error: data.error,
      })
    }
  }, [data])

  useEffect(() => {
    if (error) {
      setStatus(prev => ({
        ...prev,
        connected: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }))
    }
  }, [error])

  const checkConnection = useCallback(() => {
    refetch()
  }, [refetch])

  return {
    ...status,
    isLoading,
    checkConnection,
  }
}

// Hook for making MCP tool calls
export function useMCPTool() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callTool = useCallback(async (toolName: string, params: Record<string, unknown>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/mcp/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: toolName,
          params,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Tool call failed: ${response.status}`)
      }

      return data.result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tool call failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    callTool,
    isLoading,
    error,
  }
}