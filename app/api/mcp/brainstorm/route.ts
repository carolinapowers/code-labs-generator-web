import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { brainstormSchema } from '@/lib/validators'
import { generateDemoLabOpportunity } from '@/lib/demo-data'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = brainstormSchema.parse(body)

    // Check if demo mode is enabled
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

    if (isDemoMode) {
      // Return demo data
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay

      const content = generateDemoLabOpportunity(
        validatedData.title,
        validatedData.learningObjectives
      )

      return NextResponse.json({
        success: true,
        content,
        cost: 0.05,
        tokensUsed: 1500,
        mode: 'demo'
      })
    }

    // TODO: Real MCP integration
    // For now, return an error if not in demo mode
    return NextResponse.json({
      error: 'MCP server integration not yet implemented. Please enable NEXT_PUBLIC_DEMO_MODE=true',
      success: false
    }, { status: 501 })

  } catch (error) {
    console.error('Brainstorm API error:', error)

    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
        success: false
      }, { status: 400 })
    }

    return NextResponse.json({
      error: 'An unexpected error occurred',
      success: false
    }, { status: 500 })
  }
}
