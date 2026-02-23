'use client'

import { useState } from 'react'
import { StepDetailsForm, type StepDetailsFormData } from '@/components/forms/StepDetailsForm'
import { FilePreview } from '@/components/displays/FilePreview'
import { generateStepContent } from '@/lib/mcp-proxy-client'

interface GeneratedFile {
  filename: string
  content: string
  language: string
}

export default function CreateStepPage() {
  const [file, setFile] = useState<GeneratedFile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: StepDetailsFormData) => {
    console.log('[Create Page] Form submitted with data:', data)
    setLoading(true)
    setError(null)

    try {
      // Call MCP tool through proxy
      console.log('[Create Page] Calling generateStepContent...')
      const response = await generateStepContent(
        data.stepNumber,
        data.title,
        data.tasks
      )

      console.log('[Create Page] Response received:', {
        success: response.success,
        hasResult: !!response.result,
        error: response.error
      })

      if (!response.success || !response.result) {
        console.error('[Create Page] Response failed:', response.error)
        throw new Error(response.error || 'Failed to generate step')
      }

      console.log('[Create Page] Processing response result...')

      // Extract file from MCP response
      // MCP returns: [{ type: "text", text: "..." }] with filename/content in the text
      const result = response.result
      console.log('[Create Page] Result type:', typeof result, Array.isArray(result) ? `(array of ${result.length})` : '')
      console.log('[Create Page] Result structure:', JSON.stringify(result).substring(0, 200))

      let fileData: GeneratedFile

      if (Array.isArray(result) && result.length > 0) {
        console.log('[Create Page] Processing array result')
        // Get text content from MCP response
        const textContent = result[0].text || result[0].content
        console.log('[Create Page] Text content type:', typeof textContent)
        console.log('[Create Page] Text content preview:', typeof textContent === 'string' ? textContent.substring(0, 100) : textContent)

        // Check if it's an error message
        if (typeof textContent === 'string' && textContent.startsWith('Error')) {
          console.error('[Create Page] Error message in response:', textContent)
          throw new Error(textContent)
        }

        // Try to parse JSON from MCP text response
        let parsed: any
        try {
          console.log('[Create Page] Attempting to parse JSON...')
          parsed = typeof textContent === 'string' ? JSON.parse(textContent) : textContent
          console.log('[Create Page] Parsed successfully:', Object.keys(parsed))
        } catch (parseError) {
          console.error('[Create Page] JSON parse failed!')
          console.error('[Create Page] Failed content:', textContent)
          throw new Error(`Invalid response format: ${parseError instanceof Error ? parseError.message : 'Parse failed'}`)
        }

        if (!parsed.filename || !parsed.content) {
          console.error('[Create Page] Missing required fields in parsed data:', Object.keys(parsed))
          throw new Error('Response missing required fields (filename, content)')
        }

        fileData = {
          filename: parsed.filename,
          content: parsed.content,
          language: 'markdown'
        }
        console.log('[Create Page] File data created:', { filename: fileData.filename, contentLength: fileData.content.length })
      } else if (result.filename && result.content) {
        console.log('[Create Page] Using direct result format')
        fileData = {
          filename: result.filename,
          content: result.content,
          language: 'markdown'
        }
      } else {
        console.error('[Create Page] Unexpected MCP response format!')
        console.error('[Create Page] Result:', result)
        throw new Error('Unexpected MCP response format')
      }

      console.log('[Create Page] Setting file state with:', fileData.filename)
      setFile(fileData)
      console.log('[Create Page] Success! File state updated')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate step content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Create Step Content</h1>
        <p className="text-text-secondary mt-2">
          Generate step markdown content with tasks and instructions for your Code Lab.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <div className="bg-bg-card rounded-lg border border-border-default p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Step Details</h2>
            <StepDetailsForm
              onSubmit={handleSubmit}
              submitLabel="Generate Step Content"
              loading={loading}
            />

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-status-error/10 border border-status-error rounded-lg">
                <p className="text-status-error text-sm font-medium">Error</p>
                <p className="text-status-error text-sm mt-1">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">Preview</h2>
          {file ? (
            <FilePreview
              filename={file.filename}
              content={file.content}
              language={file.language}
            />
          ) : (
            <div className="border-2 border-dashed border-border-default rounded-lg p-12 text-center">
              <p className="text-text-muted">
                Fill in the form and click "Generate Step Content" to see preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
