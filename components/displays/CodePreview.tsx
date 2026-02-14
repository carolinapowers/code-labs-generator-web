'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { FileTreeNode } from '@/lib/types'

interface CodePreviewProps {
  file: FileTreeNode | null
  theme?: 'light' | 'dark'
}

export function CodePreview({ file, theme = 'light' }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)

  if (!file || !file.content) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Select a file to preview its contents</p>
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{getFileIcon(file.name)}</span>
          <span className="text-sm font-mono text-gray-700">{file.name}</span>
          <span className="text-xs text-gray-500">
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
          style={theme === 'dark' ? vscDarkPlus : vs}
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