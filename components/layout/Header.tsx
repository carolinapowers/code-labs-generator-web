'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { MCPStatus } from './MCPStatus'
import { Button } from '@/components/ui/button'
import { useWorkflow } from '@/contexts/WorkflowContext'

export function Header() {
  const { brainstormContent, clearWorkflow } = useWorkflow()

  const handleClearWorkflow = () => {
    if (confirm('Are you sure you want to clear all workflow data? This cannot be undone.')) {
      clearWorkflow()
    }
  }

  return (
    <header className="border-b border-border-default bg-bg-primary">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-accent-orange">CL</span>
            <span className="text-xl font-semibold text-text-primary">Code Labs Generator</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <MCPStatus />
          {brainstormContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearWorkflow}
              className="text-text-secondary hover:text-status-error"
              title="Clear all workflow data"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Workflow
            </Button>
          )}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </div>
      </div>
    </header>
  )
}
