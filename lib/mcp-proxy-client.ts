/**
 * MCP Proxy Client
 *
 * Client-side helper for calling MCP tools through the proxy API.
 * This provides a clean, type-safe interface for React components
 * to interact with the MCP server.
 */

import { BrainstormFormData, ScaffoldFormData, StandardMCPResponse, GeneratedStepFile } from './types'

// Re-export for backward compatibility
export type MCPProxyResponse<T = any> = StandardMCPResponse<T>

/**
 * Call an MCP tool through the proxy
 */
async function callMCPTool<T = any>(tool: string, params: any): Promise<MCPProxyResponse<T>> {
  try {
    const response = await fetch('/api/mcp/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tool, params }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      }
    }

    return data
  } catch (error) {
    console.error(`MCP tool call failed (${tool}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Test MCP connection and get available tools
 */
export async function testMCPConnection(): Promise<{
  connected: boolean
  tools?: string[]
  error?: string
}> {
  try {
    const response = await fetch('/api/mcp/proxy', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return {
      connected: data.connected,
      tools: data.tools,
      error: data.error,
    }
  } catch (error) {
    console.error('MCP connection test failed:', error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Connection test failed',
    }
  }
}

/**
 * Brainstorm Lab Opportunity
 */
export async function brainstormLabOpportunity(
  data: BrainstormFormData & { provider?: string }
): Promise<MCPProxyResponse<any>> {
  return callMCPTool('brainstorm_lab_opportunity', {
    title: data.title,
    learningObjectives: data.learningObjectives,
    skillPath: data.skillPath,
    skillLevel: data.skillLevel,
    duration: data.duration,
    technology: data.technology,
    provider: data.provider || 'template',
  })
}

/**
 * Scaffold React Project
 */
export async function scaffoldReactProject(
  data: ScaffoldFormData
): Promise<MCPProxyResponse<any>> {
  return callMCPTool('scaffold_react_project', {
    projectName: data.projectName,
    opportunityPath: data.opportunityPath,
    opportunityContent: data.opportunityContent,
    targetDirectory: data.targetDirectory || '.',
  })
}

/**
 * Scaffold C# Project
 */
export async function scaffoldCSharpProject(
  data: ScaffoldFormData
): Promise<MCPProxyResponse<any>> {
  return callMCPTool('scaffold_csharp_project', {
    projectName: data.projectName,
    opportunityPath: data.opportunityPath,
    opportunityContent: data.opportunityContent,
    targetDirectory: data.targetDirectory || '.',
  })
}

/**
 * Scaffold Go Project
 */
export async function scaffoldGoProject(
  data: ScaffoldFormData
): Promise<MCPProxyResponse<any>> {
  return callMCPTool('scaffold_go_project', {
    projectName: data.projectName,
    opportunityPath: data.opportunityPath,
    opportunityContent: data.opportunityContent,
    targetDirectory: data.targetDirectory || '.',
  })
}

/**
 * Generate Step Content (web-optimized - no file creation)
 */
export async function generateStepContent(
  stepNumber: number,
  title: string,
  tasks: string[]
): Promise<StandardMCPResponse<GeneratedStepFile>> {
  try {
    const response = await fetch('/api/mcp/generate-step', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stepNumber, title, tasks }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      }
    }

    return data
  } catch (error) {
    console.error('Generate step content failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Generate Tests Content (web-optimized - no file creation)
 */
export async function generateTestsContent(
  stepNumber: number,
  title: string,
  tasks: string[]
): Promise<StandardMCPResponse<GeneratedStepFile>> {
  try {
    const response = await fetch('/api/mcp/generate-tests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stepNumber, title, tasks }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      }
    }

    return data
  } catch (error) {
    console.error('Generate tests content failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Generate Solution Content (web-optimized - no file creation)
 */
export async function generateSolutionContent(
  stepNumber: number,
  title: string,
  tasks: string[]
): Promise<StandardMCPResponse<GeneratedStepFile>> {
  try {
    const response = await fetch('/api/mcp/generate-solution', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stepNumber, title, tasks }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      }
    }

    return data
  } catch (error) {
    console.error('Generate solution content failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Run Tests for a Step
 */
export async function runTests(
  stepNumber: number,
  tags?: string[]
): Promise<MCPProxyResponse<any>> {
  return callMCPTool('run_tests', {
    stepNumber,
    tags,
  })
}

/**
 * List Available MCP Tools
 */
export async function listMCPTools(): Promise<MCPProxyResponse<string[]>> {
  return callMCPTool('list_tools', {})
}

/**
 * Scaffold project based on language
 */
export async function scaffoldProject(
  language: 'typescript' | 'csharp' | 'go',
  data: ScaffoldFormData
): Promise<MCPProxyResponse<any>> {
  switch (language) {
    case 'typescript':
      return scaffoldReactProject(data)
    case 'csharp':
      return scaffoldCSharpProject(data)
    case 'go':
      return scaffoldGoProject(data)
    default:
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      }
  }
}
