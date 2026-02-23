'use client'

import { useState, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { FileTreeNode } from '@/lib/types'
import { useTheme } from '@/components/providers/ThemeProvider'

interface CodePreviewProps {
  file: FileTreeNode | null
}

export function CodePreview({ file }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)
  const { resolvedTheme } = useTheme()

  if (!file || !file.content) {
    return (
      <div className="bg-bg-card rounded-lg border border-border-default p-12 text-center">
        <p className="text-text-muted">Select a file to preview its contents</p>
      </div>
    )
  }

  const copyToClipboard = async () => {
    if (file.content) {
      await navigator.clipboard.writeText(file.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadFile = () => {
    if (file.content) {
      const blob = new Blob([file.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()

    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'tsx',
      'js': 'javascript',
      'jsx': 'jsx',
      'json': 'json',
      'md': 'markdown',
      'css': 'css',
      'scss': 'scss',
      'html': 'html',
      'cs': 'csharp',
      'csproj': 'xml',
      'go': 'go',
      'mod': 'go',
      'yml': 'yaml',
      'yaml': 'yaml',
      'xml': 'xml',
      'sh': 'bash',
      'bash': 'bash',
    }

    return languageMap[ext || ''] || 'plaintext'
  }

  return (
    <div className="bg-bg-card rounded-lg border border-border-default overflow-hidden">
      <div className="bg-bg-secondary px-4 py-3 border-b border-border-default flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{getFileIcon(file.name)}</span>
          <span className="text-sm font-mono text-text-primary">{file.name}</span>
          <span className="text-xs text-text-muted">
            {file.path}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadFile}
          >
            Download
          </Button>
        </div>
      </div>
      <div className="overflow-auto max-h-[600px]">
        <SyntaxHighlighter
          language={getLanguage(file.name)}
          style={resolvedTheme === 'dark' ? vscDarkPlus : vs}
          showLineNumbers
          customStyle={{
            margin: 0,
            fontSize: '14px',
          }}
        >
          {file.content}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()

  const iconMap: Record<string, string> = {
    'ts': '📄',
    'tsx': '⚛️',
    'js': '📜',
    'jsx': '⚛️',
    'json': '📋',
    'md': '📝',
    'css': '🎨',
    'html': '🌐',
    'cs': '🔷',
    'csproj': '🔧',
    'go': '🐹',
    'mod': '📦',
    'gitignore': '🚫',
    'env': '🔐',
    'yml': '⚙️',
    'yaml': '⚙️',
  }

  return iconMap[ext || ''] || '📄'
}