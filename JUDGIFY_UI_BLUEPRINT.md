# JUDGIFY UI BLUEPRINT

## Introduction

This document defines the visual architecture of Judgify.

It is the structural blueprint for organizing every current and future module screen in a consistent, desktop-first workspace.

Every new screen must follow this blueprint.

---

# Global Workspace

Judgify uses a unified desktop workspace shared by all modules.

Structure:

- Header (fixed)
- Sidebar (fixed)
- Main Workspace
- Optional Right Panel
- Bottom Information Bar

## Region purpose

### Header (fixed)

Global control layer for:

- Active module and sub-context
- Command bar and global search
- Session indicators (sync, active competition, lock state)
- User actions (notifications, settings, profile)

### Sidebar (fixed)

Primary module navigation and workspace switching:

- Dashboard
- Planner
- Video Analysis
- Live Judging
- Athletes
- Competitions
- AI Assistant
- Settings

Can be expanded (labels) or collapsed (icon rail).

### Main Workspace

The core task region where module-specific work happens.

No browser-page scrolling is allowed. Content-heavy areas scroll internally in panels.

### Optional Right Panel

Contextual utility area for:

- Inspector-style AI guidance
- Validation details
- Notes
- Alerts
- Event metadata

Collapsible and resizable.

### Bottom Information Bar

Persistent compact status strip for:

- Autosave state
- Background processing
- Warnings
- Shortcut hints

## ASCII wireframe

```text
+-----------------------------------------------------------------------------------+
| HEADER: Module Path | Command Bar | Session State | User                          |
+--------------------+------------------------------------------------+-------------+
| SIDEBAR            | MAIN WORKSPACE                                 | RIGHT PANEL |
| Dashboard          |                                                | (optional)  |
| Planner            | Module-specific panels and tools               | Inspector / |
| Video              |                                                | AI / Notes  |
| Live               |                                                | Alerts      |
| Athletes           |                                                |             |
| Competitions       |                                                |             |
| Settings           |                                                |             |
+--------------------+------------------------------------------------+-------------+
| BOTTOM INFORMATION BAR: autosave | warnings | tasks | hints                      |
+-----------------------------------------------------------------------------------+
```

---

# Dashboard

Dashboard is a launcher workspace, not a business analytics dashboard.

Dashboard contains:

- Welcome section
- Main actions:
  - Planner
  - Video Analysis
  - Live Judging
  - Athletes
  - Competitions
- Recent Projects
- Recent Competitions

Constraints:

- No charts
- No analytics
- No KPIs

Purpose:

- Fast module entry
- Resume recent work
- Provide immediate orientation at app start

## ASCII wireframe

```text
+-----------------------------------------------------------------------------------+
| HEADER                                                                            |
+--------------------+------------------------------------------------+-------------+
| SIDEBAR            | DASHBOARD                                      | RIGHT PANEL |
|                    | +--------------------------------------------+ | (optional)  |
|                    | | Welcome + Quick command links              | |             |
|                    | +--------------------------------------------+ |             |
|                    | +------------------+ +----------------------+ |             |
|                    | | Main Actions     | | Recent Projects      | |             |
|                    | | Planner          | | Project A            | |             |
|                    | | Video Analysis   | | Project B            | |             |
|                    | | Live Judging     | | Project C            | |             |
|                    | | Athletes         | +----------------------+ |             |
|                    | | Competitions     | +----------------------+ |             |
|                    | +------------------+ | Recent Competitions  | |             |
|                    |                      | Competition X         | |             |
|                    |                      | Competition Y         | |             |
|                    |                      +----------------------+ |             |
+--------------------+------------------------------------------------+-------------+
| BOTTOM BAR                                                                         |
+-----------------------------------------------------------------------------------+
```

---

# Planner

Planner is the most important module and follows a dense, professional multi-panel workspace.

## Panel map

### Top Context Bar

Always visible context:

- Athlete
- Category
- Discipline
- Competition
- Validation status

### Left Panel

- Element Library
- Filters
- Search

Note: library should evolve into a compact table for faster scanning and selection.

### Center Panel

- Program editor
- Ordered elements
- Inline editing

### Right Panel

- AI Assistant (inspector behavior, not chat feed)
- Validation
- Suggestions
- Warnings

### Bottom Panel

- Technical Sheet
- Base Value
- GOE
- Total
- Statistics

Technical sheet should behave like a spreadsheet (row/column mental model, fast editing, dense numeric visibility).

## Behavior rules

- Panels must be resizable
- Panels must be collapsible
- Internal scrolling only
- Workspace state persists across sessions

## Detailed ASCII wireframe

```text
+------------------------------------------------------------------------------------------------------+
| HEADER                                                                                               |
+--------------------+----------------------------------------------------------------+----------------+
| SIDEBAR            | PLANNER TOP CONTEXT BAR                                         | RIGHT PANEL    |
|                    | Athlete | Category | Discipline | Competition | Validation      | AI Inspector   |
|                    +-------------------------------+--------------------------------+ Validation     |
|                    | LEFT PANEL                    | CENTER PANEL                   | Suggestions    |
|                    | Library (table-ready)         | Program / Ordered Elements     | Warnings       |
|                    | Filters                       | Element editing                 |                |
|                    | Search                        |                                |                |
|                    +-------------------------------+--------------------------------+----------------+
|                    | BOTTOM PANEL: TECHNICAL SHEET (spreadsheet-like)                                 |
|                    | Rows: element | base value | goe | total | notes                                   |
|                    | Summary: base value | goe | total | statistics                                     |
+--------------------+----------------------------------------------------------------+----------------+
| BOTTOM INFORMATION BAR                                                                                |
+------------------------------------------------------------------------------------------------------+
```

