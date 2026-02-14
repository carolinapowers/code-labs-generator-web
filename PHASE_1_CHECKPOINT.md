# Phase 1 MVP Checkpoint - Token-Efficient Path to Deployment

**Goal**: Build a deployable MVP in ~20-30k tokens that demonstrates core value and is ready for Pluralsight interviews.

**Scope**: Authentication + Brainstorm Workflow + Demo Mode (can add other workflows after weekly reset)

**Timeline**: 2-3 days of Claude Code development

---

## Phase 1: Minimal Viable Product (MLP)

### What You'll Have
- ✅ Working authentication (Clerk)
- ✅ Landing page
- ✅ Dashboard with Brainstorm workflow only
- ✅ MCP integration (brainstorm_lab_opportunity)
- ✅ Live preview of generated LAB_OPPORTUNITY.md
- ✅ Multi-LLM provider selection (with demo mode)
- ✅ Deployed to Vercel
- ✅ Professional design (Pluralsight Pando)

### What's Skipped (Add After Token Reset)
- Scaffold workflow
- Develop/Step creation workflow
- File tree visualization (complex, token-heavy)
- Advanced analytics/cost tracking UI

---

## Token Budget Breakdown

| Phase | Task | Est. Tokens |
|-------|------|------------|
| 1 | Project Setup + Dependencies | 2-3k |
| 2 | Authentication (Clerk) | 2-3k |
| 3 | Landing Page + Dashboard Layout | 2-3k |
| 4 | Brainstorm Form + Validation (Zod) | 3-4k |
| 5 | MCP Client + API Route | 3-4k |
| 6 | Brainstorm UI + Live Preview | 3-4k |
| 7 | Multi-LLM Routing + Demo Mode | 2-3k |
| 8 | Styling + Responsive Design | 2-3k |
| 9 | Testing + Error Handling | 2-3k |
| 10 | Vercel Deployment | 1-2k |
| **TOTAL** | | **25-33k** |

---

## Exact Implementation Checklist

### Day 1: Foundation (8-10k tokens)

**Step 1: Project Setup** (2-3k)
```bash
# Claude Code should:
- [ ] Create Next.js project with: npx create-next-app@latest . --typescript --tailwind --app
- [ ] Install dependencies (Clerk, AI SDK, Zod, shadcn)
- [ ] Create .env.local with placeholder keys
- [ ] Initialize git repository
- [ ] Create basic folder structure from CLAUDE.md
```

**Step 2: Authentication** (2-3k)
```bash
# Claude Code should:
- [ ] Set up Clerk with middleware.ts
- [ ] Create /auth/callback route
- [ ] Add SignIn and SignUp components
- [ ] Create simple landing page with login button
- [ ] Protect /dashboard routes with auth middleware
```

**Step 3: Dashboard Shell** (3-4k)
```bash
# Claude Code should:
- [ ] Create app/dashboard/layout.tsx with header and sidebar
- [ ] Add user profile dropdown
- [ ] Create tab navigation (Brainstorm, Coming Soon, Coming Soon)
- [ ] Add Pluralsight colors/branding
- [ ] Implement dark mode toggle
```

**Checkpoint 1 Complete**: Can log in and see dashboard

---

### Day 2: Brainstorm Workflow (8-10k tokens)

**Step 4: Brainstorm Form** (3-4k)
```bash
# Claude Code should:
- [ ] Create lib/validators.ts with Zod schemas
- [ ] Create components/forms/LearningObjectivesForm.tsx
- [ ] Add dynamic objectives list (add/remove)
- [ ] Add title, skillPath, duration inputs
- [ ] Implement form validation and error display
```

**Step 5: MCP Integration** (3-4k)
```bash
# Claude Code should:
- [ ] Create lib/mcp-client.ts (HTTP Streamable transport)
- [ ] Create api/mcp/brainstorm route
- [ ] Implement error handling
- [ ] Add demo mode for offline testing
- [ ] Create api/usage/track route (stub for later)
```

**Step 6: Live Preview** (2-3k)
```bash
# Claude Code should:
- [ ] Create components/displays/MarkdownRenderer.tsx
- [ ] Create split-screen layout (form on left, preview on right)
- [ ] Add copy-to-clipboard button
- [ ] Add loading spinner during generation
- [ ] Handle errors gracefully
```

