# Code Lab Generator Web MVP - Claude Code Instructions

This document guides Claude Code through building a Next.js web interface for the Code Lab MCP Server. The MVP demonstrates authentication and multi-LLM capabilities for Pluralsight interview purposes.

## Project Overview

Build a modern, production-quality web UI that showcases the Code Lab Generator MCP server's capabilities:
- Interactive workflow for creating Code Labs from learning objectives
- Live preview of generated files
- Multi-LLM provider support with cost tracking
- Authentication system
- Responsive design using Pluralsight Pando design system

**Target Audience**: Pluralsight interview interviewers
**MVP Timeline**: 5-7 days of development
**Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, Zod, Clerk Auth, Vercel AI SDK

## Why This Approach Works for Interviews

### 1. Visual Impact
Shows the power of your MCP server through an intuitive, polished UI rather than technical demonstrations. Interviewers can see the value immediately without diving into code.

### 2. Accessibility
Interviewers can test it without installing Claude Code, MCP tools, or complex dependencies. A simple URL or local demo is all they need—no technical barriers.

### 3. Value Proposition Clarity
Demonstrates exactly how this helps Pluralsight authors:
- **Time Savings**: From days of manual work to hours of AI-assisted creation
- **Consistency**: Standardized Code Lab structure every time
- **Scale**: Enables many more authors to create quality content
- **Quality**: Built-in validation and best practices

### 4. Technical Showcase
Demonstrates your full-stack capabilities:
- **Frontend**: Modern React/Next.js patterns, Tailwind, responsive design
- **Backend**: API design, MCP integration, multi-provider LLM routing
- **DevOps**: Deployment to Vercel, environment management
- **Product Thinking**: User-centric design aligned with Pluralsight standards
- **Innovation**: Leveraging cutting-edge MCP and AI capabilities

## Tech Stack & Dependencies

### Core Framework
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.5.0"
}
```

### Authentication
```json
{
  "@clerk/nextjs": "^5.6.0"
}
```

### LLM & AI
```json
{
  "ai": "^3.2.0",
  "@ai-sdk/openai": "^0.0.49",
  "@ai-sdk/anthropic": "^0.0.51",
  "@ai-sdk/google": "^0.0.35",
  "zod": "^3.22.4"
}
```

### MCP Integration
```json
{
  "use-mcp": "^0.3.0",
  "@modelcontextprotocol/sdk": "^1.0.4"
}
```

### UI & Styling
```json
{
  "@radix-ui/react-dialog": "^1.1.1",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-slot": "^2.0.2",
  "@radix-ui/react-tabs": "^1.0.4",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.2.0",
  "tailwindcss": "^3.3.0",
  "tailwindcss-animate": "^1.0.6"
}
```

### Utilities
```json
{
  "zustand": "^4.4.0",
  "react-hook-form": "^7.48.0"
}
```

### Development
```json
{
  "@types/node": "^20.0.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "@typescript-eslint/eslint-plugin": "^6.15.0",
  "@typescript-eslint/parser": "^6.15.0",
  "autoprefixer": "^10.4.16",
  "eslint": "^8.56.0",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.3.0"
}
```

## Project Structure

```
code-labs-generator-web/
├── .env.local                           # Environment variables (API keys, server URLs)
├── .env.example                         # Template for env variables
├── CLAUDE.md                            # This file
├── README.md                            # User-facing documentation
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── middleware.ts                        # Clerk auth middleware
│
├── app/
│   ├── layout.tsx                       # Root layout with providers
│   ├── page.tsx                         # Landing page
│   ├── globals.css                      # Global Tailwind styles + Pando tokens
│   ├── auth/
│   │   └── callback/page.tsx           # Clerk callback
│   ├── dashboard/
│   │   ├── layout.tsx                  # Authenticated dashboard layout
│   │   ├── page.tsx                    # Dashboard home
│   │   ├── brainstorm/
│   │   │   └── page.tsx                # Brainstorm workflow
│   │   ├── scaffold/
│   │   │   └── page.tsx                # Scaffold workflow
│   │   └── develop/
│   │       └── page.tsx                # Develop/Step creation workflow
│   └── api/
│       ├── auth/                        # Clerk auth routes
│       ├── mcp/
│       │   ├── route.ts                # MCP proxy endpoint
│       │   ├── brainstorm.ts           # Call brainstorm_lab_opportunity
│       │   ├── scaffold.ts             # Call scaffold_*_project
│       │   └── create-step.ts          # Call create_step
│       ├── llm/
│       │   ├── route.ts                # LLM routing endpoint
│       │   └── providers.ts            # Provider configuration
│       └── usage/
│           └── track.ts                # Usage analytics
│
├── components/
│   ├── ui/                              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   └── spinner.tsx
│   ├── layout/
│   │   ├── Header.tsx                  # Navigation header
│   │   ├── Sidebar.tsx                 # Dashboard sidebar
│   │   └── Footer.tsx                  # Footer with credits
│   ├── workflows/
│   │   ├── BrainstormWorkflow.tsx      # Brainstorm UI
│   │   ├── ScaffoldWorkflow.tsx        # Scaffold UI
│   │   └── DevelopWorkflow.tsx         # Develop UI
│   ├── forms/
│   │   ├── LearningObjectivesForm.tsx  # Brainstorm input form
│   │   ├── ProjectConfigForm.tsx       # Scaffold configuration
│   │   └── StepCreationForm.tsx        # Step builder
│   ├── displays/
│   │   ├── FilePreview.tsx             # Display generated files
│   │   ├── FileTree.tsx                # Hierarchical file display
│   │   ├── CodeBlock.tsx               # Syntax-highlighted code
│   │   ├── MarkdownRenderer.tsx        # Render markdown files
│   │   └── LoadingState.tsx            # Loading animations
│   ├── providers/
│   │   ├── ClerkProvider.tsx           # Clerk configuration
│   │   ├── MCPProvider.tsx             # MCP client setup
│   │   ├── LLMProvider.tsx             # LLM routing context
│   │   └── ThemeProvider.tsx           # Dark mode support
│   ├── auth/
│   │   ├── LoginPage.tsx               # Login UI
│   │   ├── SignupPage.tsx              # Signup UI
│   │   └── UserMenu.tsx                # User profile dropdown
│   └── demo/
│       ├── DemoData.tsx                # Mock data for offline demo
│       └── DemoMode.tsx                # Demo mode toggle component
│
├── lib/
│   ├── mcp-client.ts                   # MCP server connection logic
│   ├── llm-router.ts                   # Multi-provider LLM routing
│   ├── api-client.ts                   # Typed fetch wrapper
│   ├── validators.ts                   # Zod schemas for all forms
│   ├── constants.ts                    # App-wide constants
│   ├── types.ts                        # TypeScript interfaces
│   └── utils.ts                        # Helper functions
│
├── hooks/
│   ├── useMCP.ts                       # MCP integration hook
│   ├── useLLM.ts                       # LLM provider selection
│   ├── useAuth.ts                      # Clerk auth helpers
│   ├── useWorkflow.ts                  # Workflow state management
│   └── useUsageTracking.ts             # Track API usage
│
├── store/
│   ├── authStore.ts                    # User auth state
│   ├── workflowStore.ts                # Workflow progress
│   ├── llmStore.ts                     # LLM provider selection
│   └── uiStore.ts                      # UI state (theme, modals, etc)
│
├── styles/
│   └── pando-tokens.css                # Pluralsight Pando design tokens
│
├── public/
│   ├── logo.svg                        # Pluralsight logo
│   ├── favicon.ico
│   └── demo/
│       ├── sample-opportunity.json     # Demo LAB_OPPORTUNITY.md
│       └── sample-project.json         # Demo scaffolded project
│
└── __tests__/
    ├── unit/
    │   ├── validators.test.ts
    │   └── llm-router.test.ts
    └── integration/
        └── workflows.test.ts
