'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  content: string
  title?: string
}

export function MarkdownRenderer({ content, title = 'LAB_OPPORTUNITY.md' }: Props) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono text-gray-700">{title}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="p-6 overflow-auto max-h-[600px]">
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded">
            {content}
          </pre>
        </div>
      </div>
    </div>
  )
}
