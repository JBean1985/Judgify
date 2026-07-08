<<<<<<< HEAD
# Judgify — Contexto para IA

Judgify é uma aplicação web em Next.js/React para criação e pontuação de esquemas de patinagem artística.

## Objetivo
A aplicação deve ajudar treinadores, atletas e juízes a analisar esquemas, calcular dificuldade técnica e organizar elementos de patinagem artística.

## Estado atual
- Projeto em Next.js/React.
- Interface já criada parcialmente.
- Existe um motor de dificuldade: `DifficultyEngine.ts`.
- A app deve ser simples, rápida e intuitiva.
- O utilizador trabalha diretamente pelo GitHub/Codespaces, sem instalação local.

## Regras importantes
- Não partir funcionalidades que já funcionam.
- Manter o design atual.
- Sempre que alterar código, explicar que ficheiros foram alterados.
- Preferir alterações completas e prontas a copiar/colar.
- Código em TypeScript sempre que possível.
- Interface em português de Portugal.

## Próximos módulos
- Motor de dificuldade.
- Sistema GOE.
- Pontuação técnica.
- Pontuação artística/componentes.
- Organização de atletas, categorias e disciplinas.
- Análise de esquema.
- Exportação ou resumo final.
=======
# Judgify AI Context

## Project Purpose
Judgify is a Next.js application designed to support figure skating program planning, scoring guidance, and future AI-assisted analysis. It combines a home assistant-style entry point with a planner workspace for building and validating skating programs.

## Current Routes
- `/` — Home landing page and assistant entry experience.
- `/planner` — Planner workspace for building a technical program.
- `/video` — Video analysis placeholder page.
- `/live` — Live analysis placeholder page.
- `/athletes` — Athletes management placeholder page.

## Folder Structure
- `app/`
  - Next.js route entries and application layout.
  - Contains global CSS and page-level route components.
- `features/home/`
  - Home experience, assistant prompt, quick actions, and welcome screen.
- `features/planner/`
  - Core planner workspace, program editing UI, rules, engines, and planner-specific state.
- `features/core/`
  - Shared global context engine used across home and planner flows.
- `shared/components/`
  - Reusable UI primitives such as buttons, cards, and page headers.
- `data/`
  - Static domain data for elements, choreography, and scoring repositories.
- `types/`
  - Shared TypeScript domain models for program elements, programs, and scoring.
- `docs/`
  - Product and architecture documentation; currently largely placeholders.
- `core/`
  - Present but not used in the current app logic.
- `services/`
  - Empty placeholder for future service or API logic.

## Active Features
- Home welcome experience with AI-style prompt and assistant response UI.
- Planner workspace with library, technical sheet, and editable program elements.
- Element selection across jumps, spins, and sequences.
- Program validation and scoring support in the planner.
- Category and discipline rule definitions for program limits.
- Simple assistant intent recognition via keyword matching.

## Known Disconnected or Incomplete Features
- `features/dashboard/` exists but is not wired into app routes.
- `core/index.ts` is empty and the `core/` folder appears unused.
- `features/planner/index.ts` and `features/planner/plannerData.ts` are empty.
- `features/planner/context/PlannerContext.tsx` and `AssistantContext.tsx` are implemented but not fully integrated.
- `services/` folder is empty and not used.
- Placeholder route pages: `/video`, `/live`, `/athletes`.
- `docs/architecture.md` is empty and does not describe system architecture.
- Duplicate or overlapping type definitions exist between top-level `types/` and `features/planner/types/`.

## Scoring Engines
- `features/planner/engine/TechnicalEngine.ts`
  - Computes base value, GOE value, PCS, deductions, and total score.
  - Current implementation returns `pcs = 0` and `deductions = 0` as stubs.
- `features/planner/engine/DifficultyEngine.ts`
  - Calculates difficulty index and level based on element count, base value, GOE, and category counts.
- `features/planner/engine/ValidationEngine.ts`
  - Validates program composition against category-based maximums and repeated elements.
  - Uses `ProgramRules.getRules()` and category definitions from `features/planner/rules/`.

## State Management Risks
- The app uses `ContextEngine` as a global mutable singleton for schema context.
  - Risk: stale, inconsistent, or lost state across refreshes and multiple tabs.
  - Risk: poor server-side and hydration behavior in Next.js.
- Planner state is held only in memory via React `useState`.
  - Risk: work is lost on page reload or app restart.
- The planner assistant and context providers are not fully aligned with the route flow.
  - Risk: partially wired state can lead to confusing user journeys and broken assumptions.
- There is no persistence layer or backend service for planner programs.

## Development Rules for AI Agents
- Do not modify application logic or components when updating documentation.
- Keep AI recommendations aligned with the existing route structure and active modules.
- Avoid introducing new runtime behavior unless the current architecture is explicitly extended.
- Prefer safe improvements: documentation, refactor plans, and integration fixes over feature rewrites.
- Use the planner context providers instead of the global `ContextEngine` for new state flows.
- Treat placeholder pages as future work, not current functionality.

## Safe Next Development Roadmap
1. Stabilize state management:
   - Remove reliance on `ContextEngine` for app flow and replace it with React-serializable context or route state.
   - Consolidate planner state in `features/planner/context/WorkspaceContext.tsx` and/or `PlannerContext.tsx`.
2. Persist planner data locally:
   - Add local storage or session persistence so users do not lose program state on refresh.
3. Complete scoring logic:
   - Implement PCS and deduction calculations in `TechnicalEngine`.
   - Ensure validation uses real discipline and program type values instead of hardcoded defaults.
4. Clean up unused modules:
   - Remove empty feature entry files or wire them properly.
   - Consolidate duplicate type definitions.
5. Expose dashboard or remove unused dashboard feature from the current route surface.
6. Add documentation and tests:
   - Populate `docs/architecture.md` and `README.md`.
   - Add unit tests for the planner engines and key context providers.
>>>>>>> 034504a (Sprint 1: Foundation and architecture)
