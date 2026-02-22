'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { scaffoldSchema, type ScaffoldFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LANGUAGE_OPTIONS } from '@/lib/constants'

interface Props {
  onSubmit: (data: ScaffoldFormData) => Promise<void>
  isLoading?: boolean
  initialOpportunityContent?: string | null
  initialProjectName?: string | null
  initialLanguage?: 'typescript' | 'csharp' | 'go' | null
}

export function ProjectConfigForm({
  onSubmit,
  isLoading,
  initialOpportunityContent,
  initialProjectName,
  initialLanguage
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ScaffoldFormData>({
    resolver: zodResolver(scaffoldSchema),
    defaultValues: {
      projectName: initialProjectName || '',
      language: initialLanguage || 'typescript',
      opportunityPath: '',
      opportunityContent: initialOpportunityContent || '',
    },
  })

  // Update form values when initial values change
  useEffect(() => {
    if (initialProjectName) {
      setValue('projectName', initialProjectName)
    }
  }, [initialProjectName, setValue])

  useEffect(() => {
    if (initialLanguage) {
      setValue('language', initialLanguage)
    }
  }, [initialLanguage, setValue])

  useEffect(() => {
    if (initialOpportunityContent) {
      setValue('opportunityContent', initialOpportunityContent)
    }
  }, [initialOpportunityContent, setValue])

  const selectedLanguage = watch('language')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="projectName">Project Name *</Label>
        <Input
          id="projectName"
          {...register('projectName')}
          placeholder="e.g., my-code-lab-project"
          className="mt-2"
        />
        {errors.projectName && (
          <p className="text-sm text-ps-error mt-1">{errors.projectName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="language">Language *</Label>
        <div className="mt-3 grid grid-cols-3 gap-4">
          {LANGUAGE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`
                flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                ${
                  selectedLanguage === option.value
                    ? 'border-ps-orange bg-ps-orange/5'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                value={option.value}
                {...register('language')}
                className="sr-only"
              />
              <div className="text-2xl mb-2">
                {option.value === 'typescript' && '⚛️'}
                {option.value === 'csharp' && '🔷'}
                {option.value === 'go' && '🐹'}
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.language && (
          <p className="text-sm text-ps-error mt-1">{errors.language.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="opportunityPath">
          LAB_OPPORTUNITY.md File Path (Optional)
        </Label>
        <Input
          id="opportunityPath"
          {...register('opportunityPath')}
          placeholder="e.g., ./LAB_OPPORTUNITY.md"
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Path to an existing LAB_OPPORTUNITY.md file on your filesystem
        </p>
        {errors.opportunityPath && (
          <p className="text-sm text-ps-error mt-1">
            {errors.opportunityPath.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="opportunityContent">
          LAB_OPPORTUNITY.md Content (Optional)
        </Label>
        <Textarea
          id="opportunityContent"
          {...register('opportunityContent')}
          placeholder="Paste your LAB_OPPORTUNITY.md content here, or it will be pre-filled if you used the Brainstorm workflow..."
          className="mt-2 min-h-[200px] font-mono text-xs"
        />
        <p className="text-sm text-gray-500 mt-1">
          Direct markdown content for the Code Lab opportunity. This will be used instead of the file path if provided.
        </p>
        {errors.opportunityContent && (
          <p className="text-sm text-ps-error mt-1">
            {errors.opportunityContent.message}
          </p>
        )}
      </div>

      <div className="pt-4 border-t">
        <Button type="submit" size="lg" disabled={isLoading} className="w-full">
          {isLoading ? 'Scaffolding Project...' : 'Scaffold Project'}
        </Button>
      </div>
    </form>
  )
}