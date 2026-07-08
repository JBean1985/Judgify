<<<<<<< HEAD

=======
# Judgify Prompts

## Documentation Prompts
- "Review the current Judgify repository and document the routing, feature modules, and state architecture without modifying application code."
- "Generate a technical architecture summary for Judgify, including active routes, main folders, engines, and disconnected modules."
- "Create a safe roadmap for Judgify that prioritizes state stabilization and scoring completeness over new feature expansion."

## Development Prompts
- "Identify all unused or partially wired modules in Judgify and recommend which ones should be removed or integrated first."
- "Propose a safe refactor to replace the global `ContextEngine` with a React context-based state flow in Judgify."
- "List the existing scoring and validation rules implemented in Judgify and explain where they are defined."
- "Suggest the next three development milestones for Judgify based on the current repository state."

## Testing and Validation Prompts
- "Create a test plan for `features/planner/engine/TechnicalEngine.ts`, including edge cases for GOE and program totals."
- "Describe how to validate `features/planner/engine/ValidationEngine.ts` against defined category rules in `features/planner/rules/categories.ts`."

## AI Agent Guidance Prompts
- "When making Judgify documentation updates, do not modify `.ts`, `.tsx`, or `.css` files; only update documentation files."
- "Use existing repository modules and current app routes to make recommendations in Judgify."
- "Avoid inventing new business rules; only report rules that are already defined in code or data files."

## Safe Refactor Prompts
- "Refactor Judgify planner state management to persist workspace elements in local storage while preserving the existing UI behavior."
- "Integrate `features/planner/context/PlannerContext.tsx` into the planner route and remove redundant global schema state usage."
- "Refine Judgify scoring logic by implementing PCS and deductions in `TechnicalEngine` without changing current route structure."
>>>>>>> 034504a (Sprint 1: Foundation and architecture)