**Checkpoint 2 Complete**: Can enter objectives and see generated LAB_OPPORTUNITY.md

---

### Day 3: LLM + Deploy (5-7k tokens)

**Step 7: Multi-LLM Support** (2-3k)
```bash
# Claude Code should:
- [ ] Create lib/llm-router.ts with provider selection
- [ ] Add provider dropdown to Brainstorm workflow
- [ ] Create mock responses for demo mode
- [ ] Show "Demo Mode" badge when offline
- [ ] Display provider status (API key configured or not)
```

**Step 8: Polish + Deploy** (3-4k)
```bash
# Claude Code should:
- [ ] Add loading states and animations
- [ ] Fix responsive design (mobile/tablet/desktop)
- [ ] Add success/error toast notifications
- [ ] Create README.md with setup instructions
- [ ] Deploy to Vercel and test live URL
- [ ] Add environment variables to Vercel dashboard
```

**Checkpoint 3 Complete**: Deployed to Vercel, fully working

---

## Demo Script for Phase 1 Only

```
Opening (30 seconds):
"This is a web interface for the Code Lab Generator MCP server.
It automates the creation process, taking authors from idea to working
Code Lab in hours instead of days. Today I'm showing Phase 1:
the Brainstorm workflow."

Demo (2 minutes):
1. Show landing page and login
2. Add 3-4 learning objectives
3. Click "Generate"
4. Show LAB_OPPORTUNITY.md output
5. Switch LLM provider (show cost difference)
6. Highlight time savings

Value Prop (1 minute):
"Imagine doing this 10 times a day across 100 authors. This MVP
shows the core concept. Phase 2 (after token reset) will add
project scaffolding and step creation. Phase 3 will add team
collaboration and analytics."
```

---

## File List to Create (Minimal)

```
Code structure for Phase 1:
├── middleware.ts                      # Clerk auth
├── app/
│   ├── layout.tsx                    # Root with providers
│   ├── page.tsx                      # Landing
│   ├── auth/callback/page.tsx        # Clerk callback
│   ├── dashboard/
│   │   ├── layout.tsx                # Dashboard shell
│   │   └── brainstorm/page.tsx       # Main workflow
│   └── api/
│       ├── mcp/brainstorm.ts         # MCP endpoint
│       └── usage/track.ts            # Stub
├── components/
│   ├── forms/LearningObjectivesForm.tsx
│   ├── displays/MarkdownRenderer.tsx
│   ├── auth/SignIn.tsx
│   ├── auth/SignUp.tsx
│   ├── layout/Header.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── validators.ts                 # Zod schemas
│   ├── mcp-client.ts                # MCP logic
│   ├── llm-router.ts                # LLM selection
│   └── constants.ts
├── store/
│   └── authStore.ts                 # Zustand (user context)
├── styles/
│   └── pando-tokens.css            # Pluralsight colors
├── .env.local                       # API keys
├── .env.example
└── README.md
```

---

## What to Tell Claude Code

```
I'm approaching my token limit and want to build Phase 1 only
(20-30k tokens). I need:

1. Working authentication with Clerk
2. A dashboard with the Brainstorm workflow only
3. MCP integration to call brainstorm_lab_opportunity
4. Live preview of generated LAB_OPPORTUNITY.md
5. Multi-LLM provider selection
6. Demo mode for offline testing
7. Deploy to Vercel

Skip for now (will add after token reset):
- Scaffold workflow
- Develop/step creation workflow
- File tree visualization
- Advanced analytics

Use the CLAUDE.md for reference, but focus only on
the "Phase 1: Core Infrastructure" and "Phase 2: Brainstorm Workflow"
sections.
```

---

## Interview Talking Points (Phase 1 Only)

**Opening**:
"I've built the brainstorm workflow which is the first step in the Code Lab creation process. This demonstrates the core concept and value."

**Demo**:
"Enter learning objectives → AI generates structured LAB_OPPORTUNITY.md → You choose an LLM provider for cost optimization."

**Vision**:
"Phase 1 shows automation of the brainstorm step. Phase 2 (in progress) adds project scaffolding. Phase 3 will handle step-by-step development. Full system will handle the entire Code Lab creation lifecycle."

