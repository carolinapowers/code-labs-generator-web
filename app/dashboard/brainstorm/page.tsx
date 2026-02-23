'use client'

import { useState } from 'react'
import { LearningObjectivesForm } from '@/components/forms/LearningObjectivesForm'
import { MarkdownRenderer } from '@/components/displays/MarkdownRenderer'
import { useWorkflow } from '@/contexts/WorkflowContext'
import { brainstormLabOpportunity } from '@/lib/mcp-proxy-client'
import type { BrainstormFormData } from '@/lib/validators'

export default function BrainstormPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cost, setCost] = useState<number | null>(null)
  const [provider, setProvider] = useState<string | null>(null)
  const { setBrainstormContent } = useWorkflow()

  const handleSubmit = async (data: BrainstormFormData) => {
    setIsLoading(true)
    setError(null)
    setGeneratedContent(null)

    try {
      // Call MCP tool through proxy
      const response = await brainstormLabOpportunity(data)

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate LAB_OPPORTUNITY.md')
      }

      // Extract content from MCP response format
      // MCP returns: [{ type: "text", text: "..." }]
      let content: string
      const result = (response as any).result // Proxy returns 'result', not 'data'

      if (!result) {
        throw new Error('No result returned from MCP server')
      }

      if (typeof result === 'string') {
        content = result
      } else if (Array.isArray(result) && result.length > 0 && result[0].text) {
        content = result[0].text
      } else if ((result as any).content) {
        content = (result as any).content
      } else {
        throw new Error('Unexpected MCP response format')
      }

      setGeneratedContent(content)
      setCost((response as any).cost || 0)
      setProvider(data.provider || 'template')

      // Save to workflow context for use in scaffold and develop pages
      setBrainstormContent(content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Brainstorm Workflow</h1>
        <p className="text-text-secondary">
          Generate a complete LAB_OPPORTUNITY.md file from your learning objectives.
          This AI-powered tool structures your ideas into a comprehensive Code Lab plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <div className="bg-bg-card rounded-lg border border-border-default p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Learning Objectives</h2>
            <LearningObjectivesForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <div className="sticky top-8 bg-bg-card rounded-lg border border-border-default p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Preview</h2>

            {isLoading && (
              <div className="bg-gray-50 dark:bg-bg-tertiary rounded-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-orange mx-auto mb-4"></div>
                <p className="text-text-secondary">Generating LAB_OPPORTUNITY.md...</p>
              </div>
            )}

            {error && (
              <div className="bg-status-error border border-ps-error rounded-lg p-6">
                <h3 className="text-status-error font-semibold mb-2">Error</h3>
                <p className="text-status-error">{error}</p>
              </div>
            )}

            {generatedContent && !isLoading && (
              <div>
                {(cost !== null || provider) && (
                  <div className="mb-4 bg-status-info border border-ps-info rounded-lg p-4">
                    <div className="text-sm text-status-info">
                      {provider && (
                        <p>Provider: <strong>{
                          provider === 'template' ? 'Template (Free)' :
                          provider === 'anthropic' ? 'Claude' :
                          provider === 'openai' ? 'GPT-4' :
                          provider === 'google' ? 'Gemini' : provider
                        }</strong></p>
                      )}
                      {cost !== null && (
                        <p>Cost: <strong>{cost === 0 ? 'Free' : `$${cost.toFixed(4)}`}</strong></p>
                      )}
                    </div>
                  </div>
                )}
                <MarkdownRenderer content={generatedContent} />
              </div>
            )}

            {!isLoading && !error && !generatedContent && (
              <div className="bg-gray-50 dark:bg-bg-tertiary rounded-lg p-12 text-center">
                <p className="text-text-muted">
                  Fill out the form and click "Generate" to see your LAB_OPPORTUNITY.md
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
