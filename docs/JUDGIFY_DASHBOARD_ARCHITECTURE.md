# Judgify Dashboard Architecture

## Executive Summary

The Dashboard is the operational home of Judgify.

Its purpose is to help users immediately understand what deserves attention and continue working with the fewest possible interactions.

In product architecture terms, the Dashboard is the operational hub that connects active work (Planner, Video, Athletes, Competitions), system awareness (notifications, status, rule changes), and guided next steps (AI recommendations).

This document is based on the approved references:

- docs/JUDGIFY_BLUEPRINT.md
- docs/JUDGIFY_DESIGN_SYSTEM.md
- docs/JUDGIFY_COMPONENT_LIBRARY.md
- docs/JUDGIFY_DOCUMENTATION_AUDIT.md

Maturity legend used throughout this document:

- Implemented: operational and observable in current repository behavior.
- Partial: present but limited in scope, data, or integration depth.
- Planned: intentionally defined for near-term product iterations, not yet implemented.
- Future: strategic direction beyond initial operational iterations.

---

## 1. Dashboard Philosophy

The Dashboard follows these product principles:

- Clarity first: show the most relevant context before secondary detail.
- Actionable information: every major block should help users decide or act.
- Minimal clicks: high-frequency tasks must be reachable directly.
- Personalization: users should progressively shape the dashboard around their role.
- Responsiveness: dashboard behavior must adapt across desktop, tablet, and mobile.
- Accessibility: keyboard, assistive technology, and readable contrast are baseline requirements.
- Modular widgets: each widget has a clear responsibility and independent lifecycle.
- Progressive disclosure: advanced detail appears when needed, without overloading first view.

Operational interpretation:

- First view answers: What is pending? What changed? What should I do next?
- Second view supports: Why is this relevant? Where do I go now?

---

## 2. Primary Goals

The Dashboard must help users:

- Continue previous work quickly.
- Create new work quickly.
- Monitor progress across modules.
- Identify problems early.
- Receive notifications by priority.
- Access AI recommendations.
- Access frequently used modules with predictable shortcuts.

Success behavior:

- Users can resume important tasks without searching multiple pages.
- Users can launch common actions directly from one operational surface.

---

## 3. Supported User Types

### Coach

Primary objectives:

- Resume program planning and video review.
- Monitor athlete preparation and upcoming competitions.

Important widgets:

- Continue Working
- Upcoming Training
- Validation Warnings
- AI Suggestions
- Recent Videos
- Athletes Overview

Future personalization:

- Coach preset prioritizing planning, validation, and training timeline.

### Judge

Primary objectives:

- Review technical calls, competition readiness, and rule updates.

Important widgets:

- Latest Rule Changes
- Upcoming Competitions
- Notifications
- AI Suggestions
- System Status

Future personalization:

- Judge preset prioritizing rule changes, competition context, and review alerts.

### Athlete

Primary objectives:

- Track progress, training schedule, and recent review outcomes.

Important widgets:

- Upcoming Training
- Recent Activity
- Statistics Summary
- Recent Videos

Future personalization:

- Athlete preset emphasizing progress metrics and preparation schedule.

### Club

Primary objectives:

- Monitor athletes, projects, and event preparation at organization level.

Important widgets:

- Athletes Overview
- Projects Overview
- Upcoming Competitions
- Notifications

Future personalization:

- Club preset with aggregated team-level visibility.

### Federation

Primary objectives:

- Track rule adoption, competition readiness, and systemic issues.

Important widgets:

- Latest Rule Changes
- System Status
- Notifications
- Statistics Summary

Future personalization:

- Federation preset with governance and compliance-oriented summaries.

### Administrator

Primary objectives:

- Observe platform health and operational consistency.

Important widgets:

- System Status
- Notifications
- Validation Warnings
- Latest Rule Changes

Future personalization:

- Admin preset centered on reliability and cross-module consistency.

---

## 4. Dashboard Layout

The Dashboard layout follows the existing workspace shell model and defines responsibilities only.

### Top Header

Contains global operational controls and user context.

### Greeting

Humanized orientation block that confirms user identity and current context.

### Global Search

Cross-module discovery entry point for projects, athletes, videos, competitions, and commands.

### Notifications

Priority-aware entry point for actionable updates.

### User Menu

Access point for account and preferences behavior.

### Main Content

Primary widget grid with role-prioritized information and actions.

### Right Sidebar (future)

Secondary contextual stream for AI insights, reminders, and timeline events.

