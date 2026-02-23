'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CodeBlock } from './CodeBlock'
import { Check, Clipboard, Download } from 'lucide-react'

interface FilePreviewProps {
  filename: string
  content: string
  language: string
}

export function FilePreview({ filename, content, language }: FilePreviewProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFile = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 bg-bg-card border border-border-default rounded-lg p-6">
      {/* File Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
        <h3 className="font-mono text-sm text-text-secondary">
          {filename}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadFile}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* File Content */}
      <div className="max-h-[600px] overflow-auto">
        <CodeBlock code={content} language={language} />
      </div>
    </div>
  )
}
