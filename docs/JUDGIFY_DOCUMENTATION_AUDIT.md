# Judgify Documentation Audit

## 1. Executive Summary

This audit is needed because Judgify currently contains multiple documentation layers (root-level docs, docs/ product docs, rules packs, and agent instruction files) with overlap, unresolved merge conflicts, and mixed maturity.

The currently approved authoritative references are:
- docs/JUDGIFY_BLUEPRINT.md
- docs/JUDGIFY_DESIGN_SYSTEM.md
- docs/JUDGIFY_COMPONENT_LIBRARY.md

Main risks found during inspection:
- Duplication risk: official-looking root documents overlap with approved docs/ documents.
- Conflict risk: five root Markdown files contain unresolved Git conflict markers.
- Staleness risk: some architecture/roadmap path references no longer match current repository paths.
- Governance risk: many official-looking docs are untracked, so contributors and AI agents may rely on content not yet version-controlled.

Evidence highlights:
- Conflict markers found in: AI_CONTEXT.md, ARCHITECTURE.md, ROADMAP.md, RULES.md, PROMPTS.md.
- Empty docs found in docs/: ai.md, architecture.md, principles.md, roadmap.md.
- Markdown internal-link check: no broken Markdown links detected.
- Path-reference drift detected in plain/code references (not Markdown links), including outdated references to data/*.ts and features/planner/components/workspace/TechnicalSheet.tsx.

## 2. Official Documentation Set

Approved official references (as provided by product direction in this phase):
- docs/JUDGIFY_BLUEPRINT.md
- docs/JUDGIFY_DESIGN_SYSTEM.md
- docs/JUDGIFY_COMPONENT_LIBRARY.md

Responsibility of each approved document:
- docs/JUDGIFY_BLUEPRINT.md
  - Product functional architecture source of truth.
  - Defines product scope, module maturity, route model, user roles, and implementation roadmap framing.
- docs/JUDGIFY_DESIGN_SYSTEM.md
  - Visual and interaction foundation source of truth.
  - Defines principles, accessibility, layout behavior, token strategy, and design governance.
- docs/JUDGIFY_COMPONENT_LIBRARY.md
  - Reusable UI component catalog source of truth.
  - Defines component responsibilities, categories, maturity states, and canonical component boundaries.

Repository evidence does not currently prove any additional file as officially approved beyond this set.

## 3. Complete Documentation Inventory

Inspected scope: all repository Markdown files excluding node_modules (32 files).

| Path | Title | Purpose | Current relevance | Status | Overlaps with | Recommended action |
|---|---|---|---|---|---|---|
| AGENTS.md | This is NOT the Next.js you know | Agent instruction entry point for Next.js-specific constraints | Active contributor/agent guidance | Active supporting document | CLAUDE.md | Keep |
| AI_CONTEXT.md | Judgify — Contexto para IA / Judgify AI Context | AI context and development guidance | Contains useful context but unresolved merge | Conflicted | ARCHITECTURE.md, ROADMAP.md, docs/JUDGIFY_BLUEPRINT.md | Repair |
| ARCHITECTURE.md | Judgify Architecture | Technical architecture narrative at root | Useful but conflicted and partially stale | Conflicted | docs/architecture.md, docs/JUDGIFY_BLUEPRINT.md | Repair |
| CLAUDE.md | (no H1) | Pointer to AGENTS.md | Minimal redirect-only file | Legacy | AGENTS.md | Replace with redirect note |
| JUDGIFY_COMPONENT_LIBRARY.md | JUDGIFY COMPONENT LIBRARY | Root-level component catalog | Official-looking duplicate of approved docs version; contains potentially unique detail | Duplicate | docs/JUDGIFY_COMPONENT_LIBRARY.md | Review |
| JUDGIFY_DESIGN_SYSTEM.md | JUDGIFY DESIGN SYSTEM | Root-level design system | Official-looking duplicate of approved docs version; contains potentially unique detail | Duplicate | docs/JUDGIFY_DESIGN_SYSTEM.md | Review |
| JUDGIFY_OFFICIAL_RULE_SOURCES.md | JUDGIFY Official Rule Sources | Rule source governance and traceability policy | Highly relevant to domain integrity | Active supporting document | JUDGIFY_RULES_ROADMAP.md, docs/rules/world-skate/2026/* | Keep |
| JUDGIFY_RULES_ROADMAP.md | JUDGIFY Rules Roadmap | Rules implementation sequencing | Relevant domain planning document | Active supporting document | ROADMAP.md, RULES.md, docs/rules/world-skate/2026/* | Keep |
| JUDGIFY_UI_BLUEPRINT.md | JUDGIFY UI BLUEPRINT | UI workspace/wireframe blueprint | Relevant design-supporting artifact; not in approved official set | Active supporting document | docs/JUDGIFY_BLUEPRINT.md, docs/screens.md, docs/JUDGIFY_DESIGN_SYSTEM.md | Review |
| PROMPTS.md | Judgify Prompts | Prompt catalog for documentation/development/testing workflows | Useful but conflicted | Conflicted | AGENTS.md, AI_CONTEXT.md | Repair |
| README.md | (default Next.js readme content) | Repository entry point | Exists but currently boilerplate and not product-specific | Legacy | docs/JUDGIFY_BLUEPRINT.md, ROADMAP.md | Review |
| ROADMAP.md | Judgify Roadmap | Root roadmap and milestones | Contains content but conflicted and partly stale paths | Conflicted | docs/roadmap.md, docs/JUDGIFY_BLUEPRINT.md, JUDGIFY_RULES_ROADMAP.md | Repair |
| RULES.md | Judgify Business Rules | Root business rules summary | Contains content but conflicted | Conflicted | JUDGIFY_RULES_ROADMAP.md, docs/rules/world-skate/2026/* | Repair |
| docs/JUDGIFY_BLUEPRINT.md | Judgify Product Blueprint | Product architecture blueprint | Approved official source | Official | JUDGIFY_UI_BLUEPRINT.md, ROADMAP.md, ARCHITECTURE.md | Keep |
| docs/JUDGIFY_COMPONENT_LIBRARY.md | Executive Summary | Component catalog and governance | Approved official source | Official | JUDGIFY_COMPONENT_LIBRARY.md | Keep |
| docs/JUDGIFY_DESIGN_SYSTEM.md | Judgify Design System Foundation | Design system foundation | Approved official source | Official | JUDGIFY_DESIGN_SYSTEM.md, JUDGIFY_UI_BLUEPRINT.md | Keep |
| docs/ai.md | (empty) | Intended AI documentation placeholder | No current usable content | Empty | AI_CONTEXT.md, PROMPTS.md, AGENTS.md | Review |
| docs/architecture.md | (empty) | Intended technical architecture doc | Referenced by other files but empty | Empty | ARCHITECTURE.md, docs/JUDGIFY_BLUEPRINT.md | Replace with redirect note |
| docs/journey-athlete.md | User Journey - Atleta | Athlete journey narrative | Relevant supporting product context | Active supporting document | docs/users.md, docs/vision.md, docs/screens.md | Keep |
| docs/journey-coach.md | User Journey - Treinador | Coach journey narrative | Relevant supporting product context | Active supporting document | docs/users.md, docs/vision.md, docs/screens.md | Keep |
| docs/journey-family.md | User Journey - Familiar | Family journey narrative | Relevant supporting product context | Active supporting document | docs/users.md, docs/vision.md | Keep |
| docs/journey-judge.md | User Journey - Juiz | Judge journey narrative | Relevant supporting product context | Active supporting document | docs/users.md, docs/vision.md, docs/screens.md | Keep |
| docs/principles.md | (empty) | Intended principles document | No current usable content | Empty | docs/vision.md, docs/JUDGIFY_DESIGN_SYSTEM.md | Review |
| docs/roadmap.md | (empty) | Intended docs-level roadmap | No current usable content; overlaps root ROADMAP.md | Empty | ROADMAP.md, docs/JUDGIFY_BLUEPRINT.md | Replace with redirect note |
| docs/rules/world-skate/2026/FREE_2026_STRUCTURE.md | World Skate Free Skating Rules 2026 | Rule-pack structure extraction and traceability | High domain relevance | Active supporting document | JUDGIFY_OFFICIAL_RULE_SOURCES.md, RULES.md | Keep |
| docs/rules/world-skate/2026/ROLLART_2026_CODE_CATALOGUE.md | RollArt 2026 Official Code Catalogue | Code catalog extraction | High domain relevance | Active supporting document | ROLLART_2026_JUMP_VALUES.md, ROLLART_2026_SPIN_VALUES.md | Keep |
| docs/rules/world-skate/2026/ROLLART_2026_JUMP_VALUES.md | RollArt 2026 Jump Base Value Catalogue | Jump base values | High domain relevance | Active supporting document | ROLLART_2026_CODE_CATALOGUE.md | Keep |
| docs/rules/world-skate/2026/ROLLART_2026_SPIN_VALUES.md | RollArt 2026 Spin Base Value Catalogue | Spin base values | High domain relevance | Active supporting document | ROLLART_2026_CODE_CATALOGUE.md | Keep |
| docs/rules/world-skate/2026/ROLLART_2026_STRUCTURE.md | RollArt 2026 | RollArt structure and dependencies | High domain relevance | Active supporting document | FREE_2026_STRUCTURE.md, JUDGIFY_OFFICIAL_RULE_SOURCES.md | Keep |
| docs/screens.md | Screens - Judgify AI Platform | Screen intent narratives | Relevant product/design supporting doc | Active supporting document | docs/JUDGIFY_BLUEPRINT.md, JUDGIFY_UI_BLUEPRINT.md | Keep |
| docs/users.md | Utilizadores do Judgify | User-role capability definitions | Relevant product supporting doc | Active supporting document | docs/vision.md, docs/journey-*.md | Keep |
| docs/vision.md | Judgify Vision | Product mission/vision | Relevant product supporting doc | Active supporting document | docs/users.md, docs/journey-*.md | Keep |

## 4. Duplicate Documents

Evidence-based duplicates/overlaps with recommended authority and merge guidance:

1. Component library duplication
- Files: docs/JUDGIFY_COMPONENT_LIBRARY.md and JUDGIFY_COMPONENT_LIBRARY.md
- Authoritative file: docs/JUDGIFY_COMPONENT_LIBRARY.md (approved official set)
- Unique content in older/root file: yes, root file includes an alternative taxonomy and operational usage blocks not verbatim in docs/.
- Recommendation: merge any unique useful definitions into docs/JUDGIFY_COMPONENT_LIBRARY.md, then archive or remove root file after product-owner approval.

2. Design system duplication
- Files: docs/JUDGIFY_DESIGN_SYSTEM.md and JUDGIFY_DESIGN_SYSTEM.md
- Authoritative file: docs/JUDGIFY_DESIGN_SYSTEM.md (approved official set)
- Unique content in older/root file: yes, root file has explicit desktop-workspace interaction constraints and panel behavior phrasing not fully identical.
- Recommendation: merge unique constraints into docs/JUDGIFY_DESIGN_SYSTEM.md, then archive or remove root file after approval.

3. Architecture duplication/conflict
- Files: ARCHITECTURE.md and docs/architecture.md
- Authoritative candidate: ARCHITECTURE.md currently contains content; docs/architecture.md is empty.
- Unique useful content: yes, root file has architecture content but is conflicted and includes stale path references.
- Recommendation: repair root content, then publish a single official architecture location under docs/ (or redirect), after approval.

4. Roadmap duplication/conflict
- Files: ROADMAP.md and docs/roadmap.md
- Authoritative candidate: ROADMAP.md currently contains content; docs/roadmap.md is empty.
- Unique useful content: yes, root file includes milestone and module inventory details.
- Recommendation: consolidate into one roadmap source (prefer docs/ target with redirect from root), after approval.

5. UI/design overlap set
- Files: JUDGIFY_UI_BLUEPRINT.md, docs/JUDGIFY_BLUEPRINT.md, docs/screens.md, docs/JUDGIFY_DESIGN_SYSTEM.md
- Authoritative by responsibility:
  - Product behavior and module scope: docs/JUDGIFY_BLUEPRINT.md
  - Visual system and design constraints: docs/JUDGIFY_DESIGN_SYSTEM.md
  - Screen narratives: docs/screens.md (supporting)
- Unique useful content in JUDGIFY_UI_BLUEPRINT.md: yes, detailed ASCII wireframes and workspace-region mapping.
- Recommendation: keep as supporting or merge wireframe-specific insights into official docs before any archival decision.

6. Product vision and user-definition overlap
- Files: docs/vision.md, docs/users.md, docs/journey-*.md
- Authoritative split recommendation:
  - Vision: docs/vision.md
  - Role definitions: docs/users.md
  - Per-role task journeys: docs/journey-*.md
- Unique useful content: yes in each file; overlap is conceptual but not fully duplicative.
- Recommendation: keep all as a linked set, add index-level role for each.

## 5. Conflicted or Broken Documents

Evidence (inspection-based):

### A. Git conflict markers
Found unresolved conflict markers in:
- PROMPTS.md: lines 1, 3, 30
- AI_CONTEXT.md: lines 1, 32, 130
- ROADMAP.md: lines 1, 3, 119
- ARCHITECTURE.md: lines 1, 3, 129
- RULES.md: lines 1, 3, 122

### B. Empty or incomplete documents
- docs/ai.md: empty (0 lines)
- docs/architecture.md: empty (0 lines)
- docs/principles.md: empty (0 lines)
- docs/roadmap.md: empty (0 lines)

### C. Broken path references (non-link path mentions)
Note: Markdown link targets validated clean, but plain/code path references include stale paths.

1. Outdated TechnicalSheet path
- ARCHITECTURE.md line 67 references features/planner/components/workspace/TechnicalSheet.tsx
- ROADMAP.md line 53 references features/planner/components/workspace/TechnicalSheet.tsx
- Current repository path found: features/planner/components/workspace/technical-sheet/TechnicalSheet.tsx

2. Outdated root data paths
- ROADMAP.md lines 90-94 reference:
  - data/choreo.ts
  - data/elementRepository.ts
  - data/jumps.ts
  - data/spins.ts
  - data/steps.ts
- Current repository state: those files exist under core/data/, while top-level data/ is empty.

3. References to empty architecture document
- AI_CONTEXT.md line 83 references docs/architecture.md as empty.
- ARCHITECTURE.md line 117 references docs/architecture.md as empty.
- ROADMAP.md line 108 references populating docs/architecture.md.
- Result: architecture reference target exists but contains no usable content.

### D. Malformed Markdown
- No structural Markdown parse failures were detected in inspected files.
- However, unresolved conflict markers make five files operationally malformed for authoritative documentation use.

## 6. Documentation Hierarchy

Proposed official hierarchy and current coverage status:

### Product
- Blueprint: exists (docs/JUDGIFY_BLUEPRINT.md)
- Product roadmap: partial/conflicted (ROADMAP.md conflicted; docs/roadmap.md empty)
- User and role definitions: exists (docs/users.md, docs/vision.md, docs/journey-*.md)

### Design
- Design system: exists (docs/JUDGIFY_DESIGN_SYSTEM.md)
- Component library: exists (docs/JUDGIFY_COMPONENT_LIBRARY.md)
- Brand guidelines: partial (covered partially in docs/JUDGIFY_DESIGN_SYSTEM.md, no standalone brand guideline)

### Engineering
- Technical architecture: partial/conflicted (ARCHITECTURE.md conflicted; docs/architecture.md empty)
- Coding standards: partial (AGENTS.md + implicit project rules, no dedicated engineering standards doc)
- Contribution guidelines: missing
- Agent instructions: exists (AGENTS.md, CLAUDE.md, PROMPTS.md, AI_CONTEXT.md)

### Domain
- Skating rules: exists (docs/rules/world-skate/2026/*, RULES.md conflicted)
- Validation rules: partial (RULES.md conflicted; some in code and blueprint)
- Scoring references: exists (rules catalog/value documents)
- Federation rule packs: exists as documentation and code scaffolding references

### Operations
- Deployment: missing (README is boilerplate)
- Environment setup: partial (README boilerplate only)
- Release notes: missing

## 7. Source-of-Truth Rules

Recommended rules for consolidation governance:

1. One authoritative document per responsibility.
2. Official product/design/component source-of-truth documents live under docs/.
3. Root-level documents are limited to repository entry points and contributor instructions.
4. Legacy documents must include a clear, visible status notice and canonical replacement link.
5. Runtime behavior is verified against repository code.
6. Product decisions are verified against docs/JUDGIFY_BLUEPRINT.md.
7. Visual decisions are verified against docs/JUDGIFY_DESIGN_SYSTEM.md.
8. Component decisions are verified against docs/JUDGIFY_COMPONENT_LIBRARY.md.
9. Conflicted files are not considered authoritative until repaired.
10. Empty placeholder docs cannot be referenced as authoritative.

## 8. Recommended Consolidation Plan

Stage 1. Approve audit
- Files affected: docs/JUDGIFY_DOCUMENTATION_AUDIT.md
- Proposed action: Product-owner approval of findings and target authority map.
- Risk: low.
- Product-owner approval required: yes.

Stage 2. Protect official documents
- Files affected: docs/JUDGIFY_BLUEPRINT.md, docs/JUDGIFY_DESIGN_SYSTEM.md, docs/JUDGIFY_COMPONENT_LIBRARY.md
- Proposed action: Freeze as official baselines for future consolidation edits.
- Risk: low.
- Product-owner approval required: yes.

Stage 3. Resolve architecture documentation
- Files affected: ARCHITECTURE.md, docs/architecture.md, references in AI_CONTEXT.md and ROADMAP.md
- Proposed action: Repair conflicts, reconcile stale paths, decide single architecture source in docs/.
- Risk: medium (incorrect consolidation can lose context).
- Product-owner approval required: yes.

Stage 4. Resolve component-library duplication
- Files affected: JUDGIFY_COMPONENT_LIBRARY.md, docs/JUDGIFY_COMPONENT_LIBRARY.md
- Proposed action: Merge unique root content into official docs file, then archive/remove root duplicate.
- Risk: medium.
- Product-owner approval required: yes.

Stage 5. Consolidate roadmap documents
- Files affected: ROADMAP.md, docs/roadmap.md, JUDGIFY_RULES_ROADMAP.md
- Proposed action: define one product roadmap source and one rules roadmap source; add redirects for superseded files.
- Risk: medium.
- Product-owner approval required: yes.

Stage 6. Repair or archive conflicted files
- Files affected: AI_CONTEXT.md, ARCHITECTURE.md, ROADMAP.md, RULES.md, PROMPTS.md
- Proposed action: remove conflict markers; resolve branch divergence; archive obsolete variants if needed.
- Risk: high (loss of unique historical content if resolved incorrectly).
- Product-owner approval required: yes.

Stage 7. Add documentation index
- Files affected: docs/README.md (new), potential update references in root README.md
- Proposed action: create documentation index with canonical links and category ownership.
- Risk: low.
- Product-owner approval required: yes.

Stage 8. Add legacy notices or redirects
- Files affected: root duplicate/legacy docs selected for deprecation
- Proposed action: keep short status banner and canonical pointer until removal decision.
- Risk: low.
- Product-owner approval required: yes.

Stage 9. Validate links and paths
- Files affected: all docs/*.md and root documentation files
- Proposed action: automated markdown-link/path validation in CI and pre-merge checks.
- Risk: low.
- Product-owner approval required: no (engineering process approval may still be needed).

## 9. Proposed Documentation Index

Proposed future structure for docs/README.md (do not create yet in this phase):

- Title: Judgify Documentation Index
- Sections and links:
  - Product
    - Product Blueprint -> docs/JUDGIFY_BLUEPRINT.md
    - Product Roadmap -> (authoritative roadmap file to be approved)
    - Users and Roles -> docs/users.md
    - User Journeys -> docs/journey-athlete.md, docs/journey-coach.md, docs/journey-judge.md, docs/journey-family.md
  - Design
    - Design System -> docs/JUDGIFY_DESIGN_SYSTEM.md
    - Component Library -> docs/JUDGIFY_COMPONENT_LIBRARY.md
    - UI Screen Narratives -> docs/screens.md
    - UI Blueprint (if retained) -> JUDGIFY_UI_BLUEPRINT.md
  - Engineering
    - Technical Architecture -> (authoritative architecture file to be approved)
    - Development/Agent Guidelines -> AGENTS.md, PROMPTS.md, AI_CONTEXT.md
  - Domain Rules
    - Official Rule Sources -> JUDGIFY_OFFICIAL_RULE_SOURCES.md
    - Rules Roadmap -> JUDGIFY_RULES_ROADMAP.md
    - World Skate 2026 Docs -> docs/rules/world-skate/2026/*
  - Operations
    - Environment Setup -> README.md (until replaced)
    - Release Notes -> (missing; to be defined)

## 10. Risks

Key risks if consolidation is not completed:

- Copilot/agents may read outdated or conflicted instruction files and generate incorrect changes.
- Developers may follow contradictory architecture descriptions.
- Product decisions may diverge between root-level and docs/ official-looking files.
- Stale route/path references may mislead implementation and testing.
- Unique historical content may be accidentally deleted during conflict cleanup.
- Conflict markers can leak into future work and automated tooling outputs.
- Untracked official-looking documents may not be reviewed/versioned consistently.

## 11. Product-Owner Decisions Required

Explicit decisions required before consolidation execution:

1. Confirm that docs/JUDGIFY_BLUEPRINT.md, docs/JUDGIFY_DESIGN_SYSTEM.md, and docs/JUDGIFY_COMPONENT_LIBRARY.md remain the only approved official set.
2. Decide whether root JUDGIFY_COMPONENT_LIBRARY.md should be archived or removed after merging unique content.
3. Decide whether root JUDGIFY_DESIGN_SYSTEM.md should be archived or removed after merging unique content.
4. Decide long-term status of JUDGIFY_UI_BLUEPRINT.md (supporting permanent artifact vs merge and archive).
5. Decide authoritative architecture location (repaired ARCHITECTURE.md vs docs/architecture.md after population).
6. Decide authoritative roadmap location (repaired ROADMAP.md vs docs/roadmap.md after population).
7. Approve how to resolve the two-language split in AI_CONTEXT.md during conflict repair.
8. Decide whether legacy historical docs remain in-repo with notices or are removed after approval.
9. Decide whether root README.md stays boilerplate temporarily or is replaced with Judgify-specific contributor entrypoint.

## 12. Definition of Documentation Consolidation Complete

Consolidation is complete when all criteria below are true:

1. One authoritative source exists for every major documentation responsibility.
2. No Markdown file contains unresolved conflict markers.
3. No official document is empty.
4. No duplicate official component or architecture references remain unresolved.
5. A docs/README.md index exists and points to canonical documents.
6. Internal Markdown links and referenced repository paths resolve correctly.
7. Legacy documents are clearly marked with status and canonical replacement.
8. Runtime code remains unchanged throughout documentation consolidation.

---

Audit notes:
- Evidence in this report is based on direct repository inspection in this phase.
- Recommendations are intentionally separated from evidence and require product-owner approval before execution.
