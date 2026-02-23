'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus } from 'lucide-react'

export interface StepDetailsFormData {
  stepNumber: number
  title: string
  tasks: string[]
}

interface StepDetailsFormProps {
  onSubmit: (data: StepDetailsFormData) => void
  submitLabel?: string
  loading?: boolean
}

export function StepDetailsForm({
  onSubmit,
  submitLabel = 'Generate',
  loading = false
}: StepDetailsFormProps) {
  const [stepNumber, setStepNumber] = useState<number>(2)
  const [title, setTitle] = useState<string>('')
  const [tasks, setTasks] = useState<string[]>([''])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addTask = () => {
    if (tasks.length < 10) {
      setTasks([...tasks, ''])
    }
  }

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index))
    }
  }

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks]
    newTasks[index] = value
    setTasks(newTasks)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepNumber < 2 || stepNumber > 20) {
      newErrors.stepNumber = 'Step number must be between 2 and 20'
    }

    if (title.length < 5 || title.length > 200) {
      newErrors.title = 'Title must be between 5 and 200 characters'
    }

    const validTasks = tasks.filter(t => t.trim().length >= 3)
    if (validTasks.length === 0) {
      newErrors.tasks = 'At least one task with 3+ characters is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // Filter out empty tasks
    const validTasks = tasks.filter(t => t.trim().length >= 3)

    onSubmit({
      stepNumber,
      title: title.trim(),
      tasks: validTasks,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Number */}
      <div>
        <Label htmlFor="stepNumber">Step Number</Label>
        <Input
          id="stepNumber"
          type="number"
          min={2}
          max={20}
          value={stepNumber}
          onChange={(e) => setStepNumber(parseInt(e.target.value))}
          className="mt-1"
        />
        {errors.stepNumber && (
          <p className="text-sm text-status-error mt-1">{errors.stepNumber}</p>
        )}
        <p className="text-xs text-text-muted mt-1">
          Step numbers typically start at 2 (Step 1 is usually the introduction)
        </p>
      </div>

      {/* Step Title */}
      <div>
        <Label htmlFor="title">Step Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Create Your First Component"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
        {errors.title && (
          <p className="text-sm text-status-error mt-1">{errors.title}</p>
        )}
        <p className="text-xs text-text-muted mt-1">
          A clear, concise title describing what the learner will accomplish
        </p>
      </div>

      {/* Tasks */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Tasks</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTask}
            disabled={tasks.length >= 10}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="text"
                placeholder={`Task ${index + 1}`}
                value={task}
                onChange={(e) => updateTask(index, e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeTask(index)}
                disabled={tasks.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {errors.tasks && (
          <p className="text-sm text-status-error mt-1">{errors.tasks}</p>
        )}
        <p className="text-xs text-text-muted mt-1">
          Add 1-10 tasks that the learner will complete in this step
        </p>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Generating...' : submitLabel}
      </Button>
    </form>
  )
}