```

## Development Setup

### Prerequisites
- Node.js 18+ (recommend 20 LTS)
- Git
- Visual Studio Code (recommended)
- MCP Server running locally (`npm run dev` in code-lab-mcp-server project)

### Initial Setup

1. **Create project directory**
   ```bash
   mkdir -p /Users/carolinapowers/Repos/code-labs-generator-web
   cd code-labs-generator-web
   ```

2. **Initialize Next.js project**
   ```bash
   npx create-next-app@latest . \
     --typescript \
     --tailwind \
     --app \
     --no-eslint \
     --no-src-dir \
     --import-alias '@/*'
   ```

3. **Install dependencies**
   ```bash
   npm install @clerk/nextjs \
     ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google \
     use-mcp @modelcontextprotocol/sdk \
     zustand react-hook-form \
     @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
     @radix-ui/react-select @radix-ui/react-tabs \
     class-variance-authority clsx tailwind-merge \
     tailwindcss-animate

   npm install --save-dev @types/node @types/react @types/react-dom \
     @typescript-eslint/eslint-plugin @typescript-eslint/parser \
     eslint
   ```

4. **Configure environment variables**
   ```bash
   # .env.local
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
   CLERK_SECRET_KEY=your_secret_here
   NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3001
   OPENAI_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   NEXT_PUBLIC_DEMO_MODE=true
   ```

5. **Create configuration files**
   - Update `tailwind.config.js` with Pando design tokens
   - Create `middleware.ts` for Clerk auth
   - Set up `tsconfig.json` with strict mode

## Core Architecture

### Authentication Flow
```
User → Clerk Sign-In → Callback → Dashboard
                    ↓
              JWT Token (httpOnly cookie)
                    ↓
              Protected API Routes
```

### MCP Integration Flow
```
User Form → API Route → MCP Client → Local MCP Server
                      ↓
                  LLM Router
                      ↓
             Selected LLM Provider
                      ↓
                Response → File Preview
```

### LLM Routing Logic
```
User selects provider (or auto-select)
           ↓
Route to corresponding API
           ↓
Provider-specific formatting
           ↓
Send to LLM
           ↓
Parse & validate response
           ↓
