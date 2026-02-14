import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { scaffoldSchema } from '@/lib/validators'
import { getMCPClient } from '@/lib/mcp-client'
import { FileTreeNode } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    // Check authentication (skip in demo mode for testing)
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    console.log('Scaffold route - Demo mode:', isDemoMode)
    if (!isDemoMode) {
      const { userId } = await auth()
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = scaffoldSchema.parse(body)

    // Initialize MCP client
    const mcpClient = getMCPClient({
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3001',
      demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
    })

    // Connect if not connected
    if (!mcpClient.isConnected()) {
      await mcpClient.connect()
    }

    // Call appropriate scaffold tool based on language
    let result: any
    switch (validatedData.language) {
      case 'typescript':
        result = await mcpClient.scaffoldReactProject(validatedData)
        break
      case 'csharp':
        result = await mcpClient.scaffoldCSharpProject(validatedData)
        break
      case 'go':
        result = await mcpClient.scaffoldGoProject(validatedData)
        break
      default:
        throw new Error(`Unsupported language: ${validatedData.language}`)
    }

    // Convert flat file list to tree structure
    const fileTree = buildFileTree(result.files || [])

    return NextResponse.json({
      success: true,
      files: result.files || [],
      fileTree,
      message: result.message || 'Project scaffolded successfully',
      mode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'demo' : 'live',
    })
  } catch (error) {
    console.error('Scaffold API error:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          success: false,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        success: false,
      },
      { status: 500 }
    )
  }
}

// Helper function to build file tree from flat file list
function buildFileTree(files: any[]): FileTreeNode[] {
  const root: Record<string, FileTreeNode> = {}

  files.forEach((file) => {
    const parts = file.path.split('/')
    let currentLevel = root

    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        const isFile = index === parts.length - 1

        currentLevel[part] = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: isFile ? 'file' : 'directory',
          content: isFile ? file.content : undefined,
          children: isFile ? undefined : [],
        }

        if (!isFile) {
          // Create a new level for directory children
          const children: Record<string, FileTreeNode> = {}
          currentLevel[part].children = Object.values(children)
          currentLevel = children
        }
      } else if (index < parts.length - 1) {
        // Move to next level for directories
        const children: Record<string, FileTreeNode> = {}
        currentLevel[part].children?.forEach((child) => {
          children[child.name] = child
        })
        currentLevel = children
      }
    })
  })

  return Object.values(root)
}