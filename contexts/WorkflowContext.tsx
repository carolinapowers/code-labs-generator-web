'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'typescript' | 'csharp' | 'go'

// localStorage keys for workflow persistence
const STORAGE_KEYS = {
  BRAINSTORM_CONTENT: 'codelab_brainstorm_content',
  PROJECT_NAME: 'codelab_project_name',
  LANGUAGE: 'codelab_language',
  PARSED_STEPS: 'codelab_parsed_steps',
} as const

interface ParsedStep {
  number: number
  title: string
  tasks: Array<{ title: string; description?: string }>
}

interface WorkflowContextType {
  brainstormContent: string | null
  suggestedProjectName: string | null
  suggestedLanguage: Language | null
  parsedSteps: ParsedStep[]
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

/**
 * Parse steps from LAB_OPPORTUNITY.md content
 * Extracts step number, title, and tasks from markdown
 * Supports both formats:
 * - Standard: ## Step N: Title
 * - MCP format: • Step N: Title or Step N: Title
 */
function parseStepsFromOpportunity(content: string): ParsedStep[] {
  try {
    const steps: ParsedStep[] = []

    // Try multiple step header formats
    // Format 1: ## Step N: Title (standard markdown)
    // Format 2: • Step N: Title (MCP bullet format)
    // Format 3: Step N: Title (plain format)
    const stepRegex = /(?:^|\n)(?:##\s*|•\s*)?Step\s+(\d+):\s*(.+?)(?=\n|$)/gi
    const matches = [...content.matchAll(stepRegex)]

    for (const match of matches) {
      const stepNumber = parseInt(match[1], 10)
      const stepTitle = match[2].trim()

      // Find the section content for this step
      const stepIndex = match.index!
      const nextStepMatch = matches[matches.indexOf(match) + 1]
      const sectionEnd = nextStepMatch ? nextStepMatch.index! : content.length
      const sectionContent = content.substring(stepIndex, sectionEnd)

      // Parse tasks from the section
      // Support multiple task formats:
      // - **Title**: Description
      // - Title
      // 1. Title - Description (numbered with description)
      // Note: Only match lines that start at beginning (^) to avoid nested bullets
      const taskRegex = /^(?:[-•]\s*\*\*(.+?)\*\*(?::\s*(.+))?|[-•]\s*(.+)|(\d+)\.\s*(.+?)\s*(?:-\s*(.+))?)$/gm
      const taskMatches = [...sectionContent.matchAll(taskRegex)]

      const seenTasks = new Set<string>()
      const tasks = taskMatches
        .map(taskMatch => {
          // Extract title and description from different formats
          let title: string | undefined
          let description: string | undefined

          if (taskMatch[1]) {
            // Bold format: - **Title**: Description
            title = taskMatch[1]
            description = taskMatch[2]
          } else if (taskMatch[3]) {
            // Bullet format: - Title or • Title
            title = taskMatch[3]
          } else if (taskMatch[5]) {
            // Numbered format: 1. Title - Description
            title = taskMatch[5]
            description = taskMatch[6]
          }

          if (!title) return null

          // Clean up title
          title = title.trim()

          // Skip if:
          // - Too short (< 3 chars)
          // - Contains "step" (likely the step header)
          // - Already seen (duplicate)
          // - Contains only "Objectives" or generic words
          if (
            title.length < 3 ||
            title.toLowerCase().includes('step ') ||
            seenTasks.has(title.toLowerCase()) ||
            /^(objectives?|tasks?)$/i.test(title)
          ) {
            return null
          }

          seenTasks.add(title.toLowerCase())

          return {
            title,
            description: description?.trim()
          }
        })
        .filter((task): task is NonNullable<typeof task> => task !== null)
        .slice(0, 10) // Limit to max 10 tasks

      steps.push({
        number: stepNumber,
        title: stepTitle,
        tasks: tasks.length > 0 ? tasks : []
      })
    }

    return steps
  } catch (error) {
    console.error('Error parsing steps from opportunity:', error)
    return []
  }
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [brainstormContent, setBrainstormContentState] = useState<string | null>(null)
  const [suggestedProjectName, setSuggestedProjectName] = useState<string | null>(null)
  const [suggestedLanguage, setSuggestedLanguage] = useState<Language | null>(null)
  const [parsedSteps, setParsedSteps] = useState<ParsedStep[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedContent = localStorage.getItem(STORAGE_KEYS.BRAINSTORM_CONTENT)
        const savedProjectName = localStorage.getItem(STORAGE_KEYS.PROJECT_NAME)
        const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE)
        const savedSteps = localStorage.getItem(STORAGE_KEYS.PARSED_STEPS)

        if (savedContent) {
          setBrainstormContentState(savedContent)
        }
        if (savedProjectName) {
          setSuggestedProjectName(savedProjectName)
        }
        if (savedLanguage) {
          setSuggestedLanguage(savedLanguage as Language)
        }
        if (savedSteps) {
          setParsedSteps(JSON.parse(savedSteps))
        }
      } catch (error) {
        console.error('Error loading workflow from localStorage:', error)
      } finally {
        setIsHydrated(true)
      }
    }
  }, [])

  const setBrainstormContent = (content: string | null) => {
    setBrainstormContentState(content)

    if (content) {
      const projectName = extractProjectName(content)
      const language = detectLanguage(content)
      const steps = parseStepsFromOpportunity(content)

      setSuggestedProjectName(projectName)
      setSuggestedLanguage(language)
      setParsedSteps(steps)

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.BRAINSTORM_CONTENT, content)
          if (projectName) localStorage.setItem(STORAGE_KEYS.PROJECT_NAME, projectName)
          if (language) localStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
          if (steps.length > 0) localStorage.setItem(STORAGE_KEYS.PARSED_STEPS, JSON.stringify(steps))
        } catch (error) {
          console.error('Error saving workflow to localStorage:', error)
        }
      }
    } else {
      setSuggestedProjectName(null)
      setSuggestedLanguage(null)
      setParsedSteps([])

      // Clear from localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(STORAGE_KEYS.BRAINSTORM_CONTENT)
          localStorage.removeItem(STORAGE_KEYS.PROJECT_NAME)
          localStorage.removeItem(STORAGE_KEYS.LANGUAGE)
          localStorage.removeItem(STORAGE_KEYS.PARSED_STEPS)
        } catch (error) {
          console.error('Error clearing workflow from localStorage:', error)
        }
      }
    }
  }

  const clearWorkflow = () => {
    setBrainstormContentState(null)
    setSuggestedProjectName(null)
    setSuggestedLanguage(null)
    setParsedSteps([])

    // Clear from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEYS.BRAINSTORM_CONTENT)
        localStorage.removeItem(STORAGE_KEYS.PROJECT_NAME)
        localStorage.removeItem(STORAGE_KEYS.LANGUAGE)
        localStorage.removeItem(STORAGE_KEYS.PARSED_STEPS)
      } catch (error) {
        console.error('Error clearing workflow from localStorage:', error)
      }
    }
  }

  return (
    <WorkflowContext.Provider
      value={{
        brainstormContent,
        suggestedProjectName,
        suggestedLanguage,
        parsedSteps,
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
