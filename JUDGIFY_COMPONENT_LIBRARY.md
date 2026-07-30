# JUDGIFY COMPONENT LIBRARY

## Introduction

This document is the official catalogue of reusable UI components for Judgify.

Its objective is to enforce:

- consistency
- reusability
- maintainability
- desktop productivity

Developers must always reuse existing components before creating new ones.

This library follows the architectural principles defined in [JUDGIFY_DESIGN_SYSTEM.md](JUDGIFY_DESIGN_SYSTEM.md) and [JUDGIFY_UI_BLUEPRINT.md](JUDGIFY_UI_BLUEPRINT.md).

---

# Component Classification

Components are organized into the following categories:

- Workspace
- Navigation
- Panels
- Tables
- Forms
- Feedback
- Dialogs
- Status
- Layout
- Utilities

Each component must be discoverable under one primary category and optionally cross-referenced in another.

---

# Workspace Components

## WorkspaceShell

Purpose:

- Root desktop frame for each module.

Responsibilities:

- Establishes fixed regions (header, sidebar, workspace, optional right panel, bottom bar).
- Prevents browser-level scrolling.

Where it is used:

- All module root screens.

Where it must NOT be used:

- Inside nested content panels or dialogs.

## WorkspaceHeader

Purpose:

- Global operational context and high-frequency controls.

Responsibilities:

- Shows module path, command entry, session indicators, global actions.

Where it is used:

- Top fixed region of WorkspaceShell.

Where it must NOT be used:

- As a local panel header.

## WorkspaceToolbar

Purpose:

- Module-scoped command strip.

Responsibilities:

- Hosts actions, filters, view toggles, and quick commands.

Where it is used:

- Top of module-specific workspace areas.

Where it must NOT be used:

- As global navigation.

## WorkspaceFooter

Purpose:

- Optional module footer for low-frequency controls.

Responsibilities:

- Houses secondary actions and contextual metadata.

Where it is used:

- Bottom of module content where persistent summary actions are needed.

Where it must NOT be used:

- In place of Bottom Information Bar.

## WorkspaceStatusBar

Purpose:

- Persistent status communication layer.

Responsibilities:

- Displays autosave state, connection status, background tasks, and warnings.

Where it is used:

- Bottom fixed bar in shell.

Where it must NOT be used:

- As inline panel feedback.

## WorkspaceContextBar

Purpose:

- Persistent top context specific to the active workflow.

Responsibilities:

- Displays identity and state (athlete, category, discipline, competition, validation).

Where it is used:

- Planner and other context-heavy workspaces.

Where it must NOT be used:

- Generic dashboard sections.

---

# Navigation Components

## Sidebar

Primary module navigation container.

## SidebarGroup

Logical grouping of sidebar items.

## SidebarItem

Single navigation target with optional badge state.

## Breadcrumb

Module/subview path and location context.

## Tabs

Switches between sibling views within the same context.

## Toolbar

Inline actionable command strip for local panel or workspace actions.

## CommandBar

Global command execution surface for fast keyboard workflows.

## SearchBar

Global or local searchable entry component.

## FilterBar

Compact filter controls for dense datasets.

Navigation behavior:

- Must be keyboard navigable.
- Must preserve selected state visibility.
- Must support predictable focus order.

---

# Layout Components

## SplitView

Two or more adjacent panels in one workspace region.

## ResizablePanel

Panel that supports user-driven width/height adjustment.

## CollapsiblePanel

Panel that can collapse/expand while preserving state.

## PanelGroup

Manages related panels and split boundaries.

## BottomPanel

Lower workspace panel for tabular summaries and timelines.

## InspectorPanel

Right-side contextual inspector for detail, validation, and AI output.

## LeftPanel

Input/navigation-heavy region (libraries, queues, filters).

## CenterPanel

Primary working canvas (editing, playback, scoring).

## RightPanel

Context, diagnostics, and assistant guidance.

### Resizing behaviour

- Resizing must be smooth and continuous.
- Minimum panel sizes must protect usability.
- Panel sizes must persist per module and per user session.
- Collapse order should prioritize preserving center panel usability.

---

# Data Components

## DataTable

Default component for dense row/column operational data.

## TechnicalSheet

Spreadsheet-like scoring and technical data table.

## ScoreTable

Compact scoring matrix for judging and review workflows.

## Timeline

Time-sequenced event visualization for video/live modules.

## PropertyGrid

Two-column key-value inspector for metadata and details.

## StatisticsPanel

Compact metrics panel with summary indicators.

## RecentItems

List/table of recent projects, competitions, or sessions.

## EmptyState

Compact instruction-oriented fallback when no data exists.

## LoadingState

