/**
 * Core types for scaffold generation
 * These types will be shared when extracted to a library
 */

export interface ScaffoldConfig {
  projectName: string
  language: 'typescript' | 'csharp' | 'go'
  opportunityContent?: string
}

export interface GeneratedFile {
  path: string
  content: string
}

export interface ScaffoldResult {
  files: GeneratedFile[]
  message: string
}

export interface ScaffoldGenerator {
  generate(config: ScaffoldConfig): Promise<ScaffoldResult>
}
