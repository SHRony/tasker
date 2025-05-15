# 🧱 Architecture: Tasker

This document outlines the high-level architecture of **Tasker** — an interactive, step-based task executor for AI-powered workflows.

---

## 🧩 Components Overview

Each **task** is defined as a series of **steps**, and each step contains multiple **components**. Components are the fundamental units that handle user interaction, processing, or display logic.

### Component Categories

Tasker organizes components into **three core types**:

| Type               | Purpose                             |
|--------------------|-------------------------------------|
| **DisplayComponent**     | Show static or dynamic information to the user |
| **ActionComponent**      | Perform logic like calling an AI model or API |
| **InteractionComponent** | Collect input from the user (text, files, etc.) |

> 🔍 **Note:** The JSON schema definitions for all component types can be found in [`types/component_schema.ts`](./types/component_schema.ts)

Each component is responsible for reporting:
- **Output** (`putRecord`)
- **Readiness** (`setReady`)
- **Dependencies** (via interpolation from global records)

---

## 🧠 State Management

Tasker uses a hybrid state management approach combining React Context for global state and local state for step-specific data.

### 1. Global Records Context
- Maintained by `RecordsContext` and `RecordsProvider` in `TaskExecutor`
- Provides `getRecords()` function to all components via context
- Centralized access to all data produced throughout the task
- Components access records using the `useRecords` hook
- Records are accumulated as steps are completed

### 2. Local State Management
- `TaskExecutor` maintains the global records state
- `StepExecutor` maintains local records state for the current step
- Records are merged into global state when a step is completed
- Each component manages its own internal state (e.g., loading, error states)
- Component-specific state is isolated and doesn't affect other components

### 3. Component Readiness
- Each component must mark itself as "ready" via `setReady` prop
- A step can only be completed when **all components report readiness**
- Managed via a `readyMap` in `StepExecutor`

---

## 🧱 Executor Components

The execution of a task flows through a hierarchy of **executor components**.

### 1. `TaskExecutor`
- Root component that receives the task definition (JSON)
- Manages:
  - The active step index
  - The global `records` store via `RecordsProvider`
  - The transition between steps
- Provides record access to all child components via context
- Renders a single `StepExecutor` at a time

### 2. `StepExecutor`
- Responsible for executing one step at a time
- Maintains:
  - Local `records` buffer for step-specific data
  - `readyMap` for component readiness
- Controls visibility and activation of the **"Continue"** button
- Merges local records with global records on step completion

### 3. `ComponentExecutor`
- Dispatcher that renders the correct executor based on component type
- Delegates rendering to:
  - `DisplayComponentExecutor`
  - `ActionComponentExecutor`
  - `InteractionComponentExecutor`

### 4. `[ComponentType]Executor` (e.g., `AskAIExecutor`, `TextInputExecutor`)
- Executes specific component logic
- Accepts props:
  - `putRecord`
  - `getRecords` (via context)
  - `setReady`
  - `config` (component-specific config)
- Reports output and readiness back to the step

---

## 🔄 Data Flow Summary

1. `TaskExecutor` receives the full task JSON and initializes global records
2. It loads the first step and renders `StepExecutor`
3. `StepExecutor` maintains local records and renders components via `ComponentExecutor`
4. Each component:
   - Reads from global records via context
   - Writes to local step buffer (`putRecord`)
   - Reports readiness via `setReady`
5. When all components are ready, user clicks **Continue**
6. Local step records are merged into global records
7. `TaskExecutor` advances to the next step

---

## 📦 Interpolation and Dependencies

- Components can reference outputs from previous steps using the syntax `${component_id}`
- The `interpolateText` helper function in `lib/helpers.ts` handles variable interpolation
- Takes a text string and a getter function to resolve variables
- Returns the text with variables replaced by their values
- Keeps original placeholders if variables are not found
- Used by components to resolve dynamic content in prompts and text
- Example: If a text input component has id "user_name", its value can be referenced as "${user_name}"

---

## 🤖 LLM Integration

Tasker uses a provider-based approach for LLM integration:

### Provider Interface
- `AIProviderInterface` defines the contract for LLM providers
- Currently supports:
  - `GeminiProvider`: Google's Gemini model implementation
- Future providers can be added by implementing the interface

### Configuration
- LLM providers require API keys set in environment variables
- Example: `GEMINI_API_KEY` for Gemini provider
- See `.env.example` for required environment variables

### Usage
- Components use the provider through the singleton instance
- Example: `geminiProvider.generateResponse(prompt)`
- Error handling and retries are managed by the provider

---

## 🛤 Future Architectural Considerations

- Conditional logic for branching workflows
- Error boundaries and retry logic
- Plugin system for custom component types
- Execution tracing / debugging layer

---

## 📁 File Structure

Tasker follows a modern Next.js project structure with clear separation of concerns:

```
tasker/
├── src/                    # Source code directory
│   ├── app/               # Next.js app router pages and layouts
│   │   └── page.tsx       # Main application page with TaskExecutor
│   ├── components/        # React components
│   │   └── executors/     # Component executors
│   │       ├── TextExecutor.tsx
│   │       ├── TextInputExecutor.tsx
│   │       └── AiAnalysisExecutor.tsx
│   ├── contexts/         # React Context providers
│   │   └── RecordsContext.tsx  # Global records management
│   ├── types/            # TypeScript type definitions
│   │   └── component_schema.ts  # Task and component schema definitions
│   ├── lib/              # Utility functions and shared logic
│   │   └── helpers.ts    # Shared helper functions including interpolation
│   └── data/             # Static data and configurations
│       └── sampleTasks.ts # Sample task definitions
├── public/               # Static assets
├── types/               # Global TypeScript declarations
└── [config files]       # Various configuration files
```

### Key Directories

- **`src/app/`**: Contains the main application pages and layouts using Next.js 13+ app router
  - `page.tsx`: Main application page containing the TaskExecutor component
- **`src/components/`**: Houses all React components
  - `executors/`: Implementation of component executors
    - `TextExecutor.tsx`: Renders text display components
    - `TextInputExecutor.tsx`: Handles text input components
    - `AiAnalysisExecutor.tsx`: Manages AI analysis components
- **`src/contexts/`**: React Context providers
  - `RecordsContext.tsx`: Manages global records access and state
- **`src/types/`**: TypeScript interfaces and type definitions
  - `component_schema.ts`: Core task and component schema definitions
- **`src/lib/`**: Shared utilities and business logic
  - `helpers.ts`: Common utility functions including text interpolation
- **`src/data/`**: Static data and configurations
  - `sampleTasks.ts`: Sample task definitions for testing and development

### Configuration Files

- `next.config.js`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project dependencies and scripts
- `eslint.config.mjs`: ESLint configuration
- `postcss.config.mjs`: PostCSS configuration

---

> 🗂 This document is a living specification and will evolve as the platform matures.
