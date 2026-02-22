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
      content: this.generateMain(),
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

    return {
      files,
      message: `Successfully scaffolded Go project: ${config.projectName}`,
    }
  }

  private generateGoMod(projectName: string): string {
    return `module ${projectName}

go 1.21

require (
	github.com/gorilla/mux v1.8.1
)
`
  }

  private generateMain(): string {
    return `package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/", homeHandler).Methods("GET")
	r.HandleFunc("/api/health", healthHandler).Methods("GET")

	fmt.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, \`{"message": "Welcome to your Code Lab project"}\`)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, \`{"status": "healthy"}\`)
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
`
  }
}
