# Gemini CLI Project Overview - Code Labs Generator Web

This project is a modern web interface for the Code Lab MCP Server, designed to automate Code Lab creation using AI. It is built with Next.js and TypeScript, focusing on a streamlined user experience for generating `LAB_OPPORTUNITY.md` files from learning objectives.

## Project Structure and Key Technologies

*   **Framework**: Next.js 15 with App Router
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Authentication**: Clerk (with `@clerk/nextjs` for Next.js integration)
*   **Form Validation**: Zod + React Hook Form
*   **UI Components**: Radix UI primitives
*   **AI SDKs**: Integrates with `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/openai` for AI model interactions.
*   **State Management**: Zustand
*   **MCP Integration**: Uses `@modelcontextprotocol/sdk` and `use-mcp` for Model Context Protocol server interaction.

The application structure follows a typical Next.js pattern:
*   `app/`: Contains the main application routes, including `api` endpoints, `auth` pages (signin, signup, callback), and `dashboard` pages (brainstorm, develop, scaffold).
*   `components/`: Houses reusable React components, categorized into `displays`, `forms`, `layout`, and `ui`.
*   `lib/`: Contains utility functions, constants, types, and validators.
*   `middleware.ts`: Implements Clerk's authentication middleware for route protection.

## Building and Running

### Prerequisites

*   Node.js 18+ (20 LTS recommended)
*   npm or yarn
*   A Clerk account (free tier is sufficient)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/code-labs-generator-web.git
    cd code-labs-generator-web
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file by copying `.env.example` and fill in your Clerk API keys.
    ```
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
    **Note**: Valid Clerk keys are required to build and run the application.

### Available Scripts

*   **`npm run dev`**: Starts the development server.
*   **`npm run build`**: Builds the application for production.
*   **`npm run start`**: Starts the production server (after building).
*   **`npm run lint`**: Runs ESLint for code quality checks.

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
2.  **Open in browser:**
    Navigate to `http://localhost:3000`.

### Demo Mode

The application supports a demo mode that uses mock data, allowing testing without requiring a running MCP server or API keys for the AI models. To enable demo mode, ensure `NEXT_PUBLIC_DEMO_MODE=true` in your `.env.local` file.

### With MCP Server

To use the application with a real MCP server:
1.  Clone and run the `code-lab-mcp-server` (if available).
2.  Set `NEXT_PUBLIC_DEMO_MODE=false` in `.env.local`.
3.  Set `NEXT_PUBLIC_MCP_SERVER_URL` to the URL of your MCP server.
4.  Restart the Next.js development server.

## Development Conventions

*   **Code Style**: ESLint is configured for code quality (`npm run lint`).
*   **Testing**: (Not explicitly detailed in `README.md`, assumed to be handled by Next.js conventions or external tools.)
*   **Contributions**: This is currently a demo project for interviews.
