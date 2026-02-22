import JSZip from 'jszip'
import { FileTreeNode } from './types'

/**
 * Downloads the entire project structure as a ZIP file
 */
export async function downloadProjectAsZip(
  files: FileTreeNode[],
  projectName: string = 'code-lab-project'
): Promise<void> {
  const zip = new JSZip()

  // Recursively add files to the ZIP
  const addFilesToZip = (nodes: FileTreeNode[], currentPath: string = '') => {
    nodes.forEach((node) => {
      const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name

      if (node.type === 'file' && node.content) {
        zip.file(fullPath, node.content)
      } else if (node.type === 'directory') {
        // Explicitly create the folder to preserve empty directories
        zip.folder(fullPath)
        // Add its children, if any
        if (node.children) {
          addFilesToZip(node.children, fullPath)
        }
      }
    })
  }

  addFilesToZip(files)

  // Generate the ZIP file
  const blob = await zip.generateAsync({ type: 'blob' })

  // Trigger download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${projectName}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Downloads a single file
 */
export function downloadFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Gets file statistics from a file tree
 */
export function getFileStats(files: FileTreeNode[]): {
  totalFiles: number
  totalDirectories: number
  totalSize: number
} {
  let totalFiles = 0
  let totalDirectories = 0
  let totalSize = 0

  const traverse = (nodes: FileTreeNode[]) => {
    nodes.forEach((node) => {
      if (node.type === 'file') {
        totalFiles++
        totalSize += node.content?.length || 0
      } else if (node.type === 'directory') {
        totalDirectories++
        if (node.children) {
          traverse(node.children)
        }
      }
    })
  }

  traverse(files)

  return { totalFiles, totalDirectories, totalSize }
}

/**
 * Formats bytes to human-readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
