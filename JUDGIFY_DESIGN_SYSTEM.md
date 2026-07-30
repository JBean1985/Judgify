# JUDGIFY DESIGN SYSTEM

## 1. Vision

Judgify is a professional desktop application for Figure Skating judges, coaches, and technical specialists. It is designed as an operational workspace for high-focus decision-making, not as a marketing-style website.

Its interaction model should feel closer to:

- Visual Studio Code
- Figma
- DaVinci Resolve
- Adobe Lightroom

and not like a traditional page-scrolling web experience.

The product standard is clear: productivity is always more important than decoration. Every visual and interaction choice must prioritize speed, clarity, reliability, and low cognitive load.

---

## 2. Design Principles

### Information Density
Show the maximum useful information per screen without visual overload. Prioritize structured data, compact controls, and reduced whitespace where it does not improve comprehension.

### Consistency
The same action, status, and pattern must look and behave the same way across all modules.

### Predictability
Users should always know where information lives, what can be edited, and what happens next.

### Speed
Interfaces must optimize for rapid navigation, data entry, and review cycles.

### Minimal Scrolling
Avoid full-page scrolling. Keep main context fixed and use panel-level internal scrolling.

### Keyboard-Friendly
Critical workflows must be executable with keyboard shortcuts and predictable focus movement.

### Desktop-First
Primary experience is optimized for laptop and desktop operations, not mobile-first patterns.

### Panel-Based Interface
Use stable panels, split views, and inspectors instead of oversized cards and floating blocks.

### Internal Scrolling Only
Each content-heavy region scrolls independently within its panel.

### Persistent Workspace
Remember panel sizes, open tabs, filters, and current context between sessions where applicable.

---

## 3. Layout System

Judgify uses a fixed application shell:

- Fixed Header
- Fixed Sidebar
- Central Workspace
- Optional Right Utility Panel
- Bottom Information Bar

### Fixed Header
Global context and controls: module path, command/search, session state, sync status, user actions.

### Fixed Sidebar
Primary module navigation and quick switching. Supports collapsed icon mode and expanded labeled mode.

### Central Workspace
Main task area for each module. This is where core data entry, review, and decision workflows happen.

### Optional Right Utility Panel
Contextual tools such as AI assistant, inspector, validation details, notes, and alerts.

### Bottom Information Bar
Persistent lightweight status channel for autosave state, warnings, background tasks, and active shortcuts.

---

## 4. Panel Philosophy

Every module should be composed of panels, not oversized cards.

### Panel Headers
Compact and informative. Include title, key state, and local actions.

### Panel Content
Dense, structured content with clear hierarchy and low visual noise.

### Internal Scrolling
Long content must scroll inside panel boundaries.

### Empty States
Compact, instructional, and action-oriented. No oversized illustrations.

### Collapsible Panels
Secondary panels should be collapsible to maximize focus area.

### Resizable Panels
Primary split panels should be resizable and preserve user preferences.

---

## 5. Spacing System

Single spacing scale:

- 4
- 8
- 12
- 16
- 20
- 24
- 32

Usage guidance:

- 4: micro spacing between icon and label, dense inline controls
- 8: compact control groups and row internals
- 12: default panel content spacing in dense mode
- 16: standard panel padding and section separation
- 20: larger section transitions where grouping needs emphasis
- 24: major layout separations between workspace regions
- 32: rare macro spacing for top-level module composition

No arbitrary spacing values outside this scale unless justified by a component constraint.

---

## 6. Typography

### Application Title
High-level app identity and major workspace markers.

### Module Title
Primary context title for each module and sub-workspace.

### Panel Title
Compact panel headers for operational scanning.

### Section Title
Subgroup headings within panels.

### Body
Default reading and UI helper text.

### Dense Table
Smaller, highly readable text for table-heavy workflows.

### Numeric Scores
Tabular numeral styling and stronger emphasis for scoring accuracy.

Why this hierarchy:

- Supports fast visual parsing
- Maintains strong information structure
- Prioritizes numerical reliability for judging workflows

---

## 7. Color Philosophy

Use a neutral interface baseline. Accent colors are semantic, not decorative.

### Primary
Main interactive emphasis and selected state.

### Success
Valid states, completed operations, positive checks.

### Warning
Caution states requiring review.

### Danger
Errors, destructive actions, critical issues.

### Information
Informational notices and neutral highlights.

### Muted
Secondary text, passive metadata, low-priority labels.

### Surface
Panel and workspace background layers.

### Border
Structural boundaries between regions and controls.

Color must communicate meaning first, branding second.

---

## 8. Components

All screens should reuse a shared component language:

- Panel
- Toolbar
- Sidebar
- Table
- Inspector
- Status Badge
- Action Button
- Search
- Modal
- Split View
- Tabs
- Empty State
- Command Bar

Component usage rules:

- Prefer tables for dense operational data
- Prefer split panels for side-by-side decisions
- Use modals sparingly and only for focused tasks
- Keep toolbar actions scoped and explicit

---

## 9. Interaction Rules

### Hover
Subtle elevation or contrast shifts only. No distracting animation.

### Selection
Strong, unambiguous selected states in lists, rows, and tabs.

### Focus
Always-visible focus indicators for keyboard workflows.

### Keyboard Navigation
Predictable tab flow, arrow navigation in lists/tables, command shortcuts for frequent actions.

### Undo / Redo
Required in editing-heavy modules such as Planner and annotations.

### Autosave
Continuous autosave with visible status feedback.

### Confirmation Dialogs
Use for destructive actions, submissions, and irreversible transitions.

### Error Prevention
Inline validation, guardrails, and clear conflict warnings before commit.

### Loading
Use lightweight progress indicators with preserved layout structure.

### Skeletons
Use skeleton states for panel and table loading to reduce perceived latency.

---

## 10. Responsive Behaviour

Desktop-first targets:

- 1920x1080
- 1600x900
- 1366x768

Behavior:

- 1920x1080: full multi-panel mode (left, center, right)
- 1600x900: compact headers and tighter panel spacing
- 1366x768: collapse secondary panels by default, keep primary task panel dominant

Panel collapse strategy:

- Utility panel collapses first
- Sidebar collapses to icon rail second
- Non-critical secondary sections move into tabs/accordions

Core task context must remain visible at all target resolutions.

---

## 11. Accessibility

- Full keyboard support for core workflows
- High contrast for text, controls, and semantic states
- Persistent visible focus indicators
- Large enough click targets for operational reliability
- Logical tab order aligned with visual hierarchy

Accessibility is mandatory for all modules and states.

---

## 12. Performance Guidelines

- Virtualized lists and tables for large datasets
- Lazy loading for heavy panels and secondary content
- Memoization for expensive derived computations
- Avoid unnecessary renders through stable state boundaries

Performance is part of usability; interface speed is a product feature.

---

## 13. Future Modules

All current and future modules must follow this same design language:

- Dashboard
- Planner
- Video Analysis
- Live Judging
- Athletes
- Competitions
- AI Assistant
- Settings

No module may introduce a conflicting visual paradigm.

---

## 14. Design Rules

Developers must follow these rules:

- Never use oversized cards.
- Never create browser page scrolling.
- Prefer tables over cards for dense data.
- Prefer panels over floating boxes.
- Keep headers compact.
- Always maximize useful information.
- Always minimize clicks.
- Always reuse shared components.
- Keep interactions predictable across modules.
- Preserve keyboard and accessibility behavior in every feature.

---

## 15. Conclusion

This document is the authoritative UI/UX specification for Judgify. Every future UI implementation must follow this design system before code is written, reviewed, or shipped.