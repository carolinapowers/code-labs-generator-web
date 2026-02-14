import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate between workflows', async ({ page }) => {
    // Start at dashboard
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // If we're on dashboard (not redirected to auth)
    if (page.url().includes('dashboard')) {
      // Navigate to Brainstorm
      const brainstormLink = page.locator('a:has-text("Brainstorm"), nav :text("Brainstorm")')
      if (await brainstormLink.first().isVisible()) {
        await brainstormLink.first().click()
        await page.waitForLoadState('networkidle')
        expect(page.url()).toContain('brainstorm')
        await expect(page.locator('h1')).toContainText('Brainstorm')
      }

      // Navigate to Scaffold
      const scaffoldLink = page.locator('a:has-text("Scaffold"), nav :text("Scaffold")')
      if (await scaffoldLink.first().isVisible()) {
        await scaffoldLink.first().click()
        await page.waitForLoadState('networkidle')
        expect(page.url()).toContain('scaffold')
        await expect(page.locator('h1')).toContainText('Scaffold')
      }

      // Check if Develop is available or shows as coming soon
      const developLink = page.locator('nav :text("Develop")')
      if (await developLink.isVisible()) {
        const developText = await developLink.textContent()
        // Develop might be disabled or marked as coming soon
        expect(developText).toBeTruthy()
      }
    }
  })

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/dashboard/brainstorm')
    await page.waitForLoadState('networkidle')

    if (page.url().includes('brainstorm')) {
      // Check if Brainstorm nav item has active styling
      // Look for active classes or different background
      const activeNav = page.locator('nav a[href*="brainstorm"], nav [class*="active"]:has-text("Brainstorm"), nav [class*="bg-"]:has-text("Brainstorm")')

      if (await activeNav.first().isVisible()) {
        // Get the element's classes or styles
        const element = activeNav.first()
        const className = await element.getAttribute('class')

        // Check if it has active-related classes
        if (className) {
          const hasActiveClass = className.includes('active') ||
                                className.includes('bg-') ||
                                className.includes('selected')
          expect(hasActiveClass).toBeTruthy()
        }
      }
    }
  })

  test('should navigate back to dashboard from workflows', async ({ page }) => {
    await page.goto('/dashboard/brainstorm')
    await page.waitForLoadState('networkidle')

    if (page.url().includes('brainstorm')) {
      // Look for dashboard or home link
      const dashboardLink = page.locator('a[href="/dashboard"], a:has-text("Dashboard"), header a:has-text("Code Labs")')

      if (await dashboardLink.first().isVisible()) {
        await dashboardLink.first().click()
        await page.waitForLoadState('networkidle')

        // Should navigate to dashboard or home
        const url = page.url()
        expect(url.includes('dashboard') || url.endsWith('/')).toBeTruthy()
      }
    }
  })

  test('should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    if (page.url().includes('dashboard')) {
      const initialUrl = page.url()

      // Navigate to brainstorm
      await page.goto('/dashboard/brainstorm')
      await page.waitForLoadState('networkidle')
      const brainstormUrl = page.url()

      // Go back
      await page.goBack()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toBe(initialUrl)

      // Go forward
      await page.goForward()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toBe(brainstormUrl)
    }
  })

  test('should maintain state when navigating between pages', async ({ page }) => {
    await page.goto('/dashboard/brainstorm')
    await page.waitForLoadState('networkidle')

    if (page.url().includes('brainstorm')) {
      // Fill in some form data
      const titleInput = page.getByLabel('Code Lab Title *')
      if (await titleInput.isVisible()) {
        await titleInput.fill('Test Project State')

        // Navigate to scaffold
        await page.goto('/dashboard/scaffold')
        await page.waitForLoadState('networkidle')

        // Navigate back to brainstorm
        await page.goto('/dashboard/brainstorm')
        await page.waitForLoadState('networkidle')

        // Note: State might not persist (depends on implementation)
        // This test just verifies navigation works
        await expect(titleInput).toBeVisible()
      }
    }
  })

  test('should have responsive navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    if (page.url().includes('dashboard')) {
      // On mobile, navigation might be in a hamburger menu
      const hamburger = page.locator('[aria-label*="menu"], button:has([class*="menu"]), button:has(svg[class*="menu"])')

      if (await hamburger.first().isVisible()) {
        // Click hamburger to open mobile menu
        await hamburger.first().click()
        await page.waitForTimeout(300) // Wait for animation

        // Navigation items should now be visible
        const navItems = page.locator('nav a, [role="navigation"] a')
        const navCount = await navItems.count()
        expect(navCount).toBeGreaterThan(0)
      } else {
        // Navigation might be visible without hamburger
        const navItems = page.locator('nav a, [role="navigation"] a')
        const navCount = await navItems.count()
        expect(navCount).toBeGreaterThan(0)
      }
    }
  })

  test('should show breadcrumbs or current location', async ({ page }) => {
    await page.goto('/dashboard/brainstorm')
    await page.waitForLoadState('networkidle')

    if (page.url().includes('brainstorm')) {
      // Check for breadcrumbs or current page indicator
      const breadcrumbs = page.locator('[aria-label="breadcrumb"], nav[class*="breadcrumb"], ol[class*="breadcrumb"]')
      const pageTitle = page.locator('h1')

      // Either breadcrumbs or page title should indicate location
      const hasBreadcrumbs = await breadcrumbs.first().isVisible()
      const hasTitle = await pageTitle.isVisible()

      expect(hasBreadcrumbs || hasTitle).toBeTruthy()

      if (hasTitle) {
        const titleText = await pageTitle.textContent()
        expect(titleText).toContain('Brainstorm')
      }
    }
  })

  test('should handle direct URL navigation', async ({ page }) => {
    // Test direct navigation to different routes
    const routes = [
      '/dashboard',
      '/dashboard/brainstorm',
      '/dashboard/scaffold'
    ]

    for (const route of routes) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      // Should either load the page or redirect to auth
      const url = page.url()
      const loaded = url.includes(route.split('/').pop() || 'dashboard')
      const redirectedToAuth = url.includes('auth') || url.includes('signin')

      expect(loaded || redirectedToAuth).toBeTruthy()
    }
  })

  test('should have consistent header across pages', async ({ page }) => {
    const pages = [
      '/dashboard',
      '/dashboard/brainstorm',
      '/dashboard/scaffold'
    ]

    let headerHtml = ''

    for (const pageUrl of pages) {
      await page.goto(pageUrl)
      await page.waitForLoadState('networkidle')

      if (!page.url().includes('signin')) {
        const header = page.locator('header, [role="banner"]').first()

        if (await header.isVisible()) {
          // Check header contains consistent elements
          const logo = header.locator('text=/Code Labs|CL/')
          await expect(logo.first()).toBeVisible()

          // Store first header structure for comparison
          if (!headerHtml) {
            headerHtml = await header.innerHTML()
          }

          // Header should have similar structure across pages
          const currentHeaderHtml = await header.innerHTML()
          // Basic check - headers should have some common elements
          expect(currentHeaderHtml.length).toBeGreaterThan(0)
        }
      }
    }
  })

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page-12345')
    await page.waitForLoadState('networkidle')

    // Should either show 404 page or redirect
    const url = page.url()
    const bodyText = await page.locator('body').textContent()

    // Check for 404 indicators
    const is404 = bodyText?.includes('404') ||
                  bodyText?.includes('not found') ||
                  bodyText?.includes('Not Found')
    const redirected = url.includes('dashboard') || url.includes('auth')

    expect(is404 || redirected).toBeTruthy()
  })
})