Return to UI
```

## Implementation Priority

### Phase 1: Core Infrastructure (Days 1-2)

**Day 1: Foundation**
1. **Project Setup** - Next.js, dependencies, Clerk keys configured
2. **Landing Page** - Simple intro with login/signup buttons
3. **Clerk Authentication** - Sign up, sign in, sign out flows
4. **Protected Routes** - Middleware enforcing auth

**Day 2: Dashboard Shell**
1. **Dashboard Layout** - Header, sidebar, main content area
2. **Navigation** - Links to brainstorm/scaffold/develop workflows
3. **MCP Connection Test** - Verify local server connection
4. **Basic Error Handling** - User-friendly error messages
5. **Dark Mode Toggle** - Theme switching with Tailwind

**Key Milestone**: Authenticated user can navigate to empty workflows

### Phase 2: Brainstorm Workflow (Days 2-3)

**Day 2-3: Complete Workflow**
1. **Learning Objectives Form** - Dynamic add/remove objectives with Zod validation
2. **Form Controls** - Title input, skill path, duration selectors
3. **MCP Integration** - Call `brainstorm_lab_opportunity` tool
4. **Live Preview** - Split-screen showing LAB_OPPORTUNITY.md output
5. **Markdown Rendering** - Display generated markdown with syntax highlighting
6. **Loading States** - Spinner during API calls
7. **Error Handling** - User-friendly error messages if generation fails

**Key Milestone**: Can input objectives and generate full LAB_OPPORTUNITY.md

### Phase 3: Scaffold Workflow (Days 3-4)

**Day 3: Scaffold Interface**
1. **Project Configuration Form** - Name, language dropdown, project type
2. **Language Selector** - TypeScript, C#, Go with icons
3. **Form Validation** - Required field checks

**Day 4: File Display**
1. **File Tree Component** - Hierarchical display of generated files
2. **File Previewer** - Click to view file contents
3. **Syntax Highlighting** - Code with proper formatting
4. **Copy Buttons** - Copy individual files or entire structure
5. **MCP Integration** - Call appropriate scaffold tool

**Key Milestone**: Can scaffold complete project and view all generated files

### Phase 4: Develop Workflow (Day 4)

1. **Step Creation Form** - Step number, title, task list builder
2. **Task Management** - Add/remove tasks dynamically
3. **MCP Integration** - Call `create_step` tool
4. **Test Runner UI** - Display test execution results
5. **Solution Preview** - Show generated SOLUTION{N}.md
6. **File Display** - Show created test files and step content

**Key Milestone**: Can create complete step with tests and solution

### Phase 5: Multi-LLM & Polish (Days 5-6)

**Day 5: LLM Integration**
1. **LLM Provider Selector** - Dropdown: OpenAI, Claude, Gemini, Demo
2. **Provider Status** - Show API key configured/missing
3. **Cost Tracker** - Display estimated cost for each operation
4. **Provider Auto-select** - Choose cheapest option for simple tasks
5. **Demo Mode Toggle** - Use mock responses if no API keys

**Day 6: Polish & Optimization**
1. **Loading States** - Skeleton screens, spinners, progress bars
2. **Error Messages** - Context-specific guidance (MCP not running, API key missing, etc.)
3. **Tooltips** - Help text for form fields
4. **Responsive Design** - Mobile, tablet, desktop views work perfectly
5. **Performance** - Lazy loading, code splitting
6. **Accessibility** - ARIA labels, keyboard navigation

**Key Milestone**: App fully functional, polished, and mobile-responsive

### Phase 6: Deployment & Demo Prep (Day 7)

**Morning: Deployment**
1. **Environment Variables** - Configure all API keys for Vercel
2. **Vercel Deployment** - Deploy and verify production build
3. **DNS/Domain** - Custom URL if available
4. **Health Checks** - Test all workflows on deployed version

**Afternoon: Demo Preparation**
1. **Pre-filled Demo Data** - Sample objectives, projects ready to go
2. **Recorded Backup** - Screen recording of full demo (YouTube unlisted)
3. **Demo Script** - Talking points for each section
4. **Presentation Materials** - Screenshot collection for slides
5. **Troubleshooting Guide** - Solutions for common issues

**Key Milestone**: Ready to demonstrate to Pluralsight interviewers

## Design System Integration (Pluralsight Pando)

### Color Palette
```css
/* Primary Colors */
--color-orange: #E77B33;          /* Pluralsight orange */
--color-neutral-900: #1A1A1A;     /* Dark text */
--color-neutral-100: #F5F5F5;     /* Light backgrounds */

/* Status Colors */
--color-success: #6AC56F;
--color-warning: #FFB900;
--color-error: #E85D5D;
--color-info: #0066CC;
```

### Typography
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Scale */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
```

### Spacing
```css
/* 8px base grid */
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

### Component Patterns
- **Buttons**: Primary (orange), Secondary (neutral), Tertiary (ghost)
- **Cards**: White background, subtle shadow, rounded corners (8px)
- **Forms**: Consistent label styling, clear input states (focus, error, disabled)
- **Modals**: Centered, overlay with blur, close button
- **Alerts**: Color-coded with icons, dismissible

See `styles/pando-tokens.css` for complete implementation.

## Key Components Details

### BrainstormWorkflow Component
```typescript
// Inputs
- title: string
- learningObjectives: string[]
- skillPath?: string
- duration?: string

// Outputs
- LAB_OPPORTUNITY.md content
- File preview
- Next step suggestion

// Features
- Accordion for objectives
- Real-time character count
- Generate button with loading state
- Copy-to-clipboard for output
```

### ScaffoldWorkflow Component
```typescript
// Inputs
- projectName: string
- language: 'typescript' | 'csharp' | 'go'
- projectType: string

