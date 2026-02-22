import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { scaffoldSchema } from '@/lib/validators'
import { FileTreeNode } from '@/lib/types'
import { scaffold } from '@/lib/scaffold'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = scaffoldSchema.parse(body)

    console.log('Scaffolding project:', validatedData.projectName, 'Language:', validatedData.language)

    // Generate project files in-memory using our scaffold library
    // No MCP server, no filesystem I/O, pure in-memory generation
    const result = await scaffold({
      projectName: validatedData.projectName,
      language: validatedData.language,
      opportunityContent: validatedData.opportunityContent,
    })

    console.log(`Generated ${result.files.length} files for project: ${validatedData.projectName}`)

    // Convert flat file list to tree structure
    const fileTree = buildFileTree(result.files)

    return NextResponse.json({
      success: true,
      files: result.files,
      fileTree,
      message: result.message,
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
  const root: Record<string, any> = {}

  files.forEach((file) => {
    const parts = file.path.split('/')
    let currentLevel = root

    parts.forEach((part: string, index: number) => {
      const isFile = index === parts.length - 1

      if (!currentLevel[part]) {
        if (isFile) {
          currentLevel[part] = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: 'file',
            content: file.content,
          }
        } else {
          currentLevel[part] = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: 'directory',
            _children: {},
          }
        }
      }

      // Navigate to next level for directories
      if (!isFile) {
        currentLevel = currentLevel[part]._children
      }
    })
  })

  // Convert the nested structure with _children to proper children arrays
  function convertToTree(node: any): FileTreeNode {
    if (node.type === 'file') {
      return {
        name: node.name,
        path: node.path,
        type: 'file',
        content: node.content,
      }
    }

    return {
      name: node.name,
      path: node.path,
      type: 'directory',
      children: Object.values(node._children).map((child: any) => convertToTree(child)),
    }
  }

  return Object.values(root).map((node: any) => convertToTree(node))
}