### Status Bar

Persistent lightweight system and workspace state indicators.

Layout maturity:

- Top Header: Partial
- Greeting: Partial
- Global Search: Planned
- Notifications area: Planned
- User Menu: Planned
- Main Content widget model: Partial
- Right Sidebar: Future
- Status Bar: Implemented in workspace architecture, Partial for Dashboard usage

---

## 5. Widget Catalogue

Each widget includes purpose, displayed information, actions, dependencies, component-library usage, current status, and evolution.

### Continue Working

- Purpose: Resume the most relevant in-progress task with minimal navigation.
- Displayed information: last active project, module, timestamp, context summary, pinned flag.
- Primary actions: Resume.
- Secondary actions: Pin, open details, remove from list.
- Dependencies: Planner, Video, Context/session continuity, Settings preferences.
- Component Library components used: DashboardWidget, Card, QuickActionButton, Badge.
- Current status: Planned.
- Future evolution: cross-device resume and cloud continuity.

### Recent Activity

- Purpose: Show recent meaningful user activity.
- Displayed information: activity type, title, relative time, module origin.
- Primary actions: Open related item.
- Secondary actions: Filter by module, clear item.
- Dependencies: Planner, Video, future Athletes and Competitions.
- Component Library components used: List, Card, Badge, Icon.
- Current status: Partial.
- Future evolution: real event-based activity feed.

### Quick Actions

- Purpose: Provide one-click access to high-frequency flows.
- Displayed information: prioritized action set by role.
- Primary actions: Launch selected flow.
- Secondary actions: Customize order, hide action.
- Dependencies: Planner, Video, Athletes, Competitions, Rules import.
- Component Library components used: QuickActionButton, Card, IconButton.
- Current status: Partial.
- Future evolution: adaptive ranking by usage patterns.

### Projects Overview

- Purpose: Summarize project portfolio state.
- Displayed information: active, paused, completed, pinned projects.
- Primary actions: Open project.
- Secondary actions: Pin, archive, filter.
- Dependencies: Planner project model, future cloud workspace services.
- Component Library components used: DashboardWidget, Card, StatisticCard, List.
- Current status: Planned.
- Future evolution: team-level project views.

### Upcoming Competitions

- Purpose: Surface competition deadlines and readiness.
- Displayed information: event name, date, athletes/programs affected, readiness status.
- Primary actions: Open competition detail.
- Secondary actions: View checklist, open related project.
- Dependencies: Competitions module, Athletes, Planner.
- Component Library components used: List, Card, Tag, Badge.
- Current status: Planned.
- Future evolution: integrated readiness scoring.

### Upcoming Training

- Purpose: Maintain training continuity.
- Displayed information: sessions, athletes, goals, timing.
- Primary actions: Open training context.
- Secondary actions: Mark complete, reschedule.
- Dependencies: Athletes module, Planner context.
- Component Library components used: List, Card, Calendar item pattern.
- Current status: Planned.
- Future evolution: coach-athlete shared schedule integration.

### Notifications

- Purpose: Centralize updates requiring awareness or action.
- Displayed information: category, priority, source module, timestamp.
- Primary actions: Open target.
- Secondary actions: Dismiss, mark read.
- Dependencies: System events, Planner, Video, Rules, Competitions.
- Component Library components used: NotificationBell, List, Badge, Alert.
- Current status: Planned.
- Future evolution: push and multi-channel delivery.

### Validation Warnings

- Purpose: Highlight unresolved quality or rule issues.
- Displayed information: issue summary, severity, linked entity.
- Primary actions: Open affected planner or video context.
- Secondary actions: Snooze, mark reviewed.
- Dependencies: Planner validation outputs, Video technical status.
- Component Library components used: Alert, Badge, RuleViolationCard.
- Current status: Partial.
- Future evolution: grouped warnings and escalation logic.

### AI Suggestions

- Purpose: Recommend next best actions and quality improvements.
- Displayed information: suggestion type, confidence signal, related entity.
- Primary actions: Apply/open recommendation target.
- Secondary actions: Dismiss, save for later, feedback.
- Dependencies: AI service layer, Planner, Video, Rules updates.
- Component Library components used: DashboardWidget, Alert, Card.
- Current status: Partial.
- Future evolution: role-aware recommendation strategy.

### Statistics Summary

