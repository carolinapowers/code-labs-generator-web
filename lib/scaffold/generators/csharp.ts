/**
 * C#/ASP.NET Core project scaffold generator (Razor Pages)
 * TODO: When extracting to library, this becomes a standalone package
 */

import { ScaffoldGenerator, ScaffoldConfig, ScaffoldResult, GeneratedFile } from '../types'

export class CSharpScaffoldGenerator implements ScaffoldGenerator {
  async generate(config: ScaffoldConfig): Promise<ScaffoldResult> {
    const files: GeneratedFile[] = []
    const testProjectName = `${config.projectName}.Tests`

    // Main project files
    files.push({
      path: `${config.projectName}.csproj`,
      content: this.generateCsProj(config.projectName),
    })

    files.push({
      path: 'Program.cs',
      content: this.generateProgram(),
    })

    files.push({
      path: 'appsettings.json',
      content: this.generateAppSettings(),
    })

    files.push({
      path: 'appsettings.Development.json',
      content: this.generateAppSettingsDevelopment(),
    })

    // Pages directory
    files.push({
      path: 'Pages/_ViewImports.cshtml',
      content: this.generateViewImports(config.projectName),
    })

    files.push({
      path: 'Pages/_ViewStart.cshtml',
      content: this.generateViewStart(),
    })

    files.push({
      path: 'Pages/Shared/_Layout.cshtml',
      content: this.generateLayout(config.projectName),
    })

    files.push({
      path: 'Pages/Index.cshtml',
      content: this.generateIndexPage(),
    })

    files.push({
      path: 'Pages/Index.cshtml.cs',
      content: this.generateIndexPageModel(config.projectName),
    })

    files.push({
      path: 'Pages/Error.cshtml',
      content: this.generateErrorPage(),
    })

    files.push({
      path: 'Pages/Error.cshtml.cs',
      content: this.generateErrorPageModel(config.projectName),
    })

    // wwwroot files
    files.push({
      path: 'wwwroot/css/site.css',
      content: this.generateSiteCss(),
    })

    files.push({
      path: 'wwwroot/js/site.js',
      content: this.generateSiteJs(),
    })

    files.push({
      path: 'wwwroot/favicon.ico',
      content: '', // Empty placeholder for favicon
    })

    // Solution file
    files.push({
      path: `${config.projectName}.sln`,
      content: this.generateSolution(config.projectName, testProjectName),
    })

    // Test project files
    files.push({
      path: `${testProjectName}/${testProjectName}.csproj`,
      content: this.generateTestCsProj(config.projectName),
    })

    files.push({
      path: `${testProjectName}/UnitTest1.cs`,
      content: this.generateUnitTest(config.projectName),
    })

    files.push({
      path: `${testProjectName}/TestHelpers.cs`,
      content: this.generateTestHelpers(config.projectName),
    })

    files.push({
      path: `${testProjectName}/Usings.cs`,
      content: this.generateTestUsings(),
    })

    // Task runner script
    files.push({
      path: 'task-runner.ps1',
      content: this.generateTaskRunner(),
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
      message: `Successfully scaffolded C#/ASP.NET Core project: ${config.projectName}`,
    }
  }

  private generateCsProj(projectName: string): string {
    const testProjectName = `${projectName}.Tests`
    return `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>${projectName.replace(/-/g, '_')}</RootNamespace>
  </PropertyGroup>

  <ItemGroup>
    <Compile Remove="${testProjectName}/**" />
    <Content Remove="${testProjectName}/**" />
    <EmbeddedResource Remove="${testProjectName}/**" />
    <None Remove="${testProjectName}/**" />
  </ItemGroup>

</Project>
`
  }

  private generateProgram(): string {
    return `var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
`
  }

  private generateAppSettings(): string {
    return JSON.stringify({
      Logging: {
        LogLevel: {
          Default: 'Information',
          'Microsoft.AspNetCore': 'Warning'
        }
      },
      AllowedHosts: '*'
    }, null, 2)
  }

  private generateAppSettingsDevelopment(): string {
    return JSON.stringify({
      Logging: {
        LogLevel: {
          Default: 'Information',
          'Microsoft.AspNetCore': 'Warning'
        }
      }
    }, null, 2)
  }

  private generateViewImports(projectName: string): string {
    return `@using ${this.toPascalCase(projectName)}
@namespace ${this.toPascalCase(projectName)}.Pages
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
`
  }

  private generateViewStart(): string {
    return `@{
    Layout = "_Layout";
}
`
  }

  private generateLayout(projectName: string): string {
    const title = this.toTitleCase(projectName)
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - ${title}</title>
    <link rel="stylesheet" href="~/css/site.css" asp-append-version="true" />
</head>
<body>
    <header>
        <nav>
            <div class="container">
                <a href="/" class="brand">${title}</a>
            </div>
        </nav>
    </header>
    <div class="container">
        <main role="main">
            @RenderBody()
        </main>
    </div>

    <footer>
        <div class="container">
            &copy; 2024 - ${title}
        </div>
    </footer>

    <script src="~/js/site.js" asp-append-version="true"></script>
    @await RenderSectionAsync("Scripts", required: false)
</body>
</html>
`
  }

  private generateIndexPage(): string {
    return `@page
@model IndexModel
@{
    ViewData["Title"] = "Home page";
}

<div class="text-center">
    <h1 class="display-4">Welcome to Your Code Lab Project</h1>
    <p>This project was scaffolded with Code Labs Generator.</p>
    <p>Start building your learning experience!</p>
</div>

<div class="next-steps">
    <h2>Next Steps</h2>
    <ul>
        <li>Review the project structure</li>
        <li>Read the LAB_OPPORTUNITY.md for objectives</li>
        <li>Start implementing your Code Lab steps</li>
    </ul>
</div>
`
  }

  private generateIndexPageModel(projectName: string): string {
    const namespace_name = projectName.replace(/-/g, '_')
    return `using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ${namespace_name}.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {

    }
}
`
  }

  private generateErrorPage(): string {
    return `@page
@model ErrorModel
@{
    ViewData["Title"] = "Error";
}

<h1 class="text-danger">Error.</h1>
<h2 class="text-danger">An error occurred while processing your request.</h2>

@if (Model.ShowRequestId)
{
    <p>
        <strong>Request ID:</strong> <code>@Model.RequestId</code>
    </p>
}

<h3>Development Mode</h3>
<p>
    Swapping to <strong>Development</strong> environment will display more detailed information about the error that occurred.
</p>
<p>
    <strong>The Development environment shouldn't be enabled for deployed applications.</strong>
    It can result in displaying sensitive information from exceptions to end users.
    For local debugging, enable the <strong>Development</strong> environment by setting the <strong>ASPNETCORE_ENVIRONMENT</strong> environment variable to <strong>Development</strong>
    and restarting the app.
</p>
`
  }

  private generateErrorPageModel(projectName: string): string {
    const namespace_name = projectName.replace(/-/g, '_')
    return `using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ${namespace_name}.Pages;

[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
[IgnoreAntiforgeryToken]
public class ErrorModel : PageModel
{
    public string? RequestId { get; set; }

    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

    private readonly ILogger<ErrorModel> _logger;

    public ErrorModel(ILogger<ErrorModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
        RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
    }
}
`
  }

  private generateSiteCss(): string {
    return `html {
  font-size: 14px;
}

@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}

header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 0;
}

.brand {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  text-decoration: none;
}

main {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
}

footer {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  padding: 1.5rem 0;
  margin-top: 3rem;
  text-align: center;
  color: #6c757d;
}

.text-center {
  text-align: center;
}

.display-4 {
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1.2;
}

.next-steps {
  margin-top: 3rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
}

.next-steps h2 {
  margin-top: 0;
}

.next-steps ul {
  list-style-position: inside;
}

.text-danger {
  color: #dc3545;
}
`
  }

  private generateSiteJs(): string {
    return `// Place your site-specific JavaScript here
`
  }

  private generateReadme(projectName: string, opportunityContent?: string): string {
    let readme = `# ${projectName}

This is a Code Lab project generated with Code Labs Generator.

## Getting Started

First, restore dependencies:

\`\`\`bash
dotnet restore
\`\`\`

Then, run the development server:

\`\`\`bash
dotnet run
\`\`\`

Open [https://localhost:5001](https://localhost:5001) with your browser to see the result.

## Learn More

This project was scaffolded as part of a Code Lab learning experience.
`

    if (opportunityContent) {
      readme += `\n## Learning Objectives\n\nThis Code Lab covers:\n\n${opportunityContent.substring(0, 500)}...\n`
    }

    return readme
  }

  private generateGitignore(): string {
    return `## Ignore Visual Studio temporary files, build results, and
## files generated by popular Visual Studio add-ons.

# User-specific files
*.suo
*.user
*.userosscache
*.sln.docstates

# Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
build/
bld/
[Bb]in/
[Oo]bj/

# Visual Studio cache/options directory
.vs/

# .NET Core
project.lock.json
project.fragment.lock.json
artifacts/
`
  }

  private generateSolution(projectName: string, testProjectName: string): string {
    // Generate GUIDs for projects
    const mainProjectGuid = this.generateGuid()
    const testProjectGuid = this.generateGuid()
    const solutionGuid = this.generateGuid()

    return `
Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.0.31903.59
MinimumVisualStudioVersion = 10.0.40219.1
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${projectName}", "${projectName}.csproj", "{${mainProjectGuid}}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${testProjectName}", "${testProjectName}\\${testProjectName}.csproj", "{${testProjectGuid}}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{${mainProjectGuid}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{${mainProjectGuid}}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{${mainProjectGuid}}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{${mainProjectGuid}}.Release|Any CPU.Build.0 = Release|Any CPU
		{${testProjectGuid}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{${testProjectGuid}}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{${testProjectGuid}}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{${testProjectGuid}}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
	GlobalSection(ExtensibilityGlobals) = postSolution
		SolutionGuid = {${solutionGuid}}
	EndGlobalSection
EndGlobal
`
  }

  private generateTestCsProj(projectName: string): string {
    return `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <IsPackable>false</IsPackable>
    <IsTestProject>true</IsTestProject>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="coverlet.collector" Version="6.0.0" />
    <PackageReference Include="FluentAssertions" Version="6.12.0" />
    <PackageReference Include="Microsoft.CodeAnalysis.CSharp" Version="4.8.0" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />
    <PackageReference Include="xunit" Version="2.6.2" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.5.4" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\\${projectName}.csproj" />
  </ItemGroup>

  <ItemGroup>
    <Using Include="Xunit" />
  </ItemGroup>

</Project>
`
  }

  private generateUnitTest(projectName: string): string {
    const namespace_name = projectName.replace(/-/g, '_')
    return `namespace ${namespace_name}.Tests;

public class UnitTest1
{
    [Fact]
    public void Test1()
    {
        // Arrange
        var expected = true;

        // Act
        var actual = true;

        // Assert
        Assert.Equal(expected, actual);
    }
}
`
  }

  private generateTestHelpers(projectName: string): string {
    const namespace_name = projectName.replace(/-/g, '_')
    return `using System.IO;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using FluentAssertions;

namespace ${namespace_name}.Tests
{
    /// <summary>
    /// Helper methods for Code Lab validation tests
    /// </summary>
    public static class TestHelpers
    {
        /// <summary>
        /// Parse a C# file and return the syntax tree
        /// </summary>
        public static SyntaxTree ParseFile(string filePath)
        {
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"File not found: {filePath}");
            }

            var code = File.ReadAllText(filePath);
            return CSharpSyntaxTree.ParseText(code);
        }

        /// <summary>
        /// Get the root CompilationUnitSyntax from a file
        /// </summary>
        public static CompilationUnitSyntax GetCompilationUnit(string filePath)
        {
            var tree = ParseFile(filePath);
            return tree.GetCompilationUnitRoot();
        }

        /// <summary>
        /// Check if a file contains a using statement
        /// </summary>
        public static bool HasUsing(string filePath, string namespaceName)
        {
            var root = GetCompilationUnit(filePath);
            return root.Usings.Any(u => u.Name.ToString() == namespaceName);
        }

        /// <summary>
        /// Check if a file contains a class with the specified name
        /// </summary>
        public static bool HasClass(string filePath, string className)
        {
            var root = GetCompilationUnit(filePath);
            return root.DescendantNodes()
                .OfType<ClassDeclarationSyntax>()
                .Any(c => c.Identifier.Text == className);
        }

        /// <summary>
        /// Check if a class has a method with the specified name
        /// </summary>
        public static bool ClassHasMethod(string filePath, string className, string methodName)
        {
            var root = GetCompilationUnit(filePath);
            var classDecl = root.DescendantNodes()
                .OfType<ClassDeclarationSyntax>()
                .FirstOrDefault(c => c.Identifier.Text == className);

            if (classDecl == null) return false;

            return classDecl.DescendantNodes()
                .OfType<MethodDeclarationSyntax>()
                .Any(m => m.Identifier.Text == methodName);
        }

        /// <summary>
        /// Get the path to a file in the main project
        /// </summary>
        public static string GetProjectFile(string relativePath)
        {
            var solutionRoot = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "../../../.."));
            var mainProjectPath = Directory.GetDirectories(solutionRoot)
                .FirstOrDefault(d => !d.Contains(".Tests") && Directory.GetFiles(d, "*.csproj").Any());

            if (mainProjectPath == null)
            {
                throw new DirectoryNotFoundException("Could not find main project directory");
            }

            return Path.Combine(mainProjectPath, relativePath);
        }
    }
}
`
  }

  private generateTestUsings(): string {
    return `global using Xunit;
`
  }

  private generateTaskRunner(): string {
    return `# PowerShell test runner for Code Lab validation
param(
    [Parameter(Mandatory=$true)]
    [string]$TestFile,

    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Tags
)

$ErrorActionPreference = "Stop"

# Change to project root
Set-Location $PSScriptRoot

# Build the test project
Write-Host "Building test project..." -ForegroundColor Cyan
dotnet build --nologo --verbosity quiet

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}

# Run tests with tags if provided
if ($Tags.Length -gt 0) {
    $filter = "DisplayName~$($Tags -join '|')"
    Write-Host "Running tests with filter: $filter" -ForegroundColor Cyan
    dotnet test --nologo --no-build --filter "$filter"
} else {
    Write-Host "Running all tests in $TestFile" -ForegroundColor Cyan
    dotnet test --nologo --no-build
}

exit $LASTEXITCODE
`
  }

  private generateStepCommand(): string {
    return `Create a new Code Lab step with tests and solution template.

Usage: /step <step-number> "<title>" "<description>"

Example: /step 2 "Add Authentication" "Implement JWT authentication for the API"

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
1. Execute xUnit tests with appropriate filters
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

  // Helper methods
  private toPascalCase(str: string): string {
    return str.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase())
  }

  private toTitleCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16).toUpperCase()
    })
  }
}
