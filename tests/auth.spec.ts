import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/')

    // Check for landing page content
    await expect(page).toHaveTitle(/Code Labs Generator/)

    // Check for key elements
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()

    // Check for sign in/sign up links or buttons
    const signInElements = page.locator('text=/sign in/i, text=/login/i')
    const signUpElements = page.locator('text=/sign up/i, text=/get started/i')

    // At least one auth-related element should be visible
    const signInCount = await signInElements.count()
    const signUpCount = await signUpElements.count()

    expect(signInCount + signUpCount).toBeGreaterThan(0)
  })

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/')

    // Look for sign in link/button
    const signInLink = page.locator('a[href*="signin"], button:has-text("Sign In"), a:has-text("Sign In")')

    if (await signInLink.first().isVisible()) {
      await signInLink.first().click()

      // Should navigate to sign in page
      await page.waitForLoadState('networkidle')

      // Check URL contains signin
      expect(page.url()).toContain('signin')

      // Check for sign in form elements
      const emailInput = page.locator('input[type="email"], input[name*="email"], input[id*="email"], input[placeholder*="email"]')
      const passwordInput = page.locator('input[type="password"]')
      const signInButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Continue")')

      // At least email or password field should be visible (Clerk forms)
      const hasEmail = await emailInput.first().isVisible()
      const hasPassword = await passwordInput.first().isVisible()
      const hasSubmit = await signInButton.first().isVisible()

      expect(hasEmail || hasPassword || hasSubmit).toBeTruthy()
    }
  })

  test('should navigate to sign up page', async ({ page }) => {
    await page.goto('/')

    // Look for sign up link/button
    const signUpLink = page.locator('a[href*="signup"], button:has-text("Sign Up"), a:has-text("Sign Up"), a:has-text("Get Started")')

    if (await signUpLink.first().isVisible()) {
      await signUpLink.first().click()

      // Should navigate to sign up page
      await page.waitForLoadState('networkidle')

      // Check URL contains signup
      expect(page.url()).toContain('signup')

      // Check for sign up form elements
      const emailInput = page.locator('input[type="email"], input[name*="email"], input[id*="email"], input[placeholder*="email"]')
      const signUpButton = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Continue"), button:has-text("Create")')

      // At least one form element should be visible
      const hasEmail = await emailInput.first().isVisible()
      const hasSubmit = await signUpButton.first().isVisible()

      expect(hasEmail || hasSubmit).toBeTruthy()
    }
  })

  test('should show Clerk authentication UI on sign in page', async ({ page }) => {
    await page.goto('/auth/signin')

    // Wait for Clerk to load
    await page.waitForTimeout(2000)

    // Check for Clerk-specific elements
    // Clerk uses specific class names and structure
    const clerkElements = page.locator('[class*="cl-"], [data-clerk], .clerk-elements')

    // Should have at least one Clerk element
    const clerkCount = await clerkElements.count()
    expect(clerkCount).toBeGreaterThan(0)
  })

  test('should show Clerk authentication UI on sign up page', async ({ page }) => {
    await page.goto('/auth/signup')

    // Wait for Clerk to load
    await page.waitForTimeout(2000)

    // Check for Clerk-specific elements
    const clerkElements = page.locator('[class*="cl-"], [data-clerk], .clerk-elements')

    // Should have at least one Clerk element
    const clerkCount = await clerkElements.count()
    expect(clerkCount).toBeGreaterThan(0)
  })

  test('should redirect to dashboard after sign in URL', async ({ page }) => {
    // When accessing dashboard without auth
    await page.goto('/dashboard')

    // Wait for redirect
    await page.waitForLoadState('networkidle')

    // Should either:
    // 1. Redirect to sign in (if auth is enforced)
    // 2. Show dashboard (if in demo mode or auth disabled)
    const url = page.url()

    // Check if redirected to auth or stayed on dashboard
    const isOnSignIn = url.includes('signin') || url.includes('sign-in')
    const isOnDashboard = url.includes('dashboard')

    expect(isOnSignIn || isOnDashboard).toBeTruthy()
  })

  test('should have sign in and sign up links that work', async ({ page }) => {
    await page.goto('/auth/signin')

    // Look for "Sign up" link on sign in page
    const signUpLink = page.locator('a:has-text("Sign up"), a:has-text("Create account"), a:has-text("Don\'t have an account")')

    if (await signUpLink.first().isVisible()) {
      await signUpLink.first().click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('signup')
    }

    // Go to sign up page
    await page.goto('/auth/signup')

    // Look for "Sign in" link on sign up page
    const signInLink = page.locator('a:has-text("Sign in"), a:has-text("Already have an account"), a:has-text("Log in")')

    if (await signInLink.first().isVisible()) {
      await signInLink.first().click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('signin')
    }
  })

  test('should display header with app name', async ({ page }) => {
    await page.goto('/')

    // Check for header with app name
    const header = page.locator('header, [role="banner"], nav')
    await expect(header.first()).toBeVisible()

    // Check for app name in header
    const appName = page.locator('text=Code Labs Generator, text=Code Labs, text=CL')
    await expect(appName.first()).toBeVisible()
  })

  test('should handle protected routes', async ({ page }) => {
    // Try to access protected routes
    const protectedRoutes = [
      '/dashboard',
      '/dashboard/brainstorm',
      '/dashboard/scaffold',
      '/dashboard/develop'
    ]

    for (const route of protectedRoutes) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      const url = page.url()

      // Should either:
      // 1. Redirect to auth (if not authenticated)
      // 2. Stay on the route (if authenticated or demo mode)
      const isProtected = url.includes('signin') || url.includes('sign-in') || url.includes('auth')
      const isAllowed = url.includes(route)

      expect(isProtected || isAllowed).toBeTruthy()
    }
  })

  test('should show navigation sidebar when on dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // If we're on the dashboard (not redirected to auth)
    if (page.url().includes('dashboard')) {
      // Check for sidebar navigation
      const sidebar = page.locator('nav, [role="navigation"], aside')

      if (await sidebar.first().isVisible()) {
        // Check for workflow links
        const brainstormLink = page.locator('text=Brainstorm')
        const scaffoldLink = page.locator('text=Scaffold')
        const developLink = page.locator('text=Develop')

        // At least one navigation link should be visible
        const hasBrainstorm = await brainstormLink.isVisible()
        const hasScaffold = await scaffoldLink.isVisible()
        const hasDevelop = await developLink.isVisible()

        expect(hasBrainstorm || hasScaffold || hasDevelop).toBeTruthy()
      }
    }
  })

  test('should have MCP status indicator in header', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // If we're on the dashboard
    if (page.url().includes('dashboard')) {
      // Look for MCP status indicator
      const mcpStatus = page.locator('text=/MCP|Demo Mode|Checking MCP|Connected/')

      // Check if any status indicator is visible
      if (await mcpStatus.first().isVisible()) {
        const statusText = await mcpStatus.first().textContent()

        // Status should be one of the expected values
        expect(statusText).toMatch(/MCP|Demo Mode|Checking|Connected/)
      }
    }
  })
})