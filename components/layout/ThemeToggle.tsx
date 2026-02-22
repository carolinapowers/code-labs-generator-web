'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
  ]

  return (
    <div className="flex items-center gap-1 rounded-lg bg-bg-secondary p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            theme === value
              ? 'bg-accent-orange text-white shadow-sm dark:bg-accent-primary'
              : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
          )}
          aria-label={`Switch to ${label} mode`}
          title={`${label} mode`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}