**Technical**:
"Built with Next.js, TypeScript, Tailwind CSS, Clerk for auth, and the MCP protocol to communicate with the backend server. Multi-LLM support via Vercel AI SDK."

**Scalability**:
"The foundation is ready to add the other workflows. Each workflow can be built independently and deployed incrementally. Architecture supports team collaboration and usage analytics."

---

## Success Criteria for Phase 1

✅ **Must Have**:
- Clerk authentication works (sign up, sign in, sign out)
- Brainstorm form accepts objectives
- MCP brainstorm tool is called successfully
- LAB_OPPORTUNITY.md is displayed in preview
- Deployed to Vercel at a live URL
- Works in demo mode without API keys
- Responsive on mobile/tablet/desktop

⚠️ **Nice to Have**:
- Multiple LLM provider selection
- Cost estimation display
- Loading animations
- Professional styling with Pando colors

❌ **Intentionally Skipped** (for Phase 2):
- Scaffold workflow
- Develop/step creation
- File tree visualization
- Advanced analytics

---

## After Token Reset: Phase 2 Plan

Once your weekly tokens refresh, add:

1. **Scaffold Workflow** (Days 1-2)
   - Project configuration form
   - Language selector (TypeScript, C#, Go)
   - File tree visualization
   - Code syntax highlighting

2. **Develop Workflow** (Days 2-3)
   - Step creation form
   - Task builder UI
   - Test execution display
   - Solution template preview

3. **Polish & Analytics** (Days 3-4)
   - Cost tracking display
   - Usage analytics
   - Progress indicator
   - Success metrics

---

## Key Environment Variables Needed

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3001
OPENAI_API_KEY=sk_xxxxx (optional, demo mode works without)
ANTHROPIC_API_KEY=sk_ant_xxxxx (optional)
GOOGLE_GENERATIVE_AI_API_KEY=xxxxx (optional)
NEXT_PUBLIC_DEMO_MODE=true
```

---

## Deployment Checklist

Before deploying to Vercel:

```bash
- [ ] Test locally: npm run dev
- [ ] All workflows render without console errors
- [ ] Authentication works (can log in/out)
- [ ] MCP server connection works
- [ ] Demo mode works without API keys
- [ ] Build succeeds: npm run build
- [ ] No console errors in production build

Vercel deployment:
- [ ] Create Vercel account
- [ ] Import git repository
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy production build
- [ ] Test live URL works
- [ ] Share URL with interviewers
```

---

## Fallback: If You Run Out of Tokens Mid-Build

**What Claude Code should do**:
1. Save all work to git
2. Create a GitHub branch (e.g., `phase-1-checkpoint`)
3. Document exactly what was completed
4. Create a file: `PHASE_1_PROGRESS.md` listing:
   - ✅ What's finished
   - 🟡 What's in progress
   - ⏳ What's next

**When tokens refresh**:
1. Claude Code can read `PHASE_1_PROGRESS.md`
2. Pick up exactly where it left off
3. Complete the remaining tasks
4. No duplicate work

---

## Expected Interview Impact

Even with **Phase 1 only**, interviewers will see:

✅ **Problem Understanding**: Clear pain point in Code Lab creation
✅ **Technical Skills**: Modern full-stack React, TypeScript, authentication
✅ **MCP Knowledge**: Integration with MCP protocol and tools
✅ **Product Thinking**: User-friendly interface, design system alignment
✅ **Execution**: Deployed and working product
⚠️ **Scalability**: Can explain roadmap for Phase 2 and 3

This is still impressive! Many candidates show slides. You're showing working software.

---

## Ready to Start?

**Checklist before telling Claude Code to begin:**

- [ ] MCP server running (`npm run dev` in code-lab-mcp-server)
- [ ] Clerk account created and keys ready
- [ ] Google/OpenAI API keys obtained (or ready to skip with demo mode)
- [ ] Vercel account ready
- [ ] This PHASE_1_CHECKPOINT.md is read and understood
- [ ] You've checked your remaining token count

**Then tell Claude Code**:
"Build Phase 1 only according to PHASE_1_CHECKPOINT.md and CLAUDE.md"
