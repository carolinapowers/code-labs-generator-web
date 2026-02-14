'use client'

import { useState } from 'react'
import { LearningObjectivesForm } from '@/components/forms/LearningObjectivesForm'
import { MarkdownRenderer } from '@/components/displays/MarkdownRenderer'
import type { BrainstormFormData } from '@/lib/validators'

export default function BrainstormPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cost, setCost] = useState<number | null>(null)

  const handleSubmit = async (data: BrainstormFormData) => {
    setIsLoading(true)
    setError(null)
    setGeneratedContent(null)

    try {
      const response = await fetch('/api/mcp/brainstorm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate LAB_OPPORTUNITY.md')
      }

      setGeneratedContent(result.content)
      setCost(result.cost)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Brainstorm Workflow</h1>
        <p className="text-gray-600">
          Generate a complete LAB_OPPORTUNITY.md file from your learning objectives.
          This AI-powered tool structures your ideas into a comprehensive Code Lab plan.
        </p>
        {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Using mock data. Connect to MCP server for real generation.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Objectives</h2>
            <LearningObjectivesForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <div className="sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>

            {isLoading && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ps-orange mx-auto mb-4"></div>
                <p className="text-gray-600">Generating LAB_OPPORTUNITY.md...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-red-800 font-semibold mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {generatedContent && !isLoading && (
              <div>
                {cost !== null && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Estimated cost: <strong>${cost.toFixed(4)}</strong>
                    </p>
                  </div>
                )}
                <MarkdownRenderer content={generatedContent} />
              </div>
            )}

            {!isLoading && !error && !generatedContent && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-500">
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
