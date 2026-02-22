/**
 * Scaffold Generator Entry Point
 *
 * This module provides the main interface for scaffolding projects.
 * When extracted to a library, this will be the main export.
 *
 * Usage:
 *   import { scaffold } from '@code-labs/scaffold-generator'
 *   const result = await scaffold({ projectName: 'my-project', language: 'typescript' })
 */

import { ScaffoldConfig, ScaffoldResult } from './types'
import { TypeScriptScaffoldGenerator } from './generators/typescript'
import { CSharpScaffoldGenerator } from './generators/csharp'
import { GoScaffoldGenerator } from './generators/go'

/**
 * Main scaffold function
 * Generates a project based on the provided configuration
 */
export async function scaffold(config: ScaffoldConfig): Promise<ScaffoldResult> {
  const generator = getGenerator(config.language)
  return await generator.generate(config)
}

/**
 * Factory function to get the appropriate generator
 */
function getGenerator(language: ScaffoldConfig['language']) {
  switch (language) {
    case 'typescript':
      return new TypeScriptScaffoldGenerator()
    case 'csharp':
      return new CSharpScaffoldGenerator()
    case 'go':
      return new GoScaffoldGenerator()
    default:
      throw new Error(`Unsupported language: ${language}`)
  }
}

// Re-export types for consumers
export * from './types'
