/**
 * Go project scaffold generator
 * TODO: When extracting to library, this becomes a standalone package
 */

import { ScaffoldGenerator, ScaffoldConfig, ScaffoldResult, GeneratedFile } from '../types'

export class GoScaffoldGenerator implements ScaffoldGenerator {
  async generate(config: ScaffoldConfig): Promise<ScaffoldResult> {
    const files: GeneratedFile[] = []

    // go.mod
    files.push({
      path: 'go.mod',
      content: this.generateGoMod(config.projectName),
    })

    // main.go
    files.push({
      path: 'main.go',
      content: this.generateMain(config.projectName, config.opportunityContent),
    })

    // task-runner.sh
    files.push({
      path: 'task-runner.sh',
      content: this.generateTaskRunner(),
    })

    // test_helpers.go
    files.push({
      path: 'test_helpers.go',
      content: this.generateTestHelpers(),
    })

    // README
    files.push({
      path: 'README.md',
      content: this.generateReadme(config.projectName, config.opportunityContent),
    })

    // Git ignore
    files.push({
      path: '.gitignore',
      content: this.generateGitignore(),
    })

    // LAB_OPPORTUNITY.md if content provided
    if (config.opportunityContent) {
      files.push({
        path: 'LAB_OPPORTUNITY.md',
        content: config.opportunityContent,
      })
    }

    // .claude/commands directory
    files.push({
      path: '.claude/commands/step.md',
      content: this.generateStepCommand(),
    })

    files.push({
      path: '.claude/commands/test.md',
      content: this.generateTestCommand(),
    })

    files.push({
      path: '.claude/commands/solution.md',
      content: this.generateSolutionCommand(),
    })

    return {
      files,
      message: `Successfully scaffolded Go project: ${config.projectName}`,
    }
  }

  private generateGoMod(projectName: string): string {
    const moduleName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    return `module ${moduleName}

go 1.21
`
  }

  private generateMain(projectName: string, opportunityContent?: string): string {
    const title = opportunityContent ? this.extractTitle(opportunityContent) : projectName
    return `package main

import "fmt"

func main() {
	fmt.Println("Welcome to ${title}!")
	fmt.Println("This is a Pluralsight Code Lab")
	fmt.Println()
	fmt.Println("Follow the steps to complete the lab:")
	fmt.Println("1. Read each STEP{n}.md file for instructions")
	fmt.Println("2. Complete the tasks described")
	fmt.Println("3. Run './task-runner.sh {step}' to validate your work")
	fmt.Println("4. Once all tests pass, move to the next step")
}
`
  }

  private generateTaskRunner(): string {
    return `#!/usr/bin/env bash

# Colors for output
RED='\\033[0;31m'
YELLOW='\\033[1;33m'
GREEN='\\033[0;32m'
NC='\\033[0m' # No Color

# Check if step number is provided
if [[ -z "$1" ]]; then
  echo -e "\${RED}Usage: ./task-runner.sh <step-number> [tags...]\${NC}"
  echo "Example: ./task-runner.sh 2"
  echo "Example: ./task-runner.sh 2 @2.1 @2.2"
  exit 1
fi

STEP_NUMBER=$1
shift # Remove step number from arguments, leaving only tags

# Check if Go is installed
if ! command -v go &> /dev/null; then
  echo -e "\${RED}Go is not installed. Please install Go first: https://golang.org/dl/\${NC}"
  exit 1
fi

# Check if test file exists
TEST_FILE="step\${STEP_NUMBER}_test.go"
if [[ ! -f "$TEST_FILE" ]]; then
  echo -e "\${RED}Test file not found: $TEST_FILE\${NC}"
  echo "This step has not been created yet."
  exit 1
fi

# Build test pattern
TEST_PATTERN="TestStep\${STEP_NUMBER}_"

# If tags are provided, filter tests
if [[ $# -gt 0 ]]; then
  echo -e "\${YELLOW}Running specific tests for step \${STEP_NUMBER}: $@\${NC}"
  TASKS=""
  for tag in "$@"; do
    TASK_NUM=$(echo "$tag" | sed 's/@[0-9]*\\.//')
    if [[ -n "$TASKS" ]]; then
      TASKS="\${TASKS}|Task\${TASK_NUM}"
    else
      TASKS="Task\${TASK_NUM}"
    fi
  done
  TEST_PATTERN="TestStep\${STEP_NUMBER}_(\${TASKS})"
else
  echo -e "\${YELLOW}Running all tests for step \${STEP_NUMBER}...\${NC}"
fi

# Run tests with verbose output
go test -v -run "$TEST_PATTERN" .

exit_code=$?
if [[ $exit_code -eq 0 ]]; then
  echo -e "\${GREEN}✓ All tests passed!\${NC}"
else
  echo -e "\${RED}✗ Some tests failed. Review the output above.\${NC}"
fi

exit $exit_code
`
  }

