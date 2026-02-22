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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </WorkflowProvider>
  )
}
