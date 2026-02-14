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
    description: 'Coming soon - Scaffold project structure',
    disabled: true,
  },
  {
    name: 'Develop',
    href: '/dashboard/develop',
    description: 'Coming soon - Create steps and tests',
    disabled: true,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-gray-200 bg-white p-6">
      <nav className="space-y-2">
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
    </div>
  )
}
