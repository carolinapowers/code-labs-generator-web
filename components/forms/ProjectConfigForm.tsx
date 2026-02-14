'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { scaffoldSchema, type ScaffoldFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LANGUAGE_OPTIONS } from '@/lib/constants'

interface Props {
  onSubmit: (data: ScaffoldFormData) => Promise<void>
  isLoading?: boolean
}

export function ProjectConfigForm({ onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ScaffoldFormData>({
    resolver: zodResolver(scaffoldSchema),
    defaultValues: {
      projectName: '',
      language: 'typescript',
      opportunityPath: '',
    },
  })

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
          LAB_OPPORTUNITY.md Path (Optional)
        </Label>
        <Input
          id="opportunityPath"
          {...register('opportunityPath')}
          placeholder="e.g., ./LAB_OPPORTUNITY.md"
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Path to an existing LAB_OPPORTUNITY.md file to base the project on
        </p>
        {errors.opportunityPath && (
          <p className="text-sm text-ps-error mt-1">
            {errors.opportunityPath.message}
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