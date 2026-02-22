'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Brainstorm',
    href: '/dashboard/brainstorm',
    description: 'Generate LAB_OPPORTUNITY.md from learning objectives',
  },
  {
    name: 'Scaffold',
    href: '/dashboard/scaffold',
    description: 'Scaffold project structure from LAB_OPPORTUNITY.md',
  },
  {
    name: 'Develop',
    href: '/dashboard/develop',
    description: 'Coming soon - Create steps and tests',
    disabled: true,
  },
]

const secondaryNavigation = [
  {
    name: 'Settings',
    href: '/dashboard/settings',
    description: 'Configure LLM provider API keys',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-gray-200 bg-white p-6 flex flex-col">
      <nav className="space-y-2 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'block rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-ps-orange text-white'
                  : item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <div className="font-semibold">{item.name}</div>
              <div className={cn(
                'text-xs mt-1',
                isActive ? 'text-white/80' : 'text-gray-500'
              )}>
                {item.description}
              </div>
            </Link>
          )
        })}
      </nav>
      <nav className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        {secondaryNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'block rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-ps-orange text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <div className="font-semibold">{item.name}</div>
              <div className={cn(
                'text-xs mt-1',
                isActive ? 'text-white/80' : 'text-gray-500'
              )}>
                {item.description}
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
