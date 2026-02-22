import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { WorkflowProvider } from '@/contexts/WorkflowContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WorkflowProvider>
      <div className="flex flex-col min-h-screen bg-bg-secondary">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </WorkflowProvider>
  )
}
