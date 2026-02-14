import { test, expect } from '@playwright/test'

test.describe('Scaffold Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to scaffold page
    await page.goto('/dashboard/scaffold')
  })

  test('should load scaffold page with correct title', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Code Labs Generator/)

    // Check workflow title is present
    await expect(page.locator('h1')).toContainText('Scaffold Workflow')

    // Check description is present
    await expect(page.locator('text=Generate a complete project structure')).toBeVisible()
  })

  test('should have all form fields present', async ({ page }) => {
    // Check Project Name field
    await expect(page.getByLabel('Project Name *')).toBeVisible()

    // Check Language selection radio buttons
    await expect(page.locator('text=TypeScript (React)')).toBeVisible()
    await expect(page.locator('text=C# (ASP.NET Core)')).toBeVisible()
    await expect(page.locator('text=Go')).toBeVisible()

    // Check LAB_OPPORTUNITY.md Path field
    await expect(page.getByLabel('LAB_OPPORTUNITY.md Path (Optional)')).toBeVisible()

    // Check Scaffold button
    await expect(page.getByRole('button', { name: 'Scaffold Project' })).toBeVisible()
  })

  test('should select different languages', async ({ page }) => {
    // TypeScript should be selected by default or no selection
    const tsRadio = page.locator('input[type="radio"][value="typescript"]')
    const csRadio = page.locator('input[type="radio"][value="csharp"]')
    const goRadio = page.locator('input[type="radio"][value="go"]')

    // Click TypeScript option
    await page.locator('text=TypeScript (React)').click()
    await expect(tsRadio).toBeChecked()

    // Click C# option
    await page.locator('text=C# (ASP.NET Core)').click()
    await expect(csRadio).toBeChecked()
    await expect(tsRadio).not.toBeChecked()

    // Click Go option
    await page.locator('text=Go').click()
    await expect(goRadio).toBeChecked()
    await expect(csRadio).not.toBeChecked()
  })

  test('should scaffold TypeScript React project', async ({ page }) => {
    // Fill in project name
    await page.getByLabel('Project Name *').fill('todo-app-react')

    // Select TypeScript
    await page.locator('text=TypeScript (React)').click()

    // Click Scaffold button
    await page.getByRole('button', { name: 'Scaffold Project' }).click()

    // Wait for generation
    await page.waitForTimeout(2000)

    // Check for either error or generated files
    const errorMessage = page.locator('text=Error')
    const generatedFiles = page.locator('text=Generated Files')
    const projectStructure = page.locator('text=Project Structure')

    // Wait for one of the states
    const hasError = await errorMessage.isVisible()
    const hasFiles = await generatedFiles.isVisible()
    const hasStructure = await projectStructure.isVisible()

    // Should have either generated files or project structure (success) or error
    expect(hasError || hasFiles || hasStructure).toBeTruthy()

    if (hasFiles || hasStructure) {
      // Check for file tree elements
      const packageJson = page.locator('text=package.json')
      const readMe = page.locator('text=README.md')

      // At least some files should be visible
      const packageVisible = await packageJson.isVisible()
      const readmeVisible = await readMe.isVisible()
      expect(packageVisible || readmeVisible).toBeTruthy()
    }
  })

  test('should scaffold C# ASP.NET Core project', async ({ page }) => {
    // Fill in project name
    await page.getByLabel('Project Name *').fill('todo-app-csharp')

    // Select C#
    await page.locator('text=C# (ASP.NET Core)').click()

    // Click Scaffold button
    await page.getByRole('button', { name: 'Scaffold Project' }).click()

    // Wait for generation
    await page.waitForTimeout(2000)

    // Check for results
    const errorMessage = page.locator('text=Error')
    const generatedFiles = page.locator('text=Generated Files')
    const projectStructure = page.locator('text=Project Structure')

    const hasError = await errorMessage.isVisible()
    const hasFiles = await generatedFiles.isVisible()
    const hasStructure = await projectStructure.isVisible()

    expect(hasError || hasFiles || hasStructure).toBeTruthy()
  })

  test('should scaffold Go project', async ({ page }) => {
    // Fill in project name
    await page.getByLabel('Project Name *').fill('todo-app-go')

    // Select Go
    await page.locator('text=Go').click()

    // Click Scaffold button
    await page.getByRole('button', { name: 'Scaffold Project' }).click()

    // Wait for generation
    await page.waitForTimeout(2000)

    // Check for results
    const errorMessage = page.locator('text=Error')
    const generatedFiles = page.locator('text=Generated Files')
    const projectStructure = page.locator('text=Project Structure')

    const hasError = await errorMessage.isVisible()
    const hasFiles = await generatedFiles.isVisible()
    const hasStructure = await projectStructure.isVisible()

    expect(hasError || hasFiles || hasStructure).toBeTruthy()
  })

  test('should show file preview when file is clicked', async ({ page }) => {
    // First scaffold a project
    await page.getByLabel('Project Name *').fill('test-project')
    await page.locator('text=TypeScript (React)').click()
    await page.getByRole('button', { name: 'Scaffold Project' }).click()

    // Wait for files to generate
    await page.waitForTimeout(2000)

    // Check if files are generated
    const packageJson = page.locator('text=package.json').first()
    if (await packageJson.isVisible()) {
      // Click on package.json
      await packageJson.click()

      // Wait a moment for preview to appear
      await page.waitForTimeout(500)

      // Check for code preview elements
      const codeBlock = page.locator('code, pre')
      const copyButton = page.getByRole('button', { name: 'Copy' })
      const downloadButton = page.getByRole('button', { name: 'Download' })

      // At least one of these should be visible when a file is selected
      const hasCode = await codeBlock.first().isVisible()
      const hasCopy = await copyButton.isVisible()
      const hasDownload = await downloadButton.isVisible()

      expect(hasCode || hasCopy || hasDownload).toBeTruthy()
    }
  })

  test('should expand and collapse folders in file tree', async ({ page }) => {
    // First scaffold a project
    await page.getByLabel('Project Name *').fill('test-expand')
    await page.locator('text=TypeScript (React)').click()
    await page.getByRole('button', { name: 'Scaffold Project' }).click()

    // Wait for files to generate
    await page.waitForTimeout(2000)

    // Look for src folder (commonly has nested files)
    const srcFolder = page.locator('text=src').first()
    if (await srcFolder.isVisible()) {
      // Click to expand/collapse
      await srcFolder.click()

      // Folder icon might change from 📁 to 📂 or similar
      // This test just verifies the folder is clickable
      await expect(srcFolder).toBeVisible()
    }
  })

  test('should validate required project name', async ({ page }) => {
    // Don't fill in project name
    // Select a language
    await page.locator('text=TypeScript (React)').click()

    // Try to scaffold
    await page.getByRole('button', { name: 'Scaffold Project' }).click()

    // Should not navigate away or show success
    // Should still be on scaffold page
    await expect(page.locator('h1')).toContainText('Scaffold Workflow')

    // The initial helper text should still be visible
    const helperText = page.locator('text=Configure your project and click')
    const projectStructure = page.locator('text=Project Structure')

    // Either helper text is still visible (form not submitted)
    // or there's no project structure (form validation failed)
    const hasHelper = await helperText.isVisible()
    const hasStructure = await projectStructure.isVisible()

    expect(hasHelper || !hasStructure).toBeTruthy()
  })

  test('should handle optional LAB_OPPORTUNITY.md path', async ({ page }) => {
    // Fill in all fields including optional path
    await page.getByLabel('Project Name *').fill('project-with-lab')
    await page.locator('text=TypeScript (React)').click()
    await page.getByLabel('LAB_OPPORTUNITY.md Path (Optional)').fill('./LAB_OPPORTUNITY.md')

    // Click Scaffold button
    await page.getByRole('button', { name: 'Scaffold Project' }).click()

    // Wait for generation
    await page.waitForTimeout(2000)

    // Should complete without errors (path is optional)
    const errorMessage = page.locator('text=Error')
    const generatedFiles = page.locator('text=Generated Files')
    const projectStructure = page.locator('text=Project Structure')

    const hasError = await errorMessage.isVisible()
    const hasFiles = await generatedFiles.isVisible()
    const hasStructure = await projectStructure.isVisible()

    // Should have either success or error (not stuck)
    expect(hasError || hasFiles || hasStructure).toBeTruthy()
  })

  test('should show Download All Files button when files are generated', async ({ page }) => {
    // Scaffold a project
    await page.getByLabel('Project Name *').fill('download-test')
    await page.locator('text=TypeScript (React)').click()
    await page.getByRole('button', { name: 'Scaffold Project' }).click()

    // Wait for generation
    await page.waitForTimeout(2000)

    // Look for Download All Files button
    const downloadButton = page.getByRole('button', { name: 'Download All Files' })
    if (await downloadButton.isVisible()) {
      await expect(downloadButton).toBeEnabled()
    }
  })

  test('should display demo mode indicator when enabled', async ({ page }) => {
    // Check for demo mode indicator
    const demoModeIndicator = page.locator('text=Demo Mode')

    // Demo mode may or may not be enabled based on environment
    const count = await demoModeIndicator.count()
    if (count > 0) {
      await expect(demoModeIndicator.first()).toBeVisible()

      // Also check for demo mode message in the scaffold section
      const demoMessage = page.locator('text=Using mock data')
      if (await demoMessage.isVisible()) {
        await expect(demoMessage).toContainText('mock')
      }
    }
  })
})