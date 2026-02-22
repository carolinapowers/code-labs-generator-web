'use client'

import { useState } from 'react'
import { ProjectConfigForm } from '@/components/forms/ProjectConfigForm'
import { FileTree } from '@/components/displays/FileTree'
import { CodePreview } from '@/components/displays/CodePreview'
import { Button } from '@/components/ui/button'
import { useWorkflow } from '@/contexts/WorkflowContext'
import { downloadProjectAsZip, getFileStats, formatBytes } from '@/lib/download-utils'
import type { ScaffoldFormData } from '@/lib/validators'
import type { FileTreeNode } from '@/lib/types'

export default function ScaffoldPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<FileTreeNode[]>([])
  const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [projectName, setProjectName] = useState<string>('')
  const { brainstormContent, suggestedProjectName } = useWorkflow()

  const handleSubmit = async (data: ScaffoldFormData) => {
    setIsLoading(true)
    setError(null)
    setFiles([])
    setSelectedFile(null)
    setProjectName(data.projectName)

    try {
      const response = await fetch('/api/mcp/scaffold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to scaffold project')
      }

      setFiles(result.fileTree || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadProject = async () => {
    if (files.length > 0) {
      await downloadProjectAsZip(files, projectName || 'code-lab-project')
    }
  }

  const stats = files.length > 0 ? getFileStats(files) : null

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scaffold Workflow</h1>
        <p className="text-gray-600">
          Generate a complete project structure with files, tests, and configuration.
          Choose your language and let AI scaffold your Code Lab project.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Configuration</h2>
            {brainstormContent && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>LAB_OPPORTUNITY.md</strong> content from Brainstorm workflow has been pre-filled below.
                </p>
              </div>
            )}
            <ProjectConfigForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              initialOpportunityContent={brainstormContent}
              initialProjectName={suggestedProjectName}
            />
          </div>
        </div>

        {/* File Display Section */}
        <div className="lg:col-span-2">
          {isLoading && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ps-orange mx-auto mb-4"></div>
              <p className="text-gray-600">Scaffolding project structure...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-red-800 font-semibold mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {files.length > 0 && !isLoading && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Generated Project: {projectName}</h2>
                    {stats && (
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>📁 {stats.totalDirectories} directories</span>
                        <span>📄 {stats.totalFiles} files</span>
                        <span>💾 {formatBytes(stats.totalSize)}</span>
                      </div>
                    )}
                  </div>
                  <Button onClick={handleDownloadProject} size="lg" className="gap-2">
                    <span>⬇️</span>
                    Download as ZIP
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Click on any file in the tree to preview its contents. Download the entire project as a ZIP file to get started.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FileTree
                  files={files}
                  onFileSelect={setSelectedFile}
                  selectedFile={selectedFile?.path}
                />
                <CodePreview file={selectedFile} />
              </div>
            </div>
          )}

          {!isLoading && !error && files.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-500">
                Configure your project and click "Scaffold Project" to generate the structure
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
