'use client'

import { useState, useEffect } from 'react'
import { testMCPConnection } from '@/lib/mcp-proxy-client'

export function MCPStatus() {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [toolCount, setToolCount] = useState<number>(0)
  const serverUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3002/mcp'

  useEffect(() => {
    let mounted = true

    const checkConnection = async () => {
      try {
        const result = await testMCPConnection()
        if (mounted) {
          setConnected(result.connected)
          setToolCount(result.tools?.length || 0)
        }
      } catch (error) {
        if (mounted) {
          setConnected(false)
        }
      }
    }

    // Check immediately on mount
    checkConnection()

    // Then check every 30 seconds
    const interval = setInterval(checkConnection, 30000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  if (connected === null) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <div className="h-2 w-2 rounded-full bg-ps-warning animate-pulse" />
        <span className="text-ps-warning">Checking MCP...</span>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <div className="h-2 w-2 rounded-full bg-ps-error" />
        <span className="text-ps-error">MCP Offline</span>
        <span className="text-text-muted text-xs">({serverUrl})</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="h-2 w-2 rounded-full bg-ps-success" />
      <span className="text-ps-success">
        MCP Connected
      </span>
      <span className="text-text-muted text-xs">
        ({toolCount} tools)
      </span>
    </div>
  )
}
