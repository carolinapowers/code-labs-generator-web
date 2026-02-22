'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WorkflowContextType {
  brainstormContent: string | null
  setBrainstormContent: (content: string | null) => void
  clearWorkflow: () => void
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [brainstormContent, setBrainstormContent] = useState<string | null>(null)

  const clearWorkflow = () => {
    setBrainstormContent(null)
  }

  return (
    <WorkflowContext.Provider
      value={{
        brainstormContent,
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
