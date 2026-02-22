import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Welcome to Code Labs Generator</h1>
      <p className="text-lg text-text-secondary mb-8">
        Automate the creation of Code Labs with AI. Get started by selecting a workflow from the sidebar.
      </p>

      <div className="grid gap-6 md:grid-cols-1">
        <Link
          href="/dashboard/brainstorm"
          className="block p-6 bg-bg-card rounded-lg border border-border-default hover:border-accent-orange transition-colors"
        >
          <h3 className="text-xl font-semibold text-text-primary mb-2">Brainstorm Workflow</h3>
          <p className="text-text-secondary mb-4">
            Generate a complete LAB_OPPORTUNITY.md file from your learning objectives.
            Define what you want to teach and let AI structure it into a Code Lab plan.
          </p>
          <span className="text-accent-orange font-medium">Get Started →</span>
        </Link>

        <div className="p-6 bg-bg-tertiary rounded-lg border border-border-subtle opacity-60">
          <h3 className="text-xl font-semibold text-text-muted mb-2">Scaffold Workflow</h3>
          <p className="text-text-muted mb-4">
            Coming soon - Scaffold a complete project structure with files, tests, and configuration.
          </p>
          <span className="text-text-muted font-medium">Coming Soon</span>
        </div>

        <div className="p-6 bg-bg-tertiary rounded-lg border border-border-subtle opacity-60">
          <h3 className="text-xl font-semibold text-text-muted mb-2">Develop Workflow</h3>
          <p className="text-text-muted mb-4">
            Coming soon - Create individual steps with tasks, tests, and solutions.
          </p>
          <span className="text-text-muted font-medium">Coming Soon</span>
        </div>
      </div>
    </div>
  )
}