  private generateTestHelpers(): string {
    return `package main

import (
	"go/ast"
	"go/parser"
	"go/token"
	"os"
)

// FileExists checks if a file exists
func FileExists(filepath string) bool {
	_, err := os.Stat(filepath)
	return !os.IsNotExist(err)
}

// ParseGoFile parses a Go source file and returns the AST
func ParseGoFile(filepath string) (*ast.File, *token.FileSet, error) {
	fset := token.NewFileSet()
	node, err := parser.ParseFile(fset, filepath, nil, parser.ParseComments)
	if err != nil {
		return nil, nil, err
	}
	return node, fset, nil
}

// HasFunction checks if a file contains a function with the given name
func HasFunction(filepath string, functionName string) bool {
	node, _, err := ParseGoFile(filepath)
	if err != nil {
		return false
	}

	for _, decl := range node.Decls {
		if fn, ok := decl.(*ast.FuncDecl); ok {
			if fn.Name.Name == functionName {
				return true
			}
		}
	}
	return false
}

// HasStruct checks if a file contains a struct with the given name
func HasStruct(filepath string, structName string) bool {
	node, _, err := ParseGoFile(filepath)
	if err != nil {
		return false
	}

	for _, decl := range node.Decls {
		if gen, ok := decl.(*ast.GenDecl); ok {
			for _, spec := range gen.Specs {
				if ts, ok := spec.(*ast.TypeSpec); ok {
					if _, isStruct := ts.Type.(*ast.StructType); isStruct {
						if ts.Name.Name == structName {
							return true
						}
					}
				}
			}
		}
	}
	return false
}

// HasImport checks if a file imports a specific package
func HasImport(filepath string, packagePath string) bool {
	node, _, err := ParseGoFile(filepath)
	if err != nil {
		return false
	}

	for _, imp := range node.Imports {
		if imp.Path.Value == "\\""+packagePath+"\\"" {
			return true
		}
	}
	return false
}
`
  }

  private generateReadme(projectName: string, opportunityContent?: string): string {
    let readme = `# ${projectName}

This is a Code Lab project generated with Code Labs Generator.

## Getting Started

First, download dependencies:

\`\`\`bash
go mod download
\`\`\`

Then, run the development server:

\`\`\`bash
go run main.go
\`\`\`

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

## Learn More

This project was scaffolded as part of a Code Lab learning experience.
`

    if (opportunityContent) {
      readme += `\n## Learning Objectives\n\nThis Code Lab covers:\n\n${opportunityContent.substring(0, 500)}...\n`
    }

    return readme
  }

  private generateGitignore(): string {
    return `# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary, built with \`go test -c\`
*.test

# Output of the go coverage tool
*.out

# Dependency directories
vendor/

# Go workspace file
go.work

# IDE specific files
.idea/
.vscode/
*.swp
*.swo
*~

# OS specific files
.DS_Store
Thumbs.db

# Project specific
*.log
`
  }

  private generateStepCommand(): string {
    return `Create a new Code Lab step with tests and solution template.

Usage: /step <step-number> "<title>" "<description>"

Example: /step 2 "Add HTTP Handler" "Implement a new HTTP endpoint"

This command will:
1. Create STEP{N}.md with tasks and requirements
2. Generate test file for validation
3. Create SOLUTION{N}.md template
4. Set up the step branch structure
`
  }

  private generateTestCommand(): string {
    return `Run tests for a specific Code Lab step.

Usage: /test [step-number] [tags]

Examples:
  /test 2          # Run all tests for step 2
  /test 2 @2.1     # Run tests tagged with @2.1
  /test            # Run all tests

This command will:
1. Execute Go tests with appropriate filters
2. Show detailed test results
3. Highlight any failures
`
  }

  private generateSolutionCommand(): string {
    return `Apply the solution for a specific Code Lab step.

Usage: /solution <step-number>

Example: /solution 2

This command will:
1. Read SOLUTION{N}.md
2. Apply all code changes
3. Verify tests pass
4. Show what was implemented
`
  }

  private extractTitle(content: string): string {
    const h1Match = content.match(/^#\s+(.+)$/m)
    if (h1Match) {
      return h1Match[1].trim().replace(/^Code Lab Opportunity:\s*/i, '').replace(/^Lab:\s*/i, '')
    }
    return 'Code Lab'
  }
}
