'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

const navigation = [
  {
    name: 'Brainstorm',
    href: '/dashboard/brainstorm',
    description: 'Generate LAB_OPPORTUNITY.md from learning objectives',
    icon: '💡',
  },
  {
    name: 'Scaffold',
    href: '/dashboard/scaffold',
    description: 'Scaffold project structure from LAB_OPPORTUNITY.md',
    icon: '🏗️',
  },
  {
    name: 'Develop',
    href: '/dashboard/develop',
    description: 'Coming soon - Create steps and tests',
    icon: '⚙️',
    disabled: true,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'relative flex flex-col h-full border-r border-border-default bg-bg-sidebar transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border-default bg-bg-primary shadow-sm hover:bg-bg-secondary transition-colors"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-text-secondary" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-text-secondary" />
        )}
      </button>

      {/* Navigation */}
      <nav className={cn('p-6 space-y-2 flex-1 overflow-y-auto', isCollapsed && 'p-3')}>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'block rounded-lg text-sm font-medium transition-colors',
                isCollapsed ? 'px-2 py-3' : 'px-4 py-3',
                isActive
                  ? 'bg-accent-orange text-white dark:bg-accent-hover'
                  : item.disabled
                  ? 'text-text-muted cursor-not-allowed'
                  : 'text-text-primary hover:bg-bg-tertiary'
              )}
              onClick={(e) => item.disabled && e.preventDefault()}
              title={isCollapsed ? item.name : undefined}
            >
              {isCollapsed ? (
                <div className="flex justify-center text-xl">
                  {item.icon}
                </div>
              ) : (
                <>
                  <div className="font-semibold flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    {item.name}
                  </div>
                  <div className={cn(
                    'text-xs mt-1',
                    isActive ? 'text-white/80' : 'text-text-secondary'
                  )}>
                    {item.description}
                  </div>
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Theme Toggle at Bottom - Always visible */}
      <div className={cn(
        'border-t border-border-default p-4 flex-shrink-0',
        isCollapsed && 'p-3 flex justify-center'
      )}>
        <div className={cn(
          'flex items-center gap-3',
          isCollapsed && 'flex-col'
        )}>
          <ThemeToggle />
          {!isCollapsed && (
            <span className="text-xs text-text-muted">Theme</span>
          )}
        </div>
      </div>
    </div>
  )
}
