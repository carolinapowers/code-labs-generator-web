'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
        'relative border-r border-gray-200 bg-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Navigation */}
      <nav className={cn('p-6 space-y-2', isCollapsed && 'p-3')}>
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
                  ? 'bg-ps-orange text-white'
                  : item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
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
                    isActive ? 'text-white/80' : 'text-gray-500'
                  )}>
                    {item.description}
                  </div>
                </>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