- Purpose: Offer high-level operational metrics.
- Displayed information: key counts, trends, completion indicators.
- Primary actions: Drill into source module.
- Secondary actions: change timeframe.
- Dependencies: Planner, Video, Competitions, Athletes analytics.
- Component Library components used: StatisticCard, ChartCard, Card.
- Current status: Planned.
- Future evolution: comparative analytics by role.

### Recent Videos

- Purpose: Re-open recent analysis sessions quickly.
- Displayed information: video title, last review date, marker count, transfer status.
- Primary actions: Open video workspace.
- Secondary actions: Resume at marker, remove from history.
- Dependencies: Video storage/session context.
- Component Library components used: List, Card, Tag.
- Current status: Planned.
- Future evolution: shared team review thread links.

### Athletes Overview

- Purpose: Provide quick athlete portfolio awareness.
- Displayed information: athlete count, status highlights, key alerts.
- Primary actions: Open athlete profile/list.
- Secondary actions: create athlete, filter group.
- Dependencies: Athletes module, training and competition context.
- Component Library components used: StatisticCard, List, Card.
- Current status: Planned.
- Future evolution: readiness and progression scoring.

### Favourite Competitions

- Purpose: Keep important competitions visible.
- Displayed information: pinned events, date proximity, readiness state.
- Primary actions: Open competition.
- Secondary actions: Unpin/reorder.
- Dependencies: Competitions module and user personalization.
- Component Library components used: List, Card, Pin/Tag pattern.
- Current status: Planned.
- Future evolution: synchronized favorites across devices.

### Pinned Projects

- Purpose: Maintain immediate access to strategic projects.
- Displayed information: pinned projects with state and last update.
- Primary actions: Open pinned project.
- Secondary actions: Unpin, reprioritize.
- Dependencies: Projects model, personalization settings.
- Component Library components used: List, Card, Pin pattern.
- Current status: Planned.
- Future evolution: shared team pinning policies.

### System Status

- Purpose: Communicate platform health and data freshness.
- Displayed information: connectivity state, sync state, maintenance notices.
- Primary actions: Open status details.
- Secondary actions: retry refresh.
- Dependencies: platform services, settings, future cloud sync.
- Component Library components used: StatusBar, Alert, Badge.
- Current status: Partial.
- Future evolution: service-level diagnostics view.

### Latest Rule Changes

- Purpose: Ensure users remain aware of official rule updates.
- Displayed information: source, season, effective date, impact summary.
- Primary actions: Open rule change detail.
- Secondary actions: mark acknowledged.
- Dependencies: Rules documentation lifecycle and future rules services.
- Component Library components used: List, Alert, Tag.
- Current status: Planned.
- Future evolution: role-targeted rule impact summaries.

---

## 6. Continue Working

Continue Working is the flagship dashboard widget.

Resume model:

- Projects are resumed from last meaningful operational context.
- Context includes module, item identity, and recent timestamp.

Sorting:

- Default order: pinned first, then most recently opened.
- Secondary order: task urgency where available.

Last opened:

- The widget shows relative and exact recency context.

Pinning:

- Users can pin strategic work to avoid displacement by recency.

Resume behavior:

- Resume goes directly to the relevant module and context.
- If context is unavailable, route to the closest valid parent and inform the user.

Empty state:

- Explain there is no prior work yet.
- Offer clear creation shortcuts.

Future cloud sync:

- Continue Working should synchronize across sessions and devices.
- Conflict resolution should favor user clarity over hidden automatic merges.

Maturity: Planned.

---

## 7. Quick Actions

Quick Actions represent top-priority entry points.

Defined actions:

- New Program
- New Video Analysis
- New Athlete
- New Competition
- Import Competition
- Import Rules
- Open Planner
- Open Video

Prioritization model:

- Role-aware defaults first.
- Frequency of use second.
- Current context relevance third.

Operational rules:

- First row contains highest-frequency actions.
- Action labels must be explicit and outcome-oriented.
- Actions should avoid intermediate pages whenever possible.

Maturity:

- Core quick entry concept: Partial.
- Full action set listed above: Planned.

---

## 8. Notifications

Notification categories:

- Information
- Warning
- Critical
- Competition
- Rules
- AI
- System

Each notification defines:

- Priority: critical, high, medium, low.
- Icon: category-consistent visual marker.
- Dismiss: user-controlled clear action.
- Navigation target: explicit destination.

Operational behavior:

- Critical notifications remain visible until acknowledged or resolved.
- Lower-priority notifications can be grouped.
- Notification center supports read/unread lifecycle.

Future push support:

- Push delivery for high-value events is planned for cloud phases.

Maturity: Planned.

---

## 9. AI Panel

The AI Panel is a future assistant-oriented dashboard area.

Purpose:

- Surface relevant recommendations, not generic tips.

Possible suggestions:

- Validation issues requiring review.
- Missing elements or incomplete structures.
- Rule updates likely to impact active work.
- Training recommendations based on progress patterns.
- Video review opportunities linked to recent activity.

Product principles for AI panel:

- Explain why each suggestion is shown.
- Preserve user control for all decisions.
- Allow dismissal and feedback for recommendation quality.

Maturity:

- Early AI suggestion presence: Partial.
- Dedicated AI panel architecture: Planned/Future.

---

## 10. Dashboard States

The Dashboard must behave predictably in these states:

- First login: orientation plus high-value starter actions.
- New user: guided setup and role-based suggested actions.
- Empty account: meaningful empty widgets with next-step actions.
- Offline: show local availability and limited functionality context.
- Loading: progressive and non-blocking content reveal.
- Partial data: show available sections with clear incompleteness labels.
- Errors: isolate failing widget without collapsing entire dashboard.
- Maintenance: display clear service impact and expected recovery guidance.

State maturity expectations:

- Basic loading and empty behavior: Partial.
- Unified state system across all widgets: Planned.

---

## 11. Navigation Flow

Core journey patterns:

- Dashboard -> Continue Working -> Planner
- Dashboard -> Athlete -> Program -> Video
- Dashboard -> Competition -> Results

Additional operational flows:

- Dashboard -> Quick Actions -> New Program
- Dashboard -> Notifications -> Target module item
- Dashboard -> AI Suggestions -> Recommended context

Navigation principles:

- preserve user context when transitioning.
- return paths should be straightforward and predictable.
- avoid dead-end branches.

---

## 12. Widget Dependencies

Dependency map by widget group:

| Widget | Blueprint | Design System | Component Library | Planner | Video | Athletes | Competitions | Settings | Future services |
|---|---|---|---|---|---|---|---|---|---|
| Continue Working | Required | Required | Required | Yes | Yes | Planned | Planned | Yes | Yes |
| Recent Activity | Required | Required | Required | Yes | Yes | Planned | Planned | Partial | Yes |
| Quick Actions | Required | Required | Required | Yes | Yes | Planned | Planned | Partial | Planned |
| Projects Overview | Required | Required | Required | Yes | Partial | Planned | Planned | Partial | Yes |
| Upcoming Competitions | Required | Required | Required | Partial | Partial | Planned | Yes | Partial | Yes |
| Upcoming Training | Required | Required | Required | Yes | Partial | Planned | Partial | Partial | Planned |
| Notifications | Required | Required | Required | Planned | Planned | Planned | Planned | Planned | Yes |
| Validation Warnings | Required | Required | Required | Yes | Partial | Planned | Planned | Partial | Planned |
| AI Suggestions | Required | Required | Required | Partial | Partial | Planned | Planned | Partial | Yes |
| Statistics Summary | Required | Required | Required | Partial | Partial | Planned | Planned | Partial | Yes |
| Recent Videos | Required | Required | Required | Partial | Yes | Planned | Planned | Partial | Planned |
| Athletes Overview | Required | Required | Required | Partial | Partial | Planned | Partial | Partial | Planned |
| Favourite Competitions | Required | Required | Required | Partial | Partial | Planned | Planned | Partial | Planned |
| Pinned Projects | Required | Required | Required | Yes | Yes | Planned | Planned | Yes | Planned |
| System Status | Required | Required | Required | Partial | Partial | Partial | Partial | Yes | Yes |
| Latest Rule Changes | Required | Required | Required | Partial | Partial | Partial | Planned | Partial | Yes |

Legend in table cells:

- Yes: direct dependency expected.
- Partial: limited or indirect dependency currently expected.
- Planned: dependency introduced in future phases.

---

## 13. Personalization

Future customization capabilities:

- Widget visibility per user.
- Widget order and drag priority.
- Pinned widgets.
- Saved layouts.
- Compact mode.
- Coach presets.
- Judge presets.

Personalization principles:

- Start with role defaults.
- Allow easy override.
- Keep reset-to-default available.

Maturity:

- Core preference foundation exists in product settings context: Partial.
- Dashboard-specific personalization features: Planned/Future.

---

## 14. Performance Guidelines

Performance expectations for dashboard architecture:

- Fast loading of initial operational summary.
- Lazy loading for lower-priority widgets.
- Background refresh without user interruption.
- Cached summaries for frequent revisit scenarios.
- Independent widget refresh so one failure does not block others.

Quality target:

- perceived performance should prioritize immediate situational awareness.

Maturity:

- General product local persistence foundation: Implemented.
- Dashboard-specific independent refresh architecture: Planned.

---

## 15. Accessibility

Dashboard accessibility requirements:

- Keyboard: full navigability and operability.
- ARIA: semantic landmarks and labeled controls.
- Screen readers: clear reading order and meaningful live updates.
- Contrast: compliant semantic states for all widget statuses.
- Reduced motion: respect user preference and remove non-essential animation.
- Touch: comfortable target sizes and spacing.

Maturity:

- Design-system accessibility guidance: Implemented at documentation level.
- Full dashboard-level accessibility verification: Planned.

---

## 16. Version 1 Dashboard

### Required

- Continue Working
- Quick Actions
- Recent Activity
- Validation Warnings
- Notifications (initial set)
- System Status (basic)

### Optional

- Projects Overview
- Recent Videos
- Statistics Summary
- Pinned Projects

### Future

- Upcoming Competitions
- Upcoming Training
- Athletes Overview
- Favourite Competitions
- Latest Rule Changes advanced feed
- Full AI Panel

V1 maturity objective:

- Deliver immediate operational value while preserving modular growth.

---

## 17. Dashboard Roadmap

### Phase 1: Static dashboard

- Define widget contracts and static operational layout.
- Ship role-neutral base dashboard structure.

### Phase 2: Connected modules

- Connect dashboard widgets to Planner and Video continuity.
- Add notifications baseline and validation warning integration.

### Phase 3: Personalization

- Add visibility, order, pinning, and saved layout controls.
- Introduce role presets.

### Phase 4: AI

- Expand recommendation quality and contextual relevance.
- Add dedicated AI panel behaviors.

### Phase 5: Cloud

- Enable cross-device continuity, push notifications, and synchronized dashboard state.

Roadmap maturity labels:

- Phase 1 to 2: Planned.
- Phase 3 to 5: Future-oriented progression.

---

## 18. Acceptance Criteria

The Dashboard architecture is considered complete when all criteria below are satisfied:

- The Dashboard is clearly defined as Judgify operational hub.
- All required user types have explicit objectives and dashboard expectations.
- Layout responsibilities are unambiguous across header, content, sidebar, and status regions.
- Widget catalogue includes purpose, information, actions, dependencies, components, status, and evolution.
- Continue Working and Quick Actions are fully specified as high-priority operational mechanisms.
- Notification model includes categories, priority, routing, and lifecycle behavior.
- AI integration boundaries and intent are defined without implementation coupling.
- State behavior is defined for first login, empty, offline, loading, partial, errors, and maintenance.
- Navigation flows cover primary operational journeys.
- Dependency mapping across Blueprint, Design System, Component Library, and modules is explicit.
- Personalization roadmap is defined with role presets and layout controls.
- Performance and accessibility requirements are explicit and testable.
- V1 required/optional/future split is documented.
- Roadmap phases are staged from static baseline to cloud continuity.
- Maturity labels are consistently applied as Implemented, Partial, Planned, and Future.

---

## Current Maturity Baseline (Repository-Aligned Summary)

- Implemented:
  - Workspace shell primitives and status bar pattern at platform level.
  - Core routes for Home, Planner, and Video.
- Partial:
  - Home operational widgets (quick actions and recent activity in simplified form).
  - AI suggestion presence in module experiences.
  - Validation signaling in Planner/Video workflows.
- Planned:
  - Dedicated Dashboard route as primary operational home.
  - Notification center and rule-change widget integration.
  - Continue Working as canonical resume workflow.
- Future:
  - Advanced personalization presets and saved layouts.
  - Cloud synchronization, push notifications, and richer AI panel behavior.

## Duplicated Dashboard Responsibilities (Repository Observation)

Current duplication to resolve in future implementation:

- Dashboard entry concepts appear in both home and legacy dashboard module structures.
- Quick Actions and Recent Activity concepts appear in more than one feature area.
- Sidebar/navigation responsibilities exist in both workspace shell and legacy layout structures.

Consolidation direction:

- One canonical Dashboard operational surface.
- One canonical widget contract per responsibility.
- One canonical navigation shell model aligned to workspace architecture.