// Outputs
- Scaffolded project files
- Directory structure tree
- Ready-to-use project layout

// Features
- Language selector with icons
- Project type templates
- File tree with syntax highlighting
- "Copy project" functionality
```

### DevelopWorkflow Component
```typescript
// Inputs
- stepNumber: number
- title: string
- tasks: Task[]

// Outputs
- STEP{N}.md content
- SOLUTION{N}.md template
- Generated test file
- Test execution results

// Features
- Task list builder (add/remove)
- Step preview
- Run tests button
- Test results display
```

## API Routes Reference

### `/api/mcp/brainstorm` (POST)
```typescript
// Request
{
  title: string
  learningObjectives: string[]
  skillPath?: string
  duration?: string
  llmProvider?: string
}

// Response
{
  success: boolean
  content: string  // LAB_OPPORTUNITY.md
  cost: number
  tokensUsed: number
}
```

### `/api/mcp/scaffold` (POST)
```typescript
// Request
{
  projectName: string
  language: 'typescript' | 'csharp' | 'go'
  projectType: string
  opportunityPath?: string
}

// Response
{
  success: boolean
  files: Array<{ path: string, content: string }>
  fileTree: FileTreeNode
  cost: number
}
```

### `/api/mcp/create-step` (POST)
```typescript
// Request
{
  stepNumber: number
  title: string
  tasks: Array<{ title: string, description?: string }>
}

// Response
{
  success: boolean
  files: Array<{ path: string, content: string }>
  tests: TestResult[]
  cost: number
}
```

### `/api/llm/route` (POST)
```typescript
// Request
{
  prompt: string
  provider: 'openai' | 'anthropic' | 'google'
  model?: string
  stream?: boolean
}

// Response (streaming or direct)
{
  content: string
  tokensUsed: number
  cost: number
}
```

## Code Patterns & Standards

### Component Structure
```typescript
import { FC } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  title: string
  onAction: () => void
}

export const MyComponent: FC<Props> = ({ title, onAction }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  )
}
```

### Form Validation with Zod
```typescript
import { z } from 'zod'

export const brainstormSchema = z.object({
  title: z.string().min(5).max(200),
  learningObjectives: z.array(z.string().min(10)).min(1).max(10),
  skillPath: z.string().optional(),
  duration: z.string().optional()
})

type BrainstormFormData = z.infer<typeof brainstormSchema>
```

### API Route Pattern
```typescript
import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    // Validate with Zod
    // Call MCP server
    // Track usage
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
```

### Hook Pattern
```typescript
import { useCallback, useState } from 'react'

export const useWorkflow = () => {
  const [state, setState] = useState({
    current: 'brainstorm',
    completed: []
  })

  const moveToNext = useCallback(() => {
    setState(prev => ({
      ...prev,
      completed: [...prev.completed, prev.current]
    }))
  }, [])

  return { state, moveToNext }
}
```

## Error Handling

### User-Facing Errors
```typescript
// Show user-friendly messages
const errorMessages = {
  MCP_CONNECTION_FAILED: 'Unable to connect to Code Lab server. Ensure it\'s running.',
  LLM_API_ERROR: 'LLM provider error. Please try another provider.',
  VALIDATION_FAILED: 'Please check your inputs and try again.',
  AUTH_REQUIRED: 'You must be logged in to perform this action.'
}
```

### Logging & Monitoring
```typescript
// Log to console in development
// Send to monitoring service in production (e.g., Sentry)
export const logError = (error: Error, context: string) => {
  console.error(`[${context}] ${error.message}`)
  // In production: sendToMonitoring(error, context)
}
```

## Demo Mode

For offline demonstrations without API keys:
1. Create `/lib/demo-data.ts` with mock responses
2. Add `NEXT_PUBLIC_DEMO_MODE=true` to environment
3. In API routes, check for demo mode and return mock data
4. Add "Demo Mode" toggle in UI
5. Pre-populate forms with example data

## Performance Optimizations

1. **Code Splitting**: Dynamic imports for heavy components
2. **Image Optimization**: Use Next.js Image component
3. **Caching**: Cache LLM responses with query parameters
4. **Streaming**: Stream LLM responses to UI in real-time
5. **Database**: Consider caching user workflows

## Deployment (Vercel)

```bash
# Create Vercel project
npm install -g vercel
vercel login
vercel link