Interim content state for async operations.

## Skeleton

Structural placeholder preserving layout during load.

### When table layouts are preferred over cards

Use tables whenever users need to:

- compare many records quickly
- sort/filter on multiple fields
- perform repetitive scanning
- execute batch actions

Cards may only be used for low-density launch/navigation contexts, never as the default for operational datasets.

---

# Form Components

## TextField

Single-line textual input.

## NumberField

Numeric input with validation and optional step controls.

## SearchField

TextField optimized for query and filtering.

## Select

Controlled fixed-option dropdown.

## Combobox

Searchable select for larger option sets.

## Checkbox

Binary or multi-selection toggles within lists.

## Radio

Exclusive selection among limited options.

## Toggle

On/off setting state.

## DatePicker

Date selection field.

## TimePicker

Time selection field.

## Button

Primary action trigger.

## IconButton

Compact action icon with accessible label.

## ButtonGroup

Related actions grouped with hierarchy.

### Dense desktop forms

- Prefer compact field heights and spacing.
- Keep labels concise and always visible.
- Place validation inline and near source fields.
- Optimize for keyboard entry and rapid tab flow.

---

# Status Components

## StatusBadge

General state marker for neutral or semantic status.

## ValidationBadge

Validation-specific state indicator (valid, warning, error).

## ProgressIndicator

Progress state for long-running operations.

## ConnectionIndicator

Online/offline/sync health state.

## CompetitionStatus

Competition lifecycle marker (upcoming, in progress, finished).

## SyncStatus

Data synchronization state.

### Semantic colour usage

- Primary: selected or main action emphasis
- Success: valid/completed
- Warning: caution/review required
- Danger: error/destructive
- Information: neutral updates
- Muted: secondary metadata

Colors must convey meaning, never decoration-only styling.

---

# Dialog Components

## Modal

Focused blocking task container.

## ConfirmationDialog

Explicit acknowledgment for critical decisions.

## AlertDialog

High-severity warning requiring immediate user awareness.

## Toast

Non-blocking transient feedback.

## ContextMenu

Right-click/keyboard context action list.

## DropdownMenu

Anchored action/options list.

## Tooltip

Short explanatory hover/focus hint.

## Popover

Anchored rich contextual surface.

Dialog rules:

- Use sparingly.
- Prefer non-blocking inline patterns when possible.
- Preserve keyboard accessibility and focus return.

---

# AI Components

## AIInspector

Context-aware right-panel AI analysis and guidance.

## AIValidationPanel

Validation findings generated or summarized by AI.

## AISuggestions

Prioritized improvement suggestions linked to current context.

## AIWarnings

Risk and inconsistency warnings.

## AIStatistics

Compact AI-derived statistics and confidence summaries.

AI principle:

- AI is an inspector panel, never a chat interface.
- AI outputs must be contextual, actionable, and tied to workspace state.

---

# Interaction Rules

Every component must define and support:

- Keyboard behaviour
- Focus behaviour
- Hover behaviour
- Selection state
- Disabled state
- Loading state
- Error state
- Empty state

Interaction standards:

- Keyboard interactions must be first-class.
- Focus indicators must remain visible.
- Hover effects must be subtle and non-distracting.
- Disabled states must be visually clear and semantically accurate.
- Errors must be local, explicit, and recoverable.

---

# Naming Rules

Use predictable, domain-oriented naming conventions:

- Workspace*
- Panel*
- Table*
- Status*
- Dialog*
- Toolbar*
- Badge*

Naming requirements:

- Avoid duplicate or near-duplicate names.
- Prefer functional names over decorative names.
- Keep names consistent with behavior and placement.
- Use singular names for single instances and plural for grouped collections where appropriate.

---

# Component Lifecycle

New reusable components must follow this process:

1. Need identified
2. Review existing library
3. Reuse if possible
4. Create only if necessary
5. Document
6. Implement

Definition of done for a new component:

- Classified in this document
- Naming validated
- Interaction states defined
- Accessibility expectations defined
- Usage boundaries documented

---

# Component Rules

Mandatory rules:

- Never duplicate components.
- Never create visual variants without documentation.
- Prefer composition over inheritance.
- Keep components small and focused.
- Separate behaviour from presentation.
- Use consistent naming.
- Reuse existing spacing scale.
- Reuse existing typography hierarchy.
- Reuse existing colour tokens.

Additional rules:

- Never introduce browser-page scrolling to solve local overflow.
- Prefer panel and table composition over ad hoc card layouts.
- Validate keyboard and focus behavior for every shared component.

---

# Future

Every new module must reuse this component library.

The long-term objective is for the entire application to feel like one professional desktop product with a single coherent interaction language.
