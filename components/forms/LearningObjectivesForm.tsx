'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { brainstormSchema, type BrainstormFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  onSubmit: (data: BrainstormFormData) => Promise<void>
  isLoading?: boolean
}

export function LearningObjectivesForm({ onSubmit, isLoading }: Props) {
  const [objectives, setObjectives] = useState<string[]>([''])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrainstormFormData>({
    resolver: zodResolver(brainstormSchema),
    defaultValues: {
      title: '',
      learningObjectives: [''],
      skillPath: '',
      skillLevel: 'Intermediate',
      duration: '45-60 minutes',
      technology: '',
    },
  })

  const addObjective = () => {
    setObjectives([...objectives, ''])
  }

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      const newObjectives = objectives.filter((_, i) => i !== index)
      setObjectives(newObjectives)
    }
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives]
    newObjectives[index] = value
    setObjectives(newObjectives)
  }

  const handleFormSubmit = (data: BrainstormFormData) => {
    // Filter out empty objectives
    const filteredObjectives = objectives.filter(obj => obj.trim() !== '')
    onSubmit({ ...data, learningObjectives: filteredObjectives })
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
