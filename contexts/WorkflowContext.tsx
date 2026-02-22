'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'typescript' | 'csharp' | 'go'

interface WorkflowContextType {
  brainstormContent: string | null
  suggestedProjectName: string | null
  suggestedLanguage: Language | null
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

/**
 * Detect language from LAB_OPPORTUNITY.md content
 * Looks for technology mentions in the content
 * Order matters: Check Go FIRST since project names might contain "for-go-applications"
 */
function detectLanguage(content: string): Language | null {
  const lowerContent = content.toLowerCase()

  // Check in the technology section first if present (most reliable)
  const techMatch = content.match(/##\s*Technology.*?\n([\s\S]*?)(?=\n##|$)/i)
  if (techMatch) {
    const techSection = techMatch[1].toLowerCase()
    if (techSection.includes('go') && !techSection.includes('django') && !techSection.includes('mongo')) return 'go'
    if (techSection.includes('asp.net') || techSection.includes('.net') || techSection.includes('c#')) return 'csharp'
    if (techSection.includes('react') || techSection.includes('typescript') || techSection.includes('javascript')) return 'typescript'
  }

  // Check for Go indicators FIRST (before TypeScript which might match incidentally)
  // Look for Go-specific patterns
  if (
    lowerContent.includes('golang') ||
    lowerContent.includes('go web') ||
    lowerContent.includes('go application') ||
    lowerContent.includes('for go ') ||
    lowerContent.includes('with go') ||
    lowerContent.includes('using go') ||
    lowerContent.includes('-go-') || // Matches "for-go-applications"
    lowerContent.includes('in go') ||
    // More specific Go language indicators
    lowerContent.includes('go programming') ||
    lowerContent.includes('go language') ||
    lowerContent.includes('go module') ||
    lowerContent.includes('goroutine') ||
    lowerContent.includes('go package') ||
    // Check if "go" appears near programming-related terms (within ~50 chars)
    /\bgo\b.{0,50}\b(package|module|struct|interface|goroutine|channel|framework|server|handler|api)\b/i.test(content) ||
    /\b(package|module|struct|interface|goroutine|channel|framework|server|handler|api)\b.{0,50}\bgo\b/i.test(content)
  ) {
    // Make sure it's not a false positive (e.g., "Django", "Mongo")
    if (!lowerContent.includes('django') && !lowerContent.includes('mongo')) {
      return 'go'
    }
  }

  // C#/ASP.NET indicators
  if (
    lowerContent.includes('c#') ||
    lowerContent.includes('asp.net') ||
    lowerContent.includes('aspnet') ||
    lowerContent.includes('.net') ||
    lowerContent.includes('dotnet') ||
    lowerContent.includes('razor') ||
    lowerContent.includes('blazor')
  ) {
    return 'csharp'
  }

  // TypeScript/React indicators (check last to avoid false positives)
  if (
    lowerContent.includes('react') ||
    lowerContent.includes('typescript') ||
    lowerContent.includes('next.js') ||
    lowerContent.includes('vite') ||
    lowerContent.includes('node.js') ||
    lowerContent.includes('javascript')
  ) {
    return 'typescript'
  }

  return null
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [brainstormContent, setBrainstormContentState] = useState<string | null>(null)
  const [suggestedProjectName, setSuggestedProjectName] = useState<string | null>(null)
  const [suggestedLanguage, setSuggestedLanguage] = useState<Language | null>(null)

  const setBrainstormContent = (content: string | null) => {
    setBrainstormContentState(content)
    if (content) {
      const projectName = extractProjectName(content)
      const language = detectLanguage(content)
      setSuggestedProjectName(projectName)
      setSuggestedLanguage(language)
    } else {
      setSuggestedProjectName(null)
      setSuggestedLanguage(null)
    }
  }

  const clearWorkflow = () => {
    setBrainstormContentState(null)
    setSuggestedProjectName(null)
    setSuggestedLanguage(null)
  }

  return (
    <WorkflowContext.Provider
      value={{
        brainstormContent,
        suggestedProjectName,
        suggestedLanguage,
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