---

# Video Analysis

Video Analysis is a review workspace optimized for temporal evaluation.

Layout:

- Left:
  - Markers
  - Library
- Center:
  - Video Player
- Bottom:
  - Timeline
- Right:
  - AI
  - Notes
  - Event Details

Behavior:

- Timeline and markers remain synchronized
- Right panel acts as contextual inspector for selected time/event

## ASCII wireframe

```text
+-----------------------------------------------------------------------------------+
| HEADER                                                                            |
+--------------------+----------------------------------------------+---------------+
| SIDEBAR            | LEFT: Markers + Library                      | RIGHT PANEL   |
|                    +----------------------------------------------+ AI / Notes /  |
|                    | CENTER: VIDEO PLAYER                         | Event details |
|                    |                                              |               |
|                    +----------------------------------------------+---------------+
|                    | BOTTOM: TIMELINE (scrub, segments, events)                  |
+--------------------+--------------------------------------------------------------+
| BOTTOM BAR                                                                         |
+-----------------------------------------------------------------------------------+
```

---

# Live Judging

Live Judging is an operational cockpit for real-time scoring.

Layout:

- Left:
  - Athlete Queue
- Center:
  - Scoring Workspace
- Right:
  - AI
  - Alerts
- Bottom:
  - Ranking

Behavior:

- Queue and scoring must remain visible during active judging
- Alerts are high-visibility but non-intrusive
- Ranking updates in real time

## ASCII wireframe

```text
+-----------------------------------------------------------------------------------+
| HEADER                                                                            |
+--------------------+----------------------------------------------+---------------+
| SIDEBAR            | LEFT: ATHLETE QUEUE                          | RIGHT PANEL   |
|                    +----------------------------------------------+ AI / Alerts   |
|                    | CENTER: SCORING WORKSPACE                    |               |
|                    |                                              |               |
|                    +----------------------------------------------+---------------+
|                    | BOTTOM: RANKING TABLE                                        |
+--------------------+--------------------------------------------------------------+
| BOTTOM BAR                                                                         |
+-----------------------------------------------------------------------------------+
```

---

# Athletes

Athletes module must be table-first.

Required columns:

- Name
- Club
- Category
- Discipline
- Coach
- Last Competition
- Average Score
- Status

Why cards should not be used:

- Cards reduce information density
- Cards slow comparison across many athletes
- Tables support sorting, filtering, scanning, and batch actions more efficiently

## ASCII wireframe

```text
+-----------------------------------------------------------------------------------+
| HEADER                                                                            |
+--------------------+------------------------------------------------+-------------+
| SIDEBAR            | TOOLBAR: search | filters | actions                           |
|                    +--------------------------------------------------------------+
|                    | ATHLETES TABLE                                                |
|                    | Name | Club | Category | Discipline | Coach | Last | Avg | St |
|                    |--------------------------------------------------------------|
|                    | ... rows ...                                                 |
+--------------------+--------------------------------------------------------------+
| BOTTOM BAR                                                                         |
+-----------------------------------------------------------------------------------+
```

---

# Competitions

Competitions is a management workspace with operational sections:

- Upcoming
- In Progress
- Finished
- Competition Details
- Registered Athletes
- Judging Panels
- Results

Recommended structure:

- Left section list (status groups)
- Center details and registered athletes
- Right inspector for judging panels and results context

## ASCII wireframe

```text
+-----------------------------------------------------------------------------------+
| HEADER                                                                            |
+--------------------+----------------------------------------------+---------------+
| SIDEBAR            | LEFT: Upcoming / In Progress / Finished      | RIGHT PANEL   |
|                    +----------------------------------------------+ Judging Panels |
|                    | CENTER: Competition Details                  | Results meta  |
|                    | Registered Athletes                          |               |
|                    | Results                                      |               |
+--------------------+----------------------------------------------+---------------+
| BOTTOM BAR                                                                         |
+-----------------------------------------------------------------------------------+
```

---

# Settings

Settings should be organized as a stable, table-of-contents style workspace:

- General
- Appearance
- Workspace
- Layouts
- AI
- Keyboard Shortcuts
- Backups
- About

Behavior:

- Left settings navigation list
- Center editable forms
- Optional right help/preview panel

---

# Shared Components

Reusable UI components across all modules:

- Panel
- Toolbar
- Sidebar
- Inspector
- Bottom Bar
- Status Badge
- Command Bar
- Search Box
- Filter Bar
- Table
- Tabs
- Modal
- Dialog
- Toast
- Empty State
- Loading State
- Skeleton

Rule:

- Every module must reuse these primitives before introducing a new visual pattern.

---

# Workspace Behaviour

Global behavior standards:

- Resizable panels
- Collapsible panels
- Internal scrolling only
- Persistent layouts
- Remember panel sizes
- Remember selected tabs
- Autosave
- Undo/Redo
- Keyboard shortcuts

These behaviors are part of product usability, not optional enhancements.

---

# Future Vision

Every future module must reuse the same workspace architecture, component language, and interaction model.

Users should never need to learn a different interface paradigm when moving between modules.

This blueprint must always be followed before implementing any new UI.
