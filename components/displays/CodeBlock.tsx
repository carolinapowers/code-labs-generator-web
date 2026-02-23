'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
  theme?: 'light' | 'dark'
}

export function CodeBlock({ code, language, filename, theme = 'light' }: CodeBlockProps) {
  return (
    <div className="overflow-auto">
      {filename && (
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{filename}</span>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={theme === 'dark' ? vscDarkPlus : vs}
        showLineNumbers
        customStyle={{
          margin: 0,
          fontSize: '14px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
