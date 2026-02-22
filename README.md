# Code Labs Generator Web - Phase 1 MVP

A modern web interface for the Code Lab MCP Server that automates Code Lab creation with AI.

## Features (Phase 1)

- **Authentication**: Secure sign-in/sign-up with Clerk
- **Brainstorm Workflow**: Generate LAB_OPPORTUNITY.md from learning objectives
- **Live Preview**: See generated content in real-time
- **Demo Mode**: Test without API keys or MCP server
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Form Validation**: Zod + React Hook Form
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ (recommend 20 LTS)
- npm or yarn
- Clerk account (free tier works)

### Installation

1. **Clone the repository**

```bash
cd code-labs-generator-web
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file (copy from `.env.example`):

```bash
# Clerk Authentication (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MCP Server (optional for demo mode)
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3001

# Demo Mode (set to true to use mock data)
NEXT_PUBLIC_DEMO_MODE=true
```

4. **Get Clerk API keys (REQUIRED)**

- Go to [clerk.com](https://clerk.com)
- Sign up for a free account
- Create a new application
- Copy the publishable and secret keys to `.env.local`

**Important**: The app requires valid Clerk keys to build and run. The placeholder keys in `.env.example` will not work.

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Demo Mode (No Setup Required)

The app works out of the box in demo mode:

1. Sign up for an account (Clerk handles this)
2. Go to Dashboard → Brainstorm
3. Fill out the form with learning objectives
4. Click "Generate LAB_OPPORTUNITY.md"
5. See the generated content in the preview pane

### With MCP Server (Local Development)

To use the real MCP server locally:

1. **Clone and set up the MCP server**

```bash
# In a separate terminal window
cd ../code-lab-mcp-server
npm install
```

2. **Start the MCP HTTP bridge server**

```bash
# From code-lab-mcp-server directory
npm run dev:http-bridge
# Server will start on http://localhost:3002
```

3. **Configure the web app**

Update `.env.local`:
```bash
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3002/mcp
NEXT_PUBLIC_DEMO_MODE=false
```

4. **Restart the Next.js dev server**

```bash
# In the web app directory
npm run dev
```

The web app will now connect to your local MCP server for real brainstorming functionality!

## Project Structure

```
code-labs-generator-web/
├── app/
│   ├── api/mcp/          # API routes for MCP integration
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Protected dashboard pages
│   │   └── brainstorm/   # Brainstorm workflow
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Landing page
├── components/
│   ├── displays/         # Preview components
│   ├── forms/            # Form components
│   ├── layout/           # Header, sidebar
│   └── ui/               # Reusable UI primitives
├── lib/
│   ├── constants.ts      # App constants
│   ├── demo-data.ts      # Mock data for demo mode
│   ├── types.ts          # TypeScript interfaces
│   ├── utils.ts          # Utility functions
│   └── validators.ts     # Zod schemas
└── middleware.ts         # Clerk auth middleware
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login and link project**

```bash
vercel login
vercel link
```

3. **Add environment variables in Vercel dashboard**

- Go to your project settings
- Add all variables from `.env.local`

4. **Deploy**

```bash
vercel --prod
```

## Phase 1 Scope

This MVP includes:

- ✅ Clerk authentication
- ✅ Landing page
- ✅ Dashboard with Brainstorm workflow
- ✅ Live preview of LAB_OPPORTUNITY.md
- ✅ Demo mode
- ✅ Responsive design

Intentionally skipped for Phase 2:

- ⏳ Scaffold workflow
- ⏳ Develop/Step creation workflow
- ⏳ Multi-LLM provider selection
- ⏳ File tree visualization
- ⏳ Cost tracking dashboard

## Troubleshooting

### "Unauthorized" error

- Check that your Clerk keys are correct in `.env.local`
- Make sure you're signed in
- Try clearing cookies and signing in again

### Form validation errors

- Each learning objective must be at least 10 characters
- Title must be 5-200 characters
- At least one objective is required

### Demo mode not working

- Verify `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`
- Restart the dev server after changing env variables

## Contributing

This is a demo project for Pluralsight interviews. Contributions are welcome after the interview process.

## License

MIT

## Contact

Carolina Powers - [GitHub](https://github.com/carolinapowers)
