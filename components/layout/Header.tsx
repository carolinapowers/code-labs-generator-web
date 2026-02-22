'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { MCPStatus } from './MCPStatus'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
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
          <ThemeToggle />
          <MCPStatus />
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
