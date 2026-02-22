'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { brainstormSchema, type BrainstormFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useProviderAvailability } from '@/hooks/useProviderAvailability'

interface Props {
  onSubmit: (data: BrainstormFormData) => Promise<void>
  isLoading?: boolean
}

export function LearningObjectivesForm({ onSubmit, isLoading }: Props) {
  const [objectives, setObjectives] = useState<string[]>([''])
  const { providers, defaultProvider, availableProviders } = useProviderAvailability()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(brainstormSchema),
    defaultValues: {
      title: '',
      learningObjectives: [''],
      skillPath: '',
      skillLevel: 'Intermediate',
      duration: '45-60 minutes',
      technology: '',
      provider: 'template',
    },
  })

  const selectedProvider = watch('provider')

  // Initialize form value with objectives and default provider
  useEffect(() => {
    setValue('learningObjectives', objectives)
  }, [])

  // Update provider to default when available providers change
  useEffect(() => {
    if (defaultProvider) {
      setValue('provider', defaultProvider)
    }
  }, [defaultProvider, setValue])

  const addObjective = () => {
    const newObjectives = [...objectives, '']
    setObjectives(newObjectives)
    setValue('learningObjectives', newObjectives)
  }

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      const newObjectives = objectives.filter((_, i) => i !== index)
      setObjectives(newObjectives)
      setValue('learningObjectives', newObjectives)
    }
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives]
    newObjectives[index] = value
    setObjectives(newObjectives)
    // Update form value for validation
    setValue('learningObjectives', newObjectives)
  }

  const handleFormSubmit = async (data: BrainstormFormData) => {
    // Filter out empty objectives
    const filteredObjectives = objectives.filter(obj => obj.trim() !== '')

    // Ensure at least one objective
    if (filteredObjectives.length === 0) {
      return
    }

    await onSubmit({ ...data, learningObjectives: filteredObjectives })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Code Lab Title *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., Building an Order Form with React"
          className="mt-2"
        />
        {errors.title && (
          <p className="text-sm text-ps-error mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="technology">Technology</Label>
        <Input
          id="technology"
          {...register('technology')}
          placeholder="e.g., React, ASP.NET Core, Vue"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="skillPath">Skill Path</Label>
        <Input
          id="skillPath"
          {...register('skillPath')}
          placeholder="e.g., ASP.NET Core 10, React 18"
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="skillLevel">Skill Level</Label>
          <select
            id="skillLevel"
            {...register('skillLevel')}
            className="mt-2 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ps-orange"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <select
            id="duration"
            {...register('duration')}
            className="mt-2 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ps-orange"
          >
            <option value="15-30 minutes">15-30 minutes</option>
            <option value="30-45 minutes">30-45 minutes</option>
            <option value="45-60 minutes">45-60 minutes</option>
            <option value="60+ minutes">60+ minutes</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="provider">AI Provider</Label>
        <select
          id="provider"
          {...register('provider')}
          className="mt-2 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ps-orange disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {providers.map((provider) => (
            <option
              key={provider.id}
              value={provider.id}
              disabled={!provider.available}
            >
              {provider.name}
              {!provider.available && ' (API key required)'}
            </option>
          ))}
        </select>

        {/* Provider description and status */}
        {selectedProvider && (() => {
          const currentProvider = providers.find(p => p.id === selectedProvider)
          return (
            <div className="mt-2">
              {currentProvider?.available ? (
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-2 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {currentProvider.description}
                    {selectedProvider === 'template' && ' - No API key needed'}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>
                    This provider requires an API key. Configure {currentProvider?.name} API key in{' '}
                    <a href="/dashboard/settings" className="underline font-medium">Settings</a>{' '}
                    to use this option.
                  </span>
                </div>
              )}
            </div>
          )
        })()}

        {availableProviders.length === 1 && availableProviders[0].id === 'template' && (
          <div className="mt-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md p-2">
            💡 <strong>Tip:</strong> Add LLM provider API keys in{' '}
            <a href="/dashboard/settings" className="underline font-medium">Settings</a>{' '}
            to unlock AI-powered content generation with better customization and quality.
          </div>
        )}
      </div>

      <div>
        <Label>Learning Objectives *</Label>
        <p className="text-sm text-gray-500 mt-1 mb-3">
          What should learners be able to do after completing this Code Lab?
        </p>
        <div className="space-y-3">
          {objectives.map((obj, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={obj}
                onChange={(e) => updateObjective(index, e.target.value)}
                placeholder={`Objective ${index + 1}: e.g., Understand how to create forms with validation`}
                className="flex-1"
                rows={2}
              />
              {objectives.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeObjective(index)}
                  className="shrink-0"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors.learningObjectives && (
          <p className="text-sm text-ps-error mt-1">{errors.learningObjectives.message}</p>
        )}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addObjective}
          className="mt-3"
          disabled={objectives.length >= 10}
        >
          + Add Objective
        </Button>
      </div>

      <div className="pt-4 border-t">
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Generating...' : 'Generate LAB_OPPORTUNITY.md'}
        </Button>
      </div>
    </form>
  )
}
