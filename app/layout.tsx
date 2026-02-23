import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { WorkflowProvider } from '@/contexts/WorkflowContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Code Labs Generator',
  description: 'Web interface for the Code Lab MCP Server - Automate Code Lab creation with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <ThemeProvider>
            <QueryProvider>
              <WorkflowProvider>{children}</WorkflowProvider>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
