<<<<<<< HEAD

=======
# Judgify Architecture

## Overview
Judgify is a Next.js application built as a feature-driven platform for planning and validating figure skating programs. It is designed around a home assistant entry experience and a planner workspace. The app assembles UI features, planner logic, and domain rules while keeping most business behavior on the client side.

## Stack
- Next.js 16 app router
- React 19
- TypeScript
- Tailwind CSS
- `lucide-react` for icons

## App Routes
- `/` — home landing page and assistant entry point
- `/planner` — planner workspace for building technical programs
- `/video` — video analysis placeholder
- `/live` — live analysis placeholder
- `/athletes` — athletes management placeholder

## Main Folder Structure
- `app/`
  - Route pages and the global layout
  - `globals.css` for appwide styling
- `features/home/`
  - Home landing and assistant prompt experience
  - Quick actions, recent activity, and schema creation UI
- `features/planner/`
  - Planner workspace and program editor
  - Element selection, technical sheet, coaching assistant, and scoring engines
  - Planner rules and validation
- `features/core/`
  - Shared global context engine used for cross-page schema state
- `features/dashboard/`
  - Dashboard UI modules that are not currently routed
- `shared/components/`
  - Reusable UI primitives such as `Button`, `Card`, and `PageHeader`
- `data/`
  - Static domain data for choreography and element repositories
- `types/`
  - Shared TypeScript models for program and scoring domains
- `docs/`
  - Documentation placeholders and product notes
- `core/`
  - Present but unused in the current app logic
- `services/`
  - Empty placeholder directory for future backend or service integration

## Feature Modules
### Home
- `features/home/pages/WelcomeExperience.tsx`
- `features/home/components/AiPrompt.tsx`
- `features/home/components/AssistantResponse.tsx`
- `features/home/components/QuickActions.tsx`
- `features/home/components/RecentActivity.tsx`
- `features/home/components/SchemaWizard.tsx`
- `features/home/assistant/AssistantEngine.ts`
- `features/home/assistant/intents.ts`

### Planner
- `app/planner/page.tsx`
- `features/planner/components/workspace/PlannerWorkspace.tsx`
- `features/planner/components/workspace/WorkspaceLibrary.tsx`
- `features/planner/components/workspace/TechnicalPanel.tsx`
- `features/planner/components/workspace/TechnicalSheet.tsx`
- `features/planner/components/workspace/WorkspaceProgram.tsx`
- `features/planner/components/workspace/WorkspaceHeader.tsx`
- `features/planner/components/workspace/WorkspaceAssistant.tsx`
- `features/planner/components/workspace/technical-sheet/TechnicalElementCard.tsx`
- `features/planner/components/assistant/CoachAssistant.tsx`
- `features/planner/components/ProgramEditor.tsx`
- `features/planner/components/ElementPicker.tsx`
- `features/planner/components/ElementList.tsx`
- `features/planner/components/ScorePanel.tsx`

### Planner Context & State
- `features/planner/context/WorkspaceContext.tsx`
- `features/planner/context/PlannerContext.tsx`
- `features/planner/context/AssistantContext.tsx`
- `features/planner/hooks/useAssistant.ts`
- `features/planner/types/assistant.ts`

### Engines and Rules
- `features/planner/engine/TechnicalEngine.ts`
- `features/planner/engine/DifficultyEngine.ts`
- `features/planner/engine/ValidationEngine.ts`
- `features/planner/rules/ProgramRules.ts`
- `features/planner/rules/categories.ts`
- `features/planner/rules/disciplines.ts`
- `features/planner/rules/programTypes.ts`
- `features/planner/rules/goe/jumps.ts`

### Shared Core
- `features/core/context/ContextEngine.ts`
- `features/core/context/types.ts`

## State Flow
- `ContextEngine` acts as a global singleton storing the active schema context (`athlete`, `category`, `discipline`, and `currentModule`).
- The planner workspace reads from `ContextEngine` to determine whether a schema is active.
- `WorkspaceContext` manages planner program elements and provides operations to add, update, reorder, and remove elements.
- `PlannerContext` exists as a higher-level planner state holder but is not fully wired into the active planner route.
- `AssistantContext` is defined for assistant flows but is not clearly consumed by the current page structure.

## Scoring and Validation Architecture
- `TechnicalEngine` calculates the technical score as `baseValue + goe + pcs - deductions`, but PCS and deductions are currently unimplemented placeholders.
- `DifficultyEngine` derives a difficulty score and athlete level from element counts, base values, and GOE.
- `ValidationEngine` applies category-specific maximums and repeated-element warnings using rules from `ProgramRules`.
- Category definitions provide concrete constraints such as maximum jumps, spins, and sequences.

## Disconnected and Incomplete Areas
- Dashboard modules exist under `features/dashboard/` but are not exposed through any route.
- Several planner modules are incomplete or unused, including `features/planner/index.ts` and `features/planner/plannerData.ts`.
- `core/` and `services/` are present but empty or inactive.
- Placeholder routes exist for `/video`, `/live`, and `/athletes`.
- `docs/architecture.md` is empty, indicating documentation gaps.
- There are duplicate domain types in top-level `types/` and `features/planner/types/`.

## Architectural Risks
- Global mutable state via `ContextEngine` is brittle and not aligned with React/Next.js best practices.
- In-memory planner state is not persisted; page refresh loses the current program.
- The planner assistant flow is partially wired and may lead to inconsistent behavior.
- Empty feature modules and folders create confusion about the intended architecture.
- The app currently lacks a backend or service integration layer.

## Summary
Judgify is a structured prototype for figure skating program planning with a clear home-to-planner path. Its core architecture is in place, but state management, scoring completeness, and feature wiring need stabilization before expansion.
>>>>>>> 034504a (Sprint 1: Foundation and architecture)
