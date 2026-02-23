'use client'

import { useState } from 'react'
import { StepDetailsForm, type StepDetailsFormData } from '@/components/forms/StepDetailsForm'
import { FilePreview } from '@/components/displays/FilePreview'
import { generateTestsContent } from '@/lib/mcp-proxy-client'

interface GeneratedFile {
  filename: string
  content: string
  language: string
}

export default function GenerateTestsPage() {
  const [file, setFile] = useState<GeneratedFile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: StepDetailsFormData) => {
    console.log('[Tests Page] Form submitted with data:', data)
    setLoading(true)
    setError(null)

    try {
      // Call MCP tool through proxy
      console.log('[Tests Page] Calling generateTestsContent...')
      const response = await generateTestsContent(
        data.stepNumber,
        data.title,
        data.tasks
      )

      console.log('[Tests Page] Response received:', {
        success: response.success,
        hasResult: !!response.result,
        error: response.error
      })

      if (!response.success || !response.result) {
        console.error('[Tests Page] Response failed:', response.error)
        throw new Error(response.error || 'Failed to generate tests')
      }

      console.log('[Tests Page] Processing response result...')

      // Extract file from MCP response
      const result = response.result
      console.log('[Tests Page] Result type:', typeof result, Array.isArray(result) ? `(array of ${result.length})` : '')
      console.log('[Tests Page] Result structure:', JSON.stringify(result).substring(0, 200))

      let fileData: GeneratedFile

      if (Array.isArray(result) && result.length > 0) {
        console.log('[Tests Page] Processing array result')
        const textContent = result[0].text || result[0].content
        console.log('[Tests Page] Text content type:', typeof textContent)
        console.log('[Tests Page] Text content preview:', typeof textContent === 'string' ? textContent.substring(0, 100) : textContent)

        // Check if it's an error message
        if (typeof textContent === 'string' && textContent.startsWith('Error')) {
          console.error('[Tests Page] Error message in response:', textContent)
          throw new Error(textContent)
        }

        // Try to parse JSON from MCP text response
        let parsed: any
        try {
          console.log('[Tests Page] Attempting to parse JSON...')
          parsed = typeof textContent === 'string' ? JSON.parse(textContent) : textContent
          console.log('[Tests Page] Parsed successfully:', Object.keys(parsed))
        } catch (parseError) {
          console.error('[Tests Page] JSON parse failed!')
          console.error('[Tests Page] Failed content:', textContent)
          throw new Error(`Invalid response format: ${parseError instanceof Error ? parseError.message : 'Parse failed'}`)
        }

        if (!parsed.filename || !parsed.content) {
          console.error('[Tests Page] Missing required fields in parsed data:', Object.keys(parsed))
          throw new Error('Response missing required fields (filename, content)')
        }

        fileData = {
          filename: parsed.filename,
          content: parsed.content,
          language: 'markdown'
        }
        console.log('[Tests Page] File data created:', { filename: fileData.filename, contentLength: fileData.content.length })
      } else if (result.filename && result.content) {
        console.log('[Tests Page] Using direct result format')
        fileData = {
          filename: result.filename,
          content: result.content,
          language: 'markdown'
        }
      } else {
        console.error('[Tests Page] Unexpected MCP response format!')
        console.error('[Tests Page] Result:', result)
        throw new Error('Unexpected MCP response format')
      }

      console.log('[Tests Page] Setting file state with:', fileData.filename)
      setFile(fileData)
      console.log('[Tests Page] Success! File state updated')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tests content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Generate Tests</h1>
        <p className="text-text-secondary mt-2">
          Generate test scaffolding for your step tasks. Tests validate that learners complete the tasks correctly.
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
              submitLabel="Generate Tests"
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
                Fill in the form and click "Generate Tests" to see preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
