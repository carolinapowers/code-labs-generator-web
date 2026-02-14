export interface BrainstormFormData {
  title: string
  learningObjectives: string[]
  skillPath?: string
  skillLevel?: string
  duration?: string
  technology?: string
}

export interface ScaffoldFormData {
  projectName: string
  language: 'typescript' | 'csharp' | 'go'
  opportunityPath?: string
}

export interface StepFormData {
  stepNumber: number
  title: string
  tasks: TaskData[]
}

export interface TaskData {
  title: string
  description?: string
}

export interface FileTreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileTreeNode[]
  content?: string
}

export interface GeneratedFile {
  path: string
  content: string
}

export interface LLMProvider {
  id: string
  name: string
  isConfigured: boolean
  costPerToken?: number
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  cost?: number
  tokensUsed?: number
}
