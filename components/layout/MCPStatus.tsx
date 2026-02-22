'use client'

import { useMCPConnection } from '@/hooks/useMCPConnection'

export function MCPStatus() {
  const { connected, serverUrl, isLoading } = useMCPConnection()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <div className="h-2 w-2 rounded-full bg-text-muted animate-pulse" />
        <span className="text-text-secondary">Checking MCP...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div
        className={`h-2 w-2 rounded-full ${
          connected ? 'bg-ps-success' : 'bg-ps-error'
        }`}
      />
      <span className={connected ? 'text-ps-success' : 'text-ps-error'}>
        {connected ? 'MCP Connected' : 'MCP Disconnected'}
      </span>
      {serverUrl && (
        <span className="text-text-muted text-xs">({serverUrl})</span>
      )}
    </div>
  )
}