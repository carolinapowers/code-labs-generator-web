export const DEMO_LAB_OPPORTUNITY = `# Code Lab Opportunity: Building an Order Form with React

## Overview
This Code Lab teaches learners how to build a fully functional order form using React with proper validation and state management.

## Learning Objectives
After completing this Code Lab, learners will be able to:
1. Create controlled form components in React
2. Implement form validation using Zod
3. Manage complex form state with React hooks
4. Handle form submission and error states

## Metadata
- **Skill Path**: React 18
- **Skill Level**: Intermediate
- **Duration**: 45-60 minutes
- **Technology**: React, TypeScript

## Steps Overview

### Step 1: Setup Project Structure
Create the basic React project and install dependencies.

**Tasks:**
- Initialize React project with TypeScript
- Install form validation library (Zod)
- Set up project folder structure

### Step 2: Create Form Component
Build the order form UI with all necessary fields.

**Tasks:**
- Create OrderForm component
- Add form fields (name, email, quantity, etc.)
- Style the form with Tailwind CSS

### Step 3: Implement Validation
Add client-side validation using Zod.

**Tasks:**
- Define Zod schema for form data
- Integrate validation with form inputs
- Display validation errors to users

### Step 4: Handle Form Submission
Process the form data when submitted.

**Tasks:**
- Create submit handler function
- Handle success and error states
- Display confirmation message

## Success Criteria
- Form validates all inputs correctly
- Error messages are clear and helpful
- Form can be successfully submitted
- Code follows React best practices

## Additional Resources
- React documentation on forms
- Zod validation library docs
- Tailwind CSS form styling guide
`

export function generateDemoLabOpportunity(title: string, objectives: string[]): string {
  return `# Code Lab Opportunity: ${title}

## Overview
This Code Lab teaches learners ${title.toLowerCase()}.

## Learning Objectives
After completing this Code Lab, learners will be able to:
${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

## Metadata
- **Skill Path**: Web Development
- **Skill Level**: Intermediate
- **Duration**: 45-60 minutes

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
- Tests pass successfully

## Additional Resources
- Relevant documentation
- Tutorial guides
- Community resources
`
}
