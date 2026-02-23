import { z } from 'zod'

export const brainstormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  learningObjectives: z
    .array(z.string().min(10, 'Each objective must be at least 10 characters'))
    .min(1, 'At least one learning objective is required')
    .max(10, 'Maximum 10 learning objectives allowed'),
  skillPath: z.string().optional(),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  duration: z.string().optional(),
  technology: z.string().optional(),
  provider: z.enum(['anthropic', 'openai', 'google', 'template']).default('template'),
})

export const scaffoldSchema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  language: z.enum(['typescript', 'csharp', 'go']),
  opportunityPath: z.string().optional(),
  opportunityContent: z.string().optional(),
})

export type BrainstormFormData = z.infer<typeof brainstormSchema>
export type ScaffoldFormData = z.infer<typeof scaffoldSchema>