# Set environment variables in Vercel dashboard
# Deploy
vercel deploy --prod
```

### Environment Variables for Vercel
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
NEXT_PUBLIC_MCP_SERVER_URL=<production_mcp_server>
OPENAI_API_KEY
ANTHROPIC_API_KEY
GOOGLE_GENERATIVE_AI_API_KEY
```

## Testing Strategy

### Unit Tests
- Zod validators
- LLM router logic
- Utility functions

### Integration Tests
- API routes with mock MCP server
- Full workflows
- Authentication flow

### Manual Testing Checklist
- [ ] All three workflows work end-to-end
- [ ] Authentication flow (sign up, sign in, sign out)
- [ ] LLM provider switching works
- [ ] File previews display correctly
- [ ] Cost tracking shows accurate numbers
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Dark mode toggle works
- [ ] Demo mode works offline
- [ ] Error handling shows user-friendly messages
- [ ] Performance: Page loads < 2 seconds

## Interview Demo Script

### Opening (1 minute)
"Pluralsight Code Lab authors spend days manually creating step-by-step tutorials. This MVP demonstrates how AI and automation can reduce that to hours while maintaining consistent quality."

### Demo Flow (5 minutes)

1. **Landing Page** (15s)
   - Show login page
   - Explain authentication benefits

2. **Brainstorm Workflow** (90s)
   - Add learning objectives
   - Generate LAB_OPPORTUNITY.md
   - Show preview
   - Highlight time savings

3. **Scaffold Workflow** (90s)
   - Choose language (show TypeScript)
   - Select project type
   - Show generated file tree
   - Display sample generated files

4. **Develop Workflow** (90s)
   - Create step with tasks
   - Show generated test file
   - Display solution template

5. **Multi-LLM Demo** (60s)
   - Switch between providers
   - Show cost comparison
   - Demonstrate provider failover

### Value Proposition (2 minutes)
- Consistency: Standardized Code Lab structure
- Speed: Hours instead of days
- Scale: Enable 10x more authors
- Quality: Built-in testing and validation

### Technical Highlights (2 minutes)
- MCP protocol for tool abstraction
- Multi-provider LLM routing
- Type-safe forms with Zod
- Clean React patterns
- Pluralsight design system integration

## Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server on port 3000

# Build & Test
npm run build            # Build for production
npm run lint             # Run ESLint
npm test                 # Run tests (if configured)

# Deployment
npm run build && npm start  # Production build

# Code Quality
npm run format           # Format with Prettier
npm run type-check       # TypeScript check
```

## Troubleshooting

### MCP Server Not Connecting
- Ensure MCP server is running: `npm run dev` in code-lab-mcp-server
- Check port 3001 is accessible: `curl http://localhost:3001`
- Verify `NEXT_PUBLIC_MCP_SERVER_URL` env variable

### LLM API Key Errors
- Verify API keys in `.env.local`
- Check API key has correct permissions
- Ensure billing is active for paid providers
- Try demo mode if testing without keys

### Clerk Authentication Issues
- Verify Clerk keys in environment
- Check callback URL in Clerk dashboard
- Clear browser cookies and retry

## Key Files to Create First

1. `middleware.ts` - Clerk auth middleware
2. `lib/mcp-client.ts` - MCP connection logic
3. `lib/llm-router.ts` - Multi-provider routing
4. `app/layout.tsx` - Root layout with providers
5. `components/providers/ClerkProvider.tsx` - Clerk setup
6. `app/page.tsx` - Landing page
7. `app/dashboard/layout.tsx` - Dashboard layout
8. `app/dashboard/brainstorm/page.tsx` - First workflow

