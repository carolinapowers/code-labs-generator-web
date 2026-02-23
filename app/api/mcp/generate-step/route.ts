import { NextRequest } from 'next/server'
import { z } from 'zod'
import { handleMCPToolCall, parseMCPResponse, sanitizeInput, sanitizeInputArray } from '@/lib/mcp-api-helpers'
import type { GeneratedStepFile } from '@/lib/types'

const generateStepSchema = z.object({
  stepNumber: z.number().int().min(2).max(20),
  title: z.string().min(5).max(200),
  tasks: z.array(z.string().min(3).max(200)).min(1).max(10),
})

export async function POST(req: NextRequest) {
  return handleMCPToolCall(req, {
    toolName: 'generateStepContent',
    schema: generateStepSchema,
    extractParams: (data) => ({
      stepNumber: data.stepNumber,
      title: sanitizeInput(data.title),
      tasks: sanitizeInputArray(data.tasks),
    }),
    formatResponse: (result): GeneratedStepFile => {
      const parsed = parseMCPResponse(result) as { filename?: string; content?: string; language?: string }

      if (!parsed.filename || !parsed.content) {
        throw new Error('Invalid MCP response: missing filename or content')
      }

      return {
        filename: parsed.filename,
        content: parsed.content,
        language: parsed.language || 'markdown',
      }
    },
  })
}
