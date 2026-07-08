<<<<<<< HEAD

=======
# Judgify Roadmap

## Completed Work
- Bootstrapped a Next.js 16 app with React 19 and Tailwind CSS.
- Implemented a home landing experience with assistant prompt and quick action cards.
- Built a planner workspace UI with element library, technical sheet, and program editor.
- Added a global schema context engine (`ContextEngine`) for cross-route state.
- Implemented core scoring engine modules:
  - `TechnicalEngine`
  - `DifficultyEngine`
  - `ValidationEngine`
- Defined skating rules and data models:
  - category rules in `features/planner/rules/categories.ts`
  - disciplines and program types
  - jump GOE value table in `features/planner/rules/goe/jumps.ts`
- Created reusable shared UI components in `shared/components/`.
- Added planner state context for element operations in `features/planner/context/WorkspaceContext.tsx`.

## Work In Progress
- Planner route integration is partially complete but still relies on the global `ContextEngine`.
- Assistant flow is available in the home experience but not fully integrated into planner context.
- `TechnicalEngine` has score placeholders for `pcs` and `deductions`.
- `ValidationEngine` uses hardcoded discipline and program type defaults.
- Planner contexts such as `PlannerContext` and `AssistantContext` are implemented but not fully wired.
- Dashboard UI modules exist but are not connected to routes.

## Existing Modules
### Routing and App Shell
- `app/layout.tsx`
- `app/page.tsx`
- `app/planner/page.tsx`
- `app/video/page.tsx`
- `app/live/page.tsx`
- `app/athletes/page.tsx`

### Home and Assistant
- `features/home/pages/WelcomeExperience.tsx`
- `features/home/components/AiPrompt.tsx`
- `features/home/components/AssistantResponse.tsx`
- `features/home/components/QuickActions.tsx`
- `features/home/components/RecentActivity.tsx`
- `features/home/components/SchemaWizard.tsx`
- `features/home/assistant/AssistantEngine.ts`
- `features/home/assistant/intents.ts`

### Planner and Workspace
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

### Planner State and Hooks
- `features/planner/context/WorkspaceContext.tsx`
- `features/planner/context/PlannerContext.tsx`
- `features/planner/context/AssistantContext.tsx`
- `features/planner/hooks/useAssistant.ts`
- `features/planner/types/assistant.ts`

### Rules and Engines
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

### Static and Domain Data
- `features/planner/data/jumps.ts`
- `features/planner/data/spins.ts`
- `features/planner/data/sequences.ts`
- `features/planner/data/elements.ts`
- `data/choreo.ts`
- `data/elementRepository.ts`
- `data/jumps.ts`
- `data/spins.ts`
- `data/steps.ts`

## Future Milestones
### Near-Term
- Stabilize state management and remove reliance on global singleton context.
- Persist planner state in local storage or session storage.
- Wire `PlannerContext` and `AssistantContext` into the planner route.
- Add route exposure for dashboard modules or remove unused dashboard code.

### Mid-Term
- Complete the scoring model by implementing PCS and deductions.
- Improve validation rules with real discipline and program type support.
- Add route-level navigation for `video`, `live`, and `athletes` when those features are ready.
- Consolidate duplicated type definitions.
- Populate `docs/architecture.md` and `README.md`.

### Long-Term
- Build a backend service layer for persistence, authentication, and richer AI integration.
- Add tests for planner engines, context providers, and route flows.
- Expand AI assistant capabilities beyond keyword detection.
- Support full program saving, loading, and athlete management.

## Notes
- Avoid modifying application logic during documentation updates.
- Keep roadmap items tightly coupled to existing modules and current repo boundaries.
>>>>>>> 034504a (Sprint 1: Foundation and architecture)
