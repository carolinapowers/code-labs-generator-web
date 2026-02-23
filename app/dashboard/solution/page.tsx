'use client'

import { useState } from 'react'
import { StepDetailsForm, type StepDetailsFormData } from '@/components/forms/StepDetailsForm'
import { FilePreview } from '@/components/displays/FilePreview'
import { generateSolutionContent } from '@/lib/mcp-proxy-client'

interface GeneratedFile {
  filename: string
  content: string
  language: string
}

export default function GenerateSolutionPage() {
  const [file, setFile] = useState<GeneratedFile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: StepDetailsFormData) => {
    setLoading(true)
    setError(null)

    try {
      // Call MCP tool through proxy
      const response = await generateSolutionContent(
        data.stepNumber,
        data.title,
        data.tasks
      )

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to generate solution')
      }

      // Response is now standardized - no complex parsing needed
      setFile(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate solution content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Generate Solution</h1>
        <p className="text-text-secondary mt-2">
          Generate solution template for Claude Code to implement. Solutions show the "Find and Replace" instructions for each task.
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
              submitLabel="Generate Solution"
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
                Fill in the form and click "Generate Solution" to see preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
