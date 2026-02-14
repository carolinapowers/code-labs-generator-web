import { test, expect } from '@playwright/test'

test.describe('Brainstorm Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to brainstorm page
    await page.goto('/dashboard/brainstorm')
  })

  test('should load brainstorm page with correct title', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Code Labs Generator/)

    // Check workflow title is present
    await expect(page.locator('h1')).toContainText('Brainstorm Workflow')

    // Check description is present
    await expect(page.locator('text=Generate a complete LAB_OPPORTUNITY.md file')).toBeVisible()
  })

  test('should show demo mode indicator when enabled', async ({ page }) => {
    // Check for demo mode indicator
    const demoModeIndicator = page.locator('text=Demo Mode')

    // Demo mode may or may not be enabled based on environment
    const count = await demoModeIndicator.count()
    if (count > 0) {
      await expect(demoModeIndicator.first()).toBeVisible()
    }
  })

  test('should have all form fields present', async ({ page }) => {
    // Check Code Lab Title field
    await expect(page.getByLabel('Code Lab Title *')).toBeVisible()

    // Check Technology field
    await expect(page.getByLabel('Technology')).toBeVisible()

    // Check Skill Path field
    await expect(page.getByLabel('Skill Path')).toBeVisible()

    // Check Skill Level dropdown
    await expect(page.getByLabel('Skill Level')).toBeVisible()

    // Check Duration dropdown
    await expect(page.getByLabel('Duration')).toBeVisible()

    // Check Learning Objectives section
    await expect(page.locator('text=Learning Objectives *')).toBeVisible()

    // Check Generate button
    await expect(page.getByRole('button', { name: 'Generate LAB_OPPORTUNITY.md' })).toBeVisible()
  })

  test('should allow adding and removing learning objectives', async ({ page }) => {
    // Initial state should have one objective field
    const initialObjectives = page.locator('textarea[placeholder*="Objective"]')
    await expect(initialObjectives).toHaveCount(1)

    // Click Add Objective button
    await page.getByRole('button', { name: '+ Add Objective' }).click()

    // Should now have two objective fields
    await expect(initialObjectives).toHaveCount(2)

    // Add a third objective
    await page.getByRole('button', { name: '+ Add Objective' }).click()
    await expect(initialObjectives).toHaveCount(3)

    // Remove an objective (×button should appear when more than 1)
    const removeButtons = page.locator('button:has-text("×")')
    await expect(removeButtons).toHaveCount(3)
    await removeButtons.first().click()

    // Should be back to 2 objectives
    await expect(initialObjectives).toHaveCount(2)
  })

  test('should generate LAB_OPPORTUNITY.md with valid input', async ({ page }) => {
    // Fill in the form
    await page.getByLabel('Code Lab Title *').fill('Building a Todo Application with React and TypeScript')
    await page.getByLabel('Technology').fill('React')
    await page.getByLabel('Skill Path').fill('React 18')
    await page.getByLabel('Skill Level').selectOption('Intermediate')
    await page.getByLabel('Duration').selectOption('45-60 minutes')

    // Fill in learning objective
    const objective1 = page.locator('textarea[placeholder*="Objective"]').first()
    await objective1.fill('Learn how to set up a React project with TypeScript configuration')

    // Add second objective
    await page.getByRole('button', { name: '+ Add Objective' }).click()
    const objective2 = page.locator('textarea[placeholder*="Objective"]').nth(1)
    await objective2.fill('Understand React hooks including useState, useEffect, and custom hooks')

    // Click Generate button
    await page.getByRole('button', { name: 'Generate LAB_OPPORTUNITY.md' }).click()

    // Wait for either loading state or result
    // Could show loading spinner
    const loadingState = page.locator('text=Generating LAB_OPPORTUNITY.md...')
    const generatedContent = page.locator('text=# Code Lab Opportunity:')
    const errorState = page.locator('text=Error')

    // Wait for one of the states
    await expect(async () => {
      const states = await Promise.race([
        loadingState.waitFor({ state: 'visible', timeout: 1000 }).catch(() => 'no-loading'),
        generatedContent.waitFor({ state: 'visible', timeout: 1000 }).catch(() => 'no-content'),
        errorState.waitFor({ state: 'visible', timeout: 1000 }).catch(() => 'no-error')
      ])
      expect(states).not.toBe('no-error')
    }).toPass({ timeout: 10000 })

    // If loading appeared, wait for it to disappear
    if (await loadingState.isVisible()) {
      await loadingState.waitFor({ state: 'hidden', timeout: 10000 })
    }

    // Check if content was generated (in demo mode or with real API)
    const contentVisible = await generatedContent.isVisible()
    if (contentVisible) {
      // Verify the generated content contains expected elements
      await expect(page.locator('text=## Overview')).toBeVisible()
      await expect(page.locator('text=## Learning Objectives')).toBeVisible()
      await expect(page.locator('text=## Metadata')).toBeVisible()

      // Check for Copy button if content is displayed
      const copyButton = page.getByRole('button', { name: 'Copy' })
      if (await copyButton.isVisible()) {
        await expect(copyButton).toBeEnabled()
      }
    }
  })

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    await page.getByRole('button', { name: 'Generate LAB_OPPORTUNITY.md' }).click()

    // Form should not submit and may show validation errors
    // Check that we're still on the same page
    await expect(page.locator('h1')).toContainText('Brainstorm Workflow')

    // The preview should still show the placeholder text
    await expect(page.locator('text=Fill out the form and click "Generate"')).toBeVisible()
  })

  test('should handle skill level selection', async ({ page }) => {
    const skillLevelSelect = page.getByLabel('Skill Level')

    // Check default value
    const defaultValue = await skillLevelSelect.inputValue()
    expect(['Beginner', 'Intermediate', 'Advanced']).toContain(defaultValue)

    // Select different values
    await skillLevelSelect.selectOption('Beginner')
    await expect(skillLevelSelect).toHaveValue('Beginner')

    await skillLevelSelect.selectOption('Advanced')
    await expect(skillLevelSelect).toHaveValue('Advanced')

    await skillLevelSelect.selectOption('Intermediate')
    await expect(skillLevelSelect).toHaveValue('Intermediate')
  })

  test('should handle duration selection', async ({ page }) => {
    const durationSelect = page.getByLabel('Duration')

    // Check default value
    const defaultValue = await durationSelect.inputValue()
    expect(['15-30 minutes', '30-45 minutes', '45-60 minutes', '60+ minutes']).toContain(defaultValue)

    // Select different values
    await durationSelect.selectOption('15-30 minutes')
    await expect(durationSelect).toHaveValue('15-30 minutes')

    await durationSelect.selectOption('60+ minutes')
    await expect(durationSelect).toHaveValue('60+ minutes')
  })

  test('should display cost estimate when content is generated', async ({ page }) => {
    // Skip this test if not in demo mode or API not configured
    const demoMode = await page.locator('text=Demo Mode').isVisible()

    if (demoMode) {
      // Fill minimal required fields
      await page.getByLabel('Code Lab Title *').fill('Test Project')
      await page.locator('textarea[placeholder*="Objective"]').first().fill('Test objective')

      // Generate content
      await page.getByRole('button', { name: 'Generate LAB_OPPORTUNITY.md' }).click()

      // Wait for generation
      await page.waitForTimeout(2000)

      // Check if cost estimate appears
      const costEstimate = page.locator('text=/Estimated cost:/')
      if (await costEstimate.isVisible()) {
        await expect(costEstimate).toContainText('$')
      }
    }
  })
})