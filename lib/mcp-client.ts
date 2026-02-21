/**
 * MCP Client
 * High-level interface for MCP server operations
 */

import { MCPTransport, getMCPTransport } from './mcp-transport'
import { BrainstormFormData, ScaffoldFormData, StepFormData } from './types'

export interface MCPClientConfig {
  serverUrl: string
}

export class MCPClient {
  private transport: MCPTransport
  private serverUrl: string
  private connected: boolean = false

  constructor(config: MCPClientConfig) {
    this.serverUrl = config.serverUrl

    this.transport = getMCPTransport({
      serverUrl: this.serverUrl,
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
    })
  }

  async connect(): Promise<void> {
    if (!this.transport) {
      throw new Error('MCP transport not initialized')
    }

    try {
      await this.transport.connect()
      this.connected = true
      console.log('Connected to MCP server at:', this.serverUrl)
    } catch (error) {
      console.error('Failed to connect to MCP server:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.transport && this.connected) {
      await this.transport.disconnect()
      this.connected = false
    }
  }

  isConnected(): boolean {
    return this.connected
  }

  /**
   * Brainstorm tool - generates LAB_OPPORTUNITY.md
   */
  async brainstormLabOpportunity(data: BrainstormFormData & { provider?: string }): Promise<any> {
    if (!this.transport || !this.connected) {
      throw new Error('MCP client not connected')
    }

    try {
      const result = await this.transport.callTool('brainstorm_lab_opportunity', {
        title: data.title,
        learningObjectives: data.learningObjectives,
        skillPath: data.skillPath,
        skillLevel: data.skillLevel,
        duration: data.duration,
        technology: data.technology,
        provider: data.provider || 'template',
      })

      return result.content || result
    } catch (error) {
      console.error('Brainstorm tool call failed:', error)
      throw error
    }
  }

  /**
   * Scaffold React project
   */
  async scaffoldReactProject(data: ScaffoldFormData): Promise<any> {
    if (!this.transport || !this.connected) {
      throw new Error('MCP client not connected')
    }

    try {
      const result = await this.transport.callTool('scaffold_react_project', {
        projectName: data.projectName,
        opportunityPath: data.opportunityPath,
        targetDirectory: '.',
      })

      return result
    } catch (error) {
      console.error('Scaffold React project failed:', error)
      throw error
    }
  }

  /**
   * Scaffold C# project
   */
  async scaffoldCSharpProject(data: ScaffoldFormData): Promise<any> {
    if (!this.transport || !this.connected) {
      throw new Error('MCP client not connected')
    }

    try {
      const result = await this.transport.callTool('scaffold_csharp_project', {
        projectName: data.projectName,
        opportunityPath: data.opportunityPath,
        targetDirectory: '.',
      })

      return result
    } catch (error) {
      console.error('Scaffold C# project failed:', error)
      throw error
    }
  }

  /**
   * Scaffold Go project
   */
  async scaffoldGoProject(data: ScaffoldFormData): Promise<any> {
    if (this.demoMode) {
      return this.generateDemoScaffoldFiles('go')
    }

    if (!this.transport || !this.connected) {
      throw new Error('MCP client not connected')
    }

    try {
      const result = await this.transport.callTool('scaffold_go_project', {
        projectName: data.projectName,
        opportunityPath: data.opportunityPath,
        targetDirectory: '.',
      })

      return result
    } catch (error) {
      console.error('Scaffold Go project failed:', error)
      throw error
    }
  }

  /**
   * Create step
   */
  async createStep(data: StepFormData): Promise<any> {
    if (this.demoMode) {
      return this.generateDemoStep(data)
    }

    if (!this.transport || !this.connected) {
      throw new Error('MCP client not connected')
    }

    try {
      const result = await this.transport.callTool('create_step', {
        stepNumber: data.stepNumber,
        title: data.title,
        tasks: data.tasks,
      })

      return result
    } catch (error) {
      console.error('Create step failed:', error)
      throw error
    }
  }

  /**
   * Run tests for a step
   */
  async runTests(stepNumber: number, tags?: string[]): Promise<any> {
    if (this.demoMode) {
      return this.generateDemoTestResults(stepNumber)
    }

    if (!this.transport || !this.connected) {
      throw new Error('MCP client not connected')
    }

    try {
      const result = await this.transport.callTool('run_tests', {
        stepNumber,
        tags,
      })

      return result
    } catch (error) {
      console.error('Run tests failed:', error)
      throw error
    }
  }

  /**
   * List available tools
   */
  async listTools(): Promise<string[]> {
    if (this.demoMode) {
      return [
        'brainstorm_lab_opportunity',
        'scaffold_react_project',
        'scaffold_csharp_project',
        'scaffold_go_project',
        'create_step',
        'run_tests',
        'add_solution',
      ]
    }

    if (!this.transport || !this.connected) {
      throw new Error('MCP client not connected')
    }

    try {
      const tools = await this.transport.listTools()
      return tools.map((tool: any) => tool.name)
    } catch (error) {
      console.error('List tools failed:', error)
      throw error
    }
  }

  /**
   * Test connection to MCP server
   */
  async testConnection(): Promise<boolean> {
    if (this.demoMode) {
      return true
    }

    if (!this.transport) {
      return false
    }

    try {
      // Use the client's connect method to properly set connected flag
      await this.connect()
      return true
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }

  // Demo data generators
  private generateDemoLabOpportunity(data: BrainstormFormData): string {
    return `# Code Lab Opportunity: ${data.title}

## Overview
This Code Lab teaches learners ${data.title.toLowerCase()}.

## Learning Objectives
After completing this Code Lab, learners will be able to:
${data.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

## Metadata
- **Skill Path**: ${data.skillPath || 'Web Development'}
- **Skill Level**: ${data.skillLevel || 'Intermediate'}
- **Duration**: ${data.duration || '45-60 minutes'}
- **Technology**: ${data.technology || 'React'}

## Steps Overview

### Step 1: Setup and Introduction
Set up the development environment and understand the basics.

**Tasks:**
- Initialize the project
- Install necessary dependencies
- Review project structure

### Step 2: Core Implementation
Implement the main functionality.

**Tasks:**
- Build the core features
- Add necessary logic
- Test the implementation

### Step 3: Refinement and Testing
Polish the implementation and add tests.

**Tasks:**
- Add error handling
- Write unit tests
- Optimize performance

## Success Criteria
- All objectives are met
- Code follows best practices
- Tests pass successfully`
  }

  private generateDemoScaffoldFiles(language: string): any {
    const files: any = {}

    if (language === 'typescript') {
      files['package.json'] = `{
  "name": "code-lab-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`
      files['src/App.tsx'] = `import React from 'react'

export default function App() {
  return <div>Hello Code Lab!</div>
}`
      files['README.md'] = '# Code Lab Project\n\nGenerated with Code Lab Generator'
    } else if (language === 'csharp') {
      files['Program.cs'] = `using System;

namespace CodeLab
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello Code Lab!");
        }
    }
}`
      files['CodeLab.csproj'] = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
</Project>`
    } else if (language === 'go') {
      files['main.go'] = `package main

import "fmt"

func main() {
    fmt.Println("Hello Code Lab!")
}`
      files['go.mod'] = `module codelab

go 1.21`
    }

    return {
      files: Object.entries(files).map(([path, content]) => ({
        path,
        content,
      })),
      message: `Successfully scaffolded ${language} project`,
    }
  }

  private generateDemoStep(data: StepFormData): any {
    return {
      stepFile: `# Step ${data.stepNumber}: ${data.title}\n\n${data.tasks
        .map(t => `- [ ] ${t.title}`)
        .join('\n')}`,
      solutionFile: `# Solution ${data.stepNumber}\n\nImplementation details...`,
      testFile: `// Test file for step ${data.stepNumber}\ntest('${data.title}', () => {})`,
    }
  }

  private generateDemoTestResults(stepNumber: number): any {
    return {
      passed: Math.random() > 0.3,
      tests: [
        { name: `Test ${stepNumber}.1`, passed: true },
        { name: `Test ${stepNumber}.2`, passed: Math.random() > 0.5 },
      ],
      output: `Running tests for step ${stepNumber}...\nTest execution complete.`,
    }
  }
}

// Singleton instance
let mcpClientInstance: MCPClient | null = null

export function getMCPClient(config?: MCPClientConfig): MCPClient {
  if (!mcpClientInstance && config) {
    mcpClientInstance = new MCPClient(config)
  }

  if (!mcpClientInstance) {
    // Default to demo mode if no config provided
    mcpClientInstance = new MCPClient({
      serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3001',
      demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
    })
  }

  return mcpClientInstance
}

export default MCPClient