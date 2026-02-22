'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WorkflowContextType {
  brainstormContent: string | null
  suggestedProjectName: string | null
  setBrainstormContent: (content: string | null) => void
  clearWorkflow: () => void
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

/**
 * Extract project name from LAB_OPPORTUNITY.md content
 * Looks for the first H1 heading and converts it to a project name
 */
function extractProjectName(content: string): string | null {
  // Look for the first H1 heading (# Title)
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) {
    const title = h1Match[1]
      .trim()
      // Remove "Code Lab Opportunity:" prefix if present
      .replace(/^Code Lab Opportunity:\s*/i, '')
      // Remove "Lab:" prefix if present
      .replace(/^Lab:\s*/i, '')
      // Convert to kebab-case
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return title || null
  }
  return null
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [brainstormContent, setBrainstormContentState] = useState<string | null>(null)
  const [suggestedProjectName, setSuggestedProjectName] = useState<string | null>(null)

  const setBrainstormContent = (content: string | null) => {
    setBrainstormContentState(content)
    if (content) {
      const projectName = extractProjectName(content)
      setSuggestedProjectName(projectName)
    } else {
      setSuggestedProjectName(null)
    }
  }

  const clearWorkflow = () => {
    setBrainstormContentState(null)
    setSuggestedProjectName(null)
  }

  return (
    <WorkflowContext.Provider
      value={{
        brainstormContent,
        suggestedProjectName,
        setBrainstormContent,
        clearWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}