## Design Decisions

### Why Clerk for Auth?
- Free tier supports demo needs
- Simple integration with Next.js
- Built-in social login
- Can swap for custom SSO later

### Why Vercel AI SDK?
- Unified interface for multiple LLM providers
- Streaming support out of the box
- Type-safe responses
- Active maintenance

### Why Zustand for State?
- Lightweight, easy to learn
- No provider nesting required
- Perfect for interview demo scope
- Can migrate to Jotai/Redux later

### Why shadcn/ui?
- Headless components = full customization
- Matches Pluralsight design needs
- Uses Tailwind (what Pando uses)
- Easy to customize

## Deployment Options

### 1. Vercel Deployment (⭐ Recommended)

**Best for**: Interview demos, production readiness

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel login
vercel link
vercel deploy --prod
```

**Advantages:**
- One-click deployment
- Automatic HTTPS
- Edge functions support
- Environment variables managed in dashboard
- Preview deployments for testing
- Easy to share URL with interviewers

**Setup:**
1. Create Vercel account (free tier)
2. Install Vercel CLI
3. Run `vercel link` to connect project
4. Add environment variables in Vercel dashboard
5. Deploy with `vercel --prod`

### 2. Local Demo (Development)

**Best for**: Testing before deployment, offline demonstrations

```bash
# Run locally
npm run dev

