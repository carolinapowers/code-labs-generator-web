'use client'

import { useMCPConnection } from '@/hooks/useMCPConnection'

export function MCPStatus() {
  const { connected,  serverUrl, isLoading } = useMCPConnection()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
        <span className="text-gray-500">Checking MCP...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div
        className={`h-2 w-2 rounded-full ${
          connected ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className={connected ? 'text-green-700' : 'text-red-700'}>
        {connected ? 'MCP Connected' : 'MCP Disconnected'}
      </span>
      {serverUrl && (
        <span className="text-gray-400 text-xs">({serverUrl})</span>
      )}
    </div>
  )
}