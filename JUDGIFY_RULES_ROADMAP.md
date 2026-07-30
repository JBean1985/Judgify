# JUDGIFY Rules Roadmap

## 1. Purpose
This document defines a safe roadmap for implementing official FPP / World Skate technical and judging rules in Judgify.

The objective is to:
- keep current planner behavior stable,
- avoid introducing unofficial assumptions,
- progressively activate validated rule logic,
- ensure every implemented rule is traceable to an official source.

## 2. Rule Sources Needed
Required authoritative sources before implementing each rule:
- FPP official regulations (latest applicable season/version).
- World Skate official regulations (latest applicable season/version).
- Official communications, circulars, clarifications, and amendments.
- Category and discipline appendices with technical requirements.
- Official score sheet examples or technical panel guidance, where available.

For each implemented rule, record:
- source organization,
- document title,
- version/date,
- article/section reference,
- direct interpretation note used in code.

## 3. Categories
Roadmap tasks:
- Confirm official category matrix used by product scope.
- Map each category name to a stable internal id.
- Validate category-specific constraints (element counts, repetitions, duration, required content).
- Add seasonal versioning strategy if categories change over time.

## 4. Disciplines
Roadmap tasks:
- Confirm supported disciplines in scope:
  - free,
  - solo-dance,
  - pairs,
  - precision.
- Document discipline-specific constraints and scoring differences.
- Ensure validation engine can select rule profile by discipline.

## 5. Program Types
Roadmap tasks:
- Confirm program type taxonomy per discipline/category:
  - short,
  - long.
- Define where short/long differences exist (limits, required elements, deductions, structure).
- Keep fallback behavior explicit for unknown or missing program type.

## 6. Element Limits
Roadmap tasks:
- Define official max limits per category + discipline + program type:
  - maxElements,
  - maxJumps,
  - maxSpins,
  - maxSequences,
  - other element-family caps if applicable.
- Identify whether limits are hard errors or warnings.

## 7. Required Elements
Roadmap tasks:
- Define required element groups for each rule profile.
- Define minimum and exact requirements (for example, required counts/types).
- Add validation messages for missing required elements.
- Distinguish between required content and optional bonus content.

## 8. Repetition Rules
Roadmap tasks:
- Define repetition allowances for jumps and non-jumps.
- Specify repetition constraints by category/discipline/program type.
- Clarify edge cases (same code with modifiers, combinations, sequence variants).
- Keep severity mapping explicit (warning vs error).

## 9. GOE Rules
Roadmap tasks:
- Validate GOE tables by element code and season.
- Define behavior when a code has no table entry.
- Support discipline/program-type-specific GOE rules where applicable.
- Add source traceability for each GOE table row.

## 10. PCS Rules
Roadmap tasks:
- Define PCS components used by discipline/program type.
- Define factor/multiplier logic and rounding rules.
- Define minimum/maximum component rules if applicable.
- Clarify where PCS is calculated vs entered externally.

## 11. Deductions
Roadmap tasks:
- Enumerate deduction catalog by discipline/program type.
- Define triggers, units, and caps.
- Define stacking behavior for multiple deductions.
- Ensure deduction explanations are user-visible and traceable.

## 12. Validation Roadmap
Suggested implementation waves:
1. Structural scaffolding (types, resolvers, fallback-safe architecture).
2. Category and repetition rules (already partly present).
3. Program-type-specific element limits.
4. Required elements validation.
5. Discipline-specific constraints.
6. GOE completeness and source traceability.
7. PCS and deductions integration.
8. Seasonal versioning and migration.

## 13. Implementation Order
Recommended safe order in codebase:
1. Rules data contracts and resolvers.
2. Validation engine consumption with backward-compatible fallbacks.
3. UI surfaces for messages and diagnostics.
4. Test fixtures per profile.
5. Activation flags for progressive rollout.
6. Documentation updates and release notes.

## 14. Testing Strategy
Testing layers:
- Unit tests:
  - rule resolver behavior,
  - per-rule validation functions,
  - fallback behavior when data is missing.
- Integration tests:
  - end-to-end planner validation flow,
  - context-driven category/discipline/program-type routing.
- Regression tests:
  - existing valid schemas remain valid,
  - existing invalid schemas remain invalid with stable messaging intent.
- Snapshot/golden tests:
  - known official examples mapped to expected validation outcomes.
- Manual QA checklist:
  - short vs long differences,
  - category differences,
  - repeated element edge cases,
  - UI message clarity.

## 15. Source Confirmation Warning
No official rule should be implemented, changed, or enforced in production without explicit source confirmation.

Mandatory policy:
- If source is missing, ambiguous, outdated, or conflicting, do not implement the rule as official.
- Mark unresolved rules as TODO with source-needed status.
- Require reviewer signoff with source reference before merge.