# Access at http://localhost:3000
```

**Advantages:**
- Full control during demo
- No internet dependency required
- Easy to restart if needed

**Risks:**
- Internet connection issues
- MCP server connectivity problems
- Performance inconsistencies
- More technical troubleshooting during interview

### 3. Recorded Video Backup (⭐ Critical!)

**Best for**: Fallback if technical issues arise

**Create a backup recording:**

1. **Screen Recording Software**
   - macOS: QuickTime Player (built-in)
   - Windows: OBS Studio (free)
   - Cross-platform: Loom (free tier)

2. **What to Record**
   ```
   - Landing page and login flow (15 seconds)
   - Brainstorm workflow demo (90 seconds)
   - Scaffold workflow demo (90 seconds)
   - Develop workflow demo (90 seconds)
   - Multi-LLM switching (60 seconds)
   - Value proposition summary (60 seconds)
   Total: ~6 minutes
   ```

3. **Upload & Store**
   - Upload to YouTube (unlisted, only shareable via link)
   - Keep local backup on laptop
   - Share link with interviewers as backup plan

4. **When to Use**
   - Internet goes down
   - Vercel deployment unavailable
   - MCP server won't start
   - Unexpected technical issues

## Success Metrics for Interview

Your MVP demonstration should effectively communicate:

### 1. Problem Understanding ✓
Interviewers should believe you deeply understand the author pain points:
- [ ] Clearly articulate why Code Lab creation takes days
- [ ] Explain specific inefficiencies in manual process
- [ ] Demonstrate how automation addresses each pain point
- [ ] Show awareness of quality/consistency issues

### 2. Technical Execution ✓
Clean, professional implementation showcasing engineering skills:
- [ ] All three workflows function end-to-end
- [ ] Multi-LLM provider switching works flawlessly
- [ ] Authentication prevents unauthorized access
- [ ] No console errors or broken states
- [ ] Smooth loading states and error handling
- [ ] Code is clean and well-organized (if they ask to see it)

### 3. Product Thinking ✓
User-centric design aligned with business value:
- [ ] UI matches Pluralsight Pando design system
- [ ] Workflows are intuitive without explanation
- [ ] Forms have helpful labels and validation messages
- [ ] File previews are readable and useful
- [ ] Demo mode works offline (shows resourcefulness)
- [ ] Responsive design works on different screen sizes

### 4. Scalability Vision ✓
Demonstrate you've thought beyond the MVP:
- [ ] Discuss how to scale authentication (Pluralsight SSO)
- [ ] Explain multi-LLM routing benefits (cost, reliability)
- [ ] Show awareness of database/analytics needs
- [ ] Mention team collaboration possibilities
- [ ] Discuss production deployment strategy
- [ ] Reference architecture documentation (ARCHITECTURE_AUTH_MULTI_LLM.md)

### 5. Innovation ✓
Leverage cutting-edge technologies appropriately:
- [ ] MCP protocol knowledge and integration
- [ ] LLM provider abstraction for cost optimization
- [ ] Use of modern React patterns and hooks
- [ ] Type safety with TypeScript and Zod
- [ ] Integration of Pluralsight design system
- [ ] Awareness of latest AI/ML capabilities

### 6. Communication Skills ✓
Articulate your vision clearly:
- [ ] Explain the demo flow before starting
- [ ] Use clear, confident language
- [ ] Address interviewer questions directly
- [ ] Admit what you don't know but explain how you'd solve it
- [ ] Connect technical decisions to business value
- [ ] Stay within time constraints

### Success Checklist

**Before Interview:**
- [ ] Deploy to Vercel and test live URL
- [ ] Test local demo (start MCP server, run `npm run dev`)
- [ ] Record video backup and test playback
- [ ] Prepare demo script with exact talking points
- [ ] Practice demo 3+ times until smooth
- [ ] Have screenshots ready for fallback discussion
- [ ] Test all API keys are valid
- [ ] Verify MCP server is compatible with current version

**During Interview:**
- [ ] Share Vercel URL at start (for them to follow along)
- [ ] Demo all three complete workflows
- [ ] Show at least one LLM provider switch
- [ ] Discuss how authentication scales to Pluralsight
- [ ] Reference your architecture documentation
- [ ] Be prepared to discuss post-MVP enhancements
- [ ] Stay calm if minor issues occur (have video backup)

**Expected Interviewer Reactions:**
- Impressed by visual design and polish
- Engaged by live preview functionality
- Convinced by multi-LLM cost optimization
- Curious about architecture decisions
- Interested in future roadmap

## Post-Interview Enhancement Ideas

If interviewers show strong interest or you receive positive feedback:

### Phase 1: Real Integration (Week 2)
1. **Pluralsight SSO** - Replace Clerk with real Pluralsight OAuth
2. **Database Integration** - Store projects and workflow history
3. **Analytics** - Track which workflows are used most
4. **User Profiles** - Display author information and project count

### Phase 2: Collaboration Features (Week 3)
1. **Team Workspaces** - Share projects with other authors
2. **Real-time Collaboration** - Multiple authors editing simultaneously
3. **Comments & Feedback** - Feedback on generated Code Labs
4. **Version History** - Track changes to projects

### Phase 3: Advanced Features (Week 4)
1. **Cost Calculator** - Show estimated spend before generation
2. **Analytics Dashboard** - Usage metrics per author/project
3. **Custom Branding** - Pluralsight logo, colors, fonts
4. **API for External Tools** - Let other systems call your workflows

### Phase 4: Enterprise Features (Week 5+)
1. **VS Code Extension** - Develop Code Labs directly in editor
2. **CLI Tool** - Command-line interface for power users
3. **Bulk Operations** - Create multiple Code Labs at once
4. **Content Marketplace** - Share/sell Code Lab templates
5. **AI Fine-tuning** - Train LLMs on Pluralsight content standards

### MVP to Enterprise Roadmap

```
Week 0: Interview MVP ✓
    ↓
Week 2: Real Pluralsight Integration
    ↓
Week 3: Collaboration & Sharing
    ↓
Week 4: Analytics & Advanced Features
    ↓
Month 2: VS Code Extension
    ↓
Month 3: Production Launch
    ↓
Month 6: Enterprise Features
```

## Next Steps After MVP

1. Add real Pluralsight SSO integration
2. Implement usage analytics dashboard
3. Add team collaboration features
4. Build cost allocation system
5. Create VS Code extension
6. Deploy to production infrastructure
7. Add more language adapters