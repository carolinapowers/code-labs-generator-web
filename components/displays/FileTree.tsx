'use client'

import { useState } from 'react'
import { FileTreeNode } from '@/lib/types'

interface FileTreeProps {
  files: FileTreeNode[]
  onFileSelect?: (file: FileTreeNode) => void
  selectedFile?: string
}

export function FileTree({ files, onFileSelect, selectedFile }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const renderNode = (node: FileTreeNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.path)
    const isSelected = selectedFile === node.path
    const isDirectory = node.type === 'directory'

    return (
      <div key={node.path}>
        <div
          className={`
            flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-100 transition-colors
            ${isSelected ? 'bg-ps-orange/10 border-l-2 border-ps-orange' : ''}
          `}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => {
            if (isDirectory) {
              toggleFolder(node.path)
            } else if (onFileSelect) {
              onFileSelect(node)
            }
          }}
        >
          <span className="mr-2 text-sm">
            {isDirectory ? (
              isExpanded ? '📂' : '📁'
            ) : (
              getFileIcon(node.name)
            )}
          </span>
          <span className={`text-sm ${isDirectory ? 'font-medium' : ''}`}>
            {node.name}
          </span>
        </div>
        {isDirectory && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Project Structure</h3>
      </div>
      <div className="p-2 max-h-[500px] overflow-auto">
        {files.map((file) => renderNode(file))}
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