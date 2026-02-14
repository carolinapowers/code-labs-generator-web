export const APP_NAME = 'Code Labs Generator'
export const APP_DESCRIPTION = 'Automate Code Lab creation with AI'

export const LLM_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  DEMO: 'demo',
} as const

export const LANGUAGE_OPTIONS = [
  { value: 'typescript', label: 'TypeScript (React)' },
  { value: 'csharp', label: 'C# (ASP.NET Core)' },
  { value: 'go', label: 'Go' },
] as const

export const SKILL_LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
] as const

export const DURATION_OPTIONS = [
  { value: '15-30 minutes', label: '15-30 minutes' },
  { value: '30-45 minutes', label: '30-45 minutes' },
  { value: '45-60 minutes', label: '45-60 minutes' },
  { value: '60+ minutes', label: '60+ minutes' },
] as const
