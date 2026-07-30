# Judgify Product Blueprint

## Executive Summary
This document defines the functional and architectural product blueprint for Judgify based on repository inspection performed on 2026-07-29.

Current repository reality:
- The active end-user flow is Home -> Planner and Home -> Video.
- Planner and Video contain substantial implemented functionality, both using local browser persistence.
- Live and Athletes routes are explicit placeholders.
- Settings currently exist as a global panel entry point, not as a dedicated route.
- There are multiple architectural layers coexisting (current active modules, legacy/empty scaffolding, and forward-looking docs), which creates duplication and navigation inconsistency.

This blueprint separates what exists now from what is proposed for product completion. It does not change runtime behavior.

## 1. Document Purpose
This document is the functional and architectural reference for the Judgify product.

Scope:
- Audit current repository functionality and route coverage.
- Define intended complete product architecture as a product proposal.
- Classify modules by implementation maturity.
- Identify current architectural gaps and inconsistencies.

Intended audience:
- Product owner and product management.
- Engineering leads and feature developers.
- UX/design leads working on IA, navigation, and shell patterns.
- QA planning functional scope and traceability.

Relationship with future architecture/design-system documentation:
- This document defines product functional architecture (what modules do, who uses them, how they relate).
- Technical architecture documents define implementation choices (backend, data model, auth providers, infra).
- Design system/UI blueprint documents define visual and interaction standards.

## 2. Product Vision
Judgify is a platform for artistic skating program planning, video analysis, technical review, athlete management, and competition workflows.

Primary problem solved:
- Stakeholders in artistic skating need a single operational workspace to prepare, review, and improve technical performance while staying aligned with official rule frameworks.

Intended users:
- Coach
- Judge
- Athlete
- Family member
- Club administrator
- Platform administrator

Core product value:
- Centralizes technical planning and review workflows.
- Connects planning and video review through explicit technical-call transfer.
- Supports multilingual UX and reusable workspace shell patterns.
- Preserves user control over scoring decisions (no automatic hidden scoring changes).

What Judgify is not intended to be in version 1.0:
- Not a full autonomous judging engine.
- Not a finalized federation-certified rules engine for all competitions (draft packs remain incomplete).
- Not a complete cloud-authenticated multi-tenant platform yet.
- Not a replacement for official judging decisions.

## 3. Current Repository Audit

### 3.1 Routes and Pages
- Route `/` -> Home experience through `app/page.tsx` and `features/home/pages/WelcomeExperience.tsx`.
- Route `/planner` -> Planner workspace through `app/planner/page.tsx` and `features/planner/components/workspace/PlannerWorkspace.tsx`.
- Route `/video` -> Video workspace through `app/video/page.tsx` and `features/video/pages/VideoWorkspace.tsx`.
- Route `/live` -> Placeholder page (`Em desenvolvimento...`) in `app/live/page.tsx`.
- Route `/athletes` -> Placeholder page (`Em desenvolvimento...`) in `app/athletes/page.tsx`.

Status:
- `/`: Partially implemented
- `/planner`: Partially implemented
- `/video`: Partially implemented
- `/live`: Placeholder
- `/athletes`: Placeholder

### 3.2 Shared Layout and Shell
Observed shell architecture:
- Root providers in `app/layout.tsx`: `I18nProvider` and `UserSettingsProvider`.
- Shared shell primitives in `shared/components/workspace/`:
  - `WorkspaceShell.tsx`
  - `WorkspaceHeader.tsx`
  - `WorkspaceSidebar.tsx`
  - `WorkspacePanel.tsx`
  - `WorkspaceStatusBar.tsx`

Current usage pattern:
- Home, Planner, and Video route pages use `WorkspaceShell` + `WorkspaceHeader`.
- Sidebar is currently rendered with zero-width/empty items in active routes.
- `SettingsEntryPoint` is injected via shared `WorkspaceHeader`.

Status:
- Workspace primitives: Implemented
- Unified global navigation behavior: Partially implemented

### 3.3 Current Planner Functionality
Evidence in:
- `features/planner/components/workspace/PlannerWorkspace.tsx`
- `features/planner/context/WorkspaceContext.tsx`
- `features/planner/components/workspace/WorkspaceLibrary.tsx`
- `features/planner/components/workspace/technical-sheet/TechnicalSheet.tsx`
- `features/planner/components/workspace/TechnicalPanel.tsx`
- `features/planner/engine/*`
- `features/planner/rules/*`

Implemented behaviors:
- Program element creation/edit/remove/reorder via workspace context.
- Technical sheet rendering with per-element BV/GOE/status/notes and totals.
- Rule validation feedback via `ValidationEngine` and `ProgramRules`.
- Manual deductions and manual PCS input.
- Local persistence for elements, deductions, and PCS in localStorage keys:
  - `judgify-planner-elements`
  - `judgify-planner-deductions`
  - `judgify-planner-pcs`

Important maturity notes:
- Rule packs include draft placeholders and empty structures for official packs (`fpp/2026`, `world-skate/2026`).
- Builder/assistant suggestions exist but are advisory and not equivalent to confirmed official scoring logic.

Status:
- Planner core workflow: Partially implemented
- Technical score and validation UX: Partially implemented
- Official rule-pack completeness: Placeholder

### 3.4 Current Video Functionality
Evidence in:
- `features/video/pages/VideoWorkspace.tsx`
- `features/video/localVideoStorage.ts`

Implemented behaviors:
- Local video load/replace/remove.
- Playback controls (play/pause, seek, frame-step approximation, speed, volume, fullscreen).
- Timeline rendering with zoom and draggable playhead.
- Marker CRUD with marker types.
- Technical-call editor per marker (code/displayName/elementType/status/GOE/notes).
- Marker technical-call transfer trigger to Planner queue.
- Persistence via IndexedDB for active video and markers.
- Timeline zoom persisted to localStorage key `judgify-video-timeline-zoom-v1`.

Status:
- Video local analysis workspace: Partially implemented
- Local persistence and restore: Implemented
- Cloud/collaborative workflows: Planned

### 3.5 Video-to-Planner Transfer
Evidence in:
- Producer: `features/video/pages/VideoWorkspace.tsx`
- Queue: `features/core/context/videoPlannerTransferQueue.ts`
- Consumer: `features/planner/components/workspace/PlannerWorkspace.tsx`

Current workflow:
- Video marker technical call can be sent to queue.
- Planner consumes pending queue items and creates planner elements.
- Transfer outcome tracks success/warning depending on catalogue code resolution.
- Catalogue resolution and any Base Value or scoring resolution are owned by Planner during transfer queue consumption.
- Queue persisted in localStorage key `judgify-video-planner-transfer-queue-v1`.

Status:
- Manual transfer pipeline: Implemented
- End-to-end traceability to durable project entities: Partially implemented

### 3.6 Internationalization
Evidence in:
- `shared/i18n/locales.ts`
- `shared/i18n/I18nProvider.tsx`
- `shared/i18n/translations/*`

Current supported locales:
- `pt`, `en`, `es`, `fr`, `it`

Current behavior:
- Locale stored in localStorage key `judgify.locale` (and legacy key fallback).
- Fallback chain: selected locale -> `en` -> `pt`.
- Translation coverage is strongest for Settings and Video domain strings.

Status:
- I18n infrastructure: Implemented
- Full product-wide translated copy consistency: Partially implemented

### 3.7 Settings and Preferences
Evidence in:
- `shared/settings/SettingsEntryPoint.tsx`
- `shared/settings/UserSettingsProvider.tsx`
- `shared/settings/types.ts`

Currently implemented settings:
- Language selection (through i18n provider).
- Appearance (`system`, `light`, `dark`) stored at `judgify.appearance`.
- Video preferences stored at `judgify.videoPreferences`:
  - `restoreLastVideoOnOpening`
  - `confirmBeforeDeletingMarkers`
  - `showKeyboardShortcutHints`

Status:
- Global in-app settings panel: Implemented
- Dedicated Settings route/page: Placeholder (linked in some navigation data, route does not exist)
- Account/security settings: Planned

### 3.8 Local Persistence and Session-Like State
Evidence in:
- `features/planner/context/WorkspaceContext.tsx`
- `features/video/localVideoStorage.ts`
- `features/core/context/ContextEngine.ts`
- `features/core/context/videoPlannerTransferQueue.ts`
- `features/core/session/*`

Observed persistence sources:
- localStorage (planner, global context, queue, settings, locale, timeline zoom, session).
- IndexedDB (active video + video markers).

Status:
- Local persistence primitives: Implemented
- Unified ownership model across resources: Partially implemented

### 3.9 Placeholders and Unfinished Areas
Confirmed placeholders/incomplete areas:
- `app/live/page.tsx`: explicit placeholder text.
- `app/athletes/page.tsx`: explicit placeholder text.
- Rule packs with TODO/empty structures in `features/planner/rules/packs/fpp/2026/index.ts` and `features/planner/rules/packs/world-skate/2026/index.ts`.
- Empty/partial scaffolding in `features/workspace/` (empty files and empty folders).
- `core/` contains partially empty or legacy structures (`core/index.ts`, `core/rules/validator.ts`, `core/data/steps.ts`, `core/data/choreo.ts` empty).
- Merge-conflict markers present in root docs `ARCHITECTURE.md` and `ROADMAP.md`.

Status summary:
- Live and Athletes user modules: Placeholder
- Official rules completeness: Placeholder
- Workspace/legacy scaffolds: Planned or Future depending module intent

## 4. User Types
Planned user types and product intent (not authorization implementation):

### Coach
Primary objectives:
- Build and optimize programs.
- Review technical execution and progression.

Typical actions:
- Create/edit program elements.
- Review validations and score breakdown.
- Analyze videos and transfer technical calls.

Expected dashboard information:
- Active programs, recent videos, pending validations, upcoming competitions.

Expected access level:
- High edit access for owned athletes/programs/videos.

### Judge
Primary objectives:
- Perform and review technical calls consistently.

Typical actions:
- Review video markers and technical calls.
- Compare technical-call reasoning and validation outcomes.

Expected dashboard information:
- Recent technical reviews, rule updates, competition sessions.

Expected access level:
- Strong read/review plus technical annotation capabilities.

### Athlete
Primary objectives:
- Understand progress and training priorities.

Typical actions:
- Review assigned programs and videos.
- Track improvements and coach feedback.

Expected dashboard information:
- Personal progress summary, latest reviewed videos, upcoming events.

Expected access level:
- Mostly read access, limited personal notes/tasks.

### Family member
Primary objectives:
- Follow athlete progress in understandable terms.

Typical actions:
- View simplified performance summaries and key updates.

Expected dashboard information:
- Upcoming competitions, recent results, explanatory highlights.

Expected access level:
- Read-only, simplified scope.

### Club administrator
Primary objectives:
- Manage club operations and user organization.

Typical actions:
- Manage club-level users, athletes, and competitions.

Expected dashboard information:
- Club activity overview, participation and event status.

Expected access level:
- Broad management rights inside club boundary.

### Platform administrator
Primary objectives:
- Operate platform-wide configuration and governance.

Typical actions:
- Manage platform settings, policies, and support operations.

Expected dashboard information:
- System status, tenant summaries, governance alerts.

Expected access level:
- Full platform administrative rights.

## 5. Authentication and Account Model
Target experience definition:

Before authentication:
- Enter
- Create account
- Optional limited guest experience

Account creation fields:
- firstName
- lastName
- email
- password (or future identity provider)
- role
- clubOrOrganization
- preferredLanguage
- avatar

Avatar options:
- Upload image from device gallery
- Choose predefined avatar
- Fallback to initials if no image

After authentication:
- Personalized greeting
- Account menu
- Profile
- Account and Security
- Settings
- Sign out

Critical architectural clarifications:
- localStorage state is not authentication.
- Real authentication requires backend identity/session services.
- Passwords must never be stored directly in browser storage.
- Account data and project resources must eventually be associated with authenticated `userId`.

Current repository status:
- Authentication/account system: Planned
- Local session/context storage: Implemented (non-auth)

## 6. Global Navigation Architecture
Candidate navigation areas and recommendation:

### Home
Purpose:
- Operational launch and resume surface.
Destination:
- `/`
Benefiting roles:
- All
Current status:
- Partially implemented
Recommended placement:
- Primary navigation

### Planner
Purpose:
- Program planning and technical sheet ownership.
Destination:
- `/planner`
Benefiting roles:
- Coach, Judge
Current status:
- Partially implemented
Recommended placement:
- Primary navigation

### Video Analysis
Purpose:
- Video review and technical-call annotation.
Destination:
- `/video`
Benefiting roles:
- Coach, Judge, Athlete
Current status:
- Partially implemented
Recommended placement:
- Primary navigation

### Live
Purpose:
- Competition live operation.
Destination:
- `/live`
Benefiting roles:
- Judge, Coach, Club admin
Current status:
- Placeholder
Recommended placement:
- Primary navigation (once functional)

### Athletes
Purpose:
- Athlete records and linked resources.
Destination:
- `/athletes`
Benefiting roles:
- Coach, Club admin
Current status:
- Placeholder
Recommended placement:
- Primary navigation

### Competitions
Purpose:
- Competition preparation, operation, and history.
Destination:
- Proposed `/competitions`
Benefiting roles:
- Judge, Club admin, Coach
Current status:
- Planned
Recommended placement:
- Primary navigation

### Library
Purpose:
- Search/filter user-owned resources across modules.
Destination:
- Proposed `/library`
Benefiting roles:
- All production roles
Current status:
- Planned
Recommended placement:
- Secondary navigation or primary (if central to workflow)

### Reports
Purpose:
- Generated operational and summary reports.
Destination:
- Proposed `/reports`
Benefiting roles:
- Coach, Judge, Club admin
Current status:
- Planned
Recommended placement:
- Secondary navigation

### Settings
Purpose:
- User preferences and app configuration.
Destination:
- Current modal entrypoint in header (`SettingsEntryPoint`), route `/settings` currently absent.
Benefiting roles:
- All
Current status:
- Partially implemented
Recommended placement:
- Secondary navigation and/or account menu

### Account
Purpose:
- Profile, security, and session actions.
Destination:
- Proposed account menu pages
Benefiting roles:
- All authenticated users
Current status:
- Planned
Recommended placement:
- Account menu (not primary nav)

Navigation inconsistency to resolve:
- Existing navigation data in `shared/layout/sidebarItems.ts` and `features/dashboard/dashboardData.ts` references `/settings` route that does not exist.

## 7. Application Shell
Intended shared shell elements:
- Product identity
- Current page title
- Primary navigation
- Settings trigger
- Notifications placeholder
- Before authentication, the shared header exposes: Sign in and Create account.
- After authentication, the shared header exposes: avatar image or initials fallback, user first name, and account menu.
- Authenticated user avatar/menu
- Responsive behavior with mobile navigation strategy

Current shared architecture reference:
- `shared/components/workspace/WorkspaceShell.tsx`
- `shared/components/workspace/WorkspaceHeader.tsx`
- `shared/components/workspace/WorkspaceSidebar.tsx`
- `shared/components/workspace/WorkspaceStatusBar.tsx`

What should remain shared:
- Shell frame, responsive regions, panel primitives, status bar pattern, global settings entry, localization context.

What should be feature-specific:
- Module toolbar controls.
- Domain-specific side panels (library, technical editor, coach assistant).
- Module-specific status messages.

Current status:
- Shell primitives: Implemented
- Shared navigation + account/notification integration: Partially implemented

## 8. Home Dashboard
Home should be an operational dashboard, not a static welcome page.

### Personalized greeting
Target behavior:
- Localized greetings such as "Hello, Joao" or "Good morning, Joao" using translation templates.
- The personalized greeting must use the authenticated user's firstName and the current active locale for template selection.
Current status:
- Placeholder (current hero text is static and not personalized by account identity)

### Continue working
Target behavior:
- Clickable recent items reopening exact resource and work state.
Required stored context:
- Resource identity
- Module route
- Resume state
- Last modified timestamp
Current status:
- Placeholder (current `RecentActivity` is static card data in `features/home/components/RecentActivity.tsx`)

### Projects overview
Target cards:
- Programs
- Videos
- Athletes
- Competitions
Current status:
- Planned

### Notifications
Target examples:
- Rule update
- Unfinished validation
- Upcoming competition
- Transfer warning
Current status:
- Planned

### Quick actions
Current reality:
- Quick actions are clickable and route to existing modules in `features/home/components/QuickActions.tsx`.
- "Create Schema" opens wizard and seeds planner context via `ContextEngine`.
Current status:
- Partially implemented

Explicit placeholder confirmation:
- Static recent activity cards are placeholders confirmed by hardcoded `activities` array in `features/home/components/RecentActivity.tsx`.

## 9. Planner Domain
Purpose:
- Build and maintain program technical sheets with scoring-related technical data.

Source-of-truth position:
- Planner is the source of truth for element catalogue usage, base value resolution in technical sheets, and scoring-related technical data used by planning workflows.

Current capabilities:
- Element library selection (jumps/spins/sequences).
- Technical sheet with GOE edits and status.
- Validation feedback and score summary.
- Manual deductions and manual PCS controls.
- Local persistence of planner state.
- Consumption of transferred technical calls from Video queue.

Ownership notes:
- Program elements are currently owned in `WorkspaceContext` local state and localStorage.
- No persistent user-bound project entity yet.

Planned evolution:
- Move from local transient state to durable project model (`Program`, `ProgramElement`, ownership metadata).
- Use confirmed official rule packs as primary validation source.
- Keep Planner as authoritative for scoring-related program technical data.

Status:
- Partially implemented

## 10. Video Analysis Domain
Purpose:
- Review local video execution and annotate technical calls linked to timeline markers.

Current capabilities:
- Video loading from local device.
- Playback controls, timeline, zoom, playhead interactions.
- Marker creation/edit/delete and categorization.
- Technical calls with status and GOE notes.
- Persistence in IndexedDB and restore behavior.
- Manual transfer of confirmed calls to Planner queue.

Current manual workflow:
1. Load video locally.
2. Create markers at relevant timestamps.
3. Populate technical call details.
4. Confirm call.
5. Send call to Planner.
6. Planner consumes queue and inserts corresponding element.

Source-of-truth boundary:
- Video is not the source of truth for Planner scoring data.
- Video contributes review observations that must be explicitly transferred/confirmed.
- Video transfers only technical-call payloads and marker provenance.
- Video must not resolve Planner catalogue codes, Base Value or scoring values.

Future possibilities (not implemented):
- AI-assisted detection
- Slow motion enhancements beyond current controls
- Side-by-side comparison
- Collaborative review

Status:
- Partially implemented

## 11. Athlete Management
Planned athlete entity should include:
- Identity
- Category
- Discipline
- Club
- Coach
- Programs
- Videos
- Competition history
- Notes
- Documents

Relationship model intent:
- Athlete has many Programs.
- Athlete has many VideoProjects.
- Athlete participates in CompetitionEntries.
- Reports aggregate athlete-related resources.

Current repository status:
- Route exists as placeholder page at `/athletes`.
- No dedicated `features/athletes` module directory exists.

Status:
- Placeholder (route)
- Planned (domain)

## 12. Competition Management
Planned competition model:
- Competition entity
- Event
- Category
- Participants
- Running order
- Judging panel
- Results
- Status lifecycle

Proposed lifecycle:
- Draft
- Prepared
- Live
- Completed
- Archived

Operational separation:
- Preparation: entries, running order, panel setup.
- Live operation: real-time calls/scoring state.
- Final reporting: published outcomes and summaries.

Current repository status:
- `/live` route exists as placeholder page.
- No dedicated competition route/module implemented.

Status:
- Live route: Placeholder
- Competition domain: Planned

## 13. Library
Definition:
- Library is the searchable collection of user-owned resources.

Planned resource types:
- Programs
- Videos
- Athletes
- Competitions
- Reports
- Templates

Expected functions:
- Filters
- Sorting
- Search
- Ownership boundaries
- Archive behavior
- Recent resources access

Current repository status:
- Planner has an internal element "library" panel (`WorkspaceLibrary.tsx`) for element selection, not a cross-resource product library.

Status:
- Cross-product Library: Planned
- Planner element library: Implemented

## 14. Reports
Possible version 1.0 reports:
- Program technical sheet
- Athlete progress summary
- Video technical-call report
- Competition result summary

Version boundary:
- Version 1.0 should focus on operational, exportable summaries.
- Advanced analytics and predictive reports remain post-1.0.

Current repository status:
- No dedicated Reports route/module.
- Technical sheet export-like text output exists in Planner technical sheet flow.

Status:
- Basic report-like output in Planner: Partially implemented
- Full Reports domain: Planned

## 15. Settings
Planned settings sections:
- Language
- Appearance
- Video preferences
- Accessibility
- Notifications
- Privacy
- About Judgify

Account flow rule:
- Account creation and login must not be hidden inside Settings.
- Before-auth registration/login must remain explicit entry points.

Current implemented settings and persistence keys:
- Language via i18n provider: `judgify.locale` (legacy fallback `judgify-locale`).
- Appearance: `judgify.appearance`.
- Video preferences: `judgify.videoPreferences`.
- Video timeline zoom preference: `judgify-video-timeline-zoom-v1`.

Status:
- Language/appearance/video preference settings: Implemented
- Accessibility/notifications/privacy/about sections: Planned
- Account and Security settings: Planned

## 16. Data Ownership and Relationships
Conceptual product model (proposal):

### User
Purpose:
- Authenticated identity owner of resources.
Owner:
- Platform identity system.
Relationships:
- One-to-one with UserProfile.
- One-to-many Programs, VideoProjects, Reports, RecentActivity, UserPreference.
Source of truth module:
- Future Auth/Account backend.

### UserProfile
Purpose:
- Display and personalization metadata.
Owner:
- User.
Relationships:
- Belongs to User.
- References Club membership(s).
Source of truth module:
- Account/Profile module.

### Club
Purpose:
- Organizational grouping.
Owner:
- Club administrator.
Relationships:
- Has members, athletes, competitions.
Source of truth module:
- Club admin domain.

### Athlete
Purpose:
- Athlete identity and context for technical resources.
Owner:
- Club/coaches with role constraints.
Relationships:
- Has Programs, VideoProjects, CompetitionEntries.
Source of truth module:
- Athlete Management.

### Program
Purpose:
- Planned technical program artifact.
Owner:
- User/Club context.
Relationships:
- Has many ProgramElements.
- Linked to Athlete and Competition context.
Source of truth module:
- Planner domain.

### ProgramElement
Purpose:
- Technical unit in a Program.
Owner:
- Program owner.
Relationships:
- Belongs to Program.
- May reference transferred TechnicalCall provenance.
Source of truth module:
- Planner domain.

### VideoProject
Purpose:
- Video review workspace record.
Owner:
- User/Club context.
Relationships:
- Has many VideoMarkers.
- Linked to Athlete/Program optionally.
Source of truth module:
- Video Analysis domain.

### VideoMarker
Purpose:
- Timestamped marker in video timeline.
Owner:
- VideoProject owner.
Relationships:
- Belongs to VideoProject.
- May hold TechnicalCall and transfer state.
Source of truth module:
- Video Analysis domain.

### TechnicalCall
Purpose:
- Human-annotated technical observation.
Owner:
- Calling user (coach/judge).
Relationships:
- Attached to VideoMarker and/or referenced by ProgramElement import history.
Source of truth module:
- Video Analysis input; Planner consumes confirmed transfer.

### Competition
Purpose:
- Competition operational entity.
Owner:
- Club/platform context.
Relationships:
- Has many CompetitionEntries and results.
Source of truth module:
- Competition domain.

### CompetitionEntry
Purpose:
- Athlete/program participation record.
Owner:
- Competition owner.
Relationships:
- Belongs to Competition and Athlete.
Source of truth module:
- Competition domain.

### Report
Purpose:
- Generated snapshot summary.
Owner:
- Requesting user/org.
Relationships:
- References Program/Athlete/Competition/VideoProject.
Source of truth module:
- Reports domain.

### UserPreference
Purpose:
- Persisted user-level settings.
Owner:
- User.
Relationships:
- Belongs to User.
Source of truth module:
- Settings domain.

### RecentActivity
Purpose:
- Clickable history pointers for resume workflows.
Owner:
- User.
Relationships:
- References concrete resources (Program, VideoProject, Athlete, Competition).
Source of truth module:
- Home dashboard activity service.

## 17. Recent Activity Model
Conceptual fields for clickable activity entries:
- id
- userId
- resourceType
- resourceId
- title
- subtitle
- module
- route
- lastOpenedAt
- lastModifiedAt
- resumeState
- status

Design rule:
- Recent activity must reference real resources, not duplicate full project payloads.
- `resumeState` should contain lightweight navigation/workspace context only.

Current repository status:
- Static placeholder recent cards only; no persisted clickable recent-activity model yet.

## 18. Roles and Permissions Matrix
Preliminary matrix for product planning only (not implemented authorization).

| Action | Coach | Judge | Athlete | Family member | Club administrator | Platform administrator |
|---|---|---|---|---|---|---|
| View athlete | Yes | Yes | Self scope | Related athlete scope | Yes | Yes |
| Edit athlete | Yes | Limited | No | No | Yes | Yes |
| Create program | Yes | Optional | Limited | No | Yes | Yes |
| Edit program | Yes | Optional review edits | Limited/self if enabled | No | Yes | Yes |
| Analyse video | Yes | Yes | Self scope | Limited view | Yes | Yes |
| Transfer technical calls | Yes | Yes | No | No | Yes | Yes |
| Create competition | Limited | Yes | No | No | Yes | Yes |
| Operate live competition | Limited | Yes | No | No | Yes | Yes |
| View reports | Yes | Yes | Self scope | Limited summary | Yes | Yes |
| Manage club users | No | No | No | No | Yes | Yes |
| Manage platform settings | No | No | No | No | No | Yes |

## 19. Internationalization Rules
Rules:
- Internal domain values remain in English identifiers.
- Visible strings use translation keys.
- Persisted domain values are not translated.
- Technical terminology is translated only at presentation layer.
- Portuguese terminology should use "Pião / Piões".
- Never use "Pirueta".
- Locale fallback follows provider behavior (`selected -> en -> pt` currently).
- Account greeting templates should be locale-aware and template-based.

Current locale support evidence:
- `pt`, `en`, `es`, `fr`, `it` in `shared/i18n/locales.ts`.

Status:
- I18n framework: Implemented
- Product-wide terminology governance: Partially implemented

## 20. AI Boundaries
Future AI use cases:
- Technical-call assistance
- Program suggestions
- Rule explanation
- Validation explanation
- Video review support

Required boundaries:
- AI suggestions must be reviewable.
- AI must not silently alter scoring.
- AI output must not replace official judging.
- Manual confirmation must remain available.
- AI-generated technical calls must be distinguishable from human calls.

Current repository status:
- Assistive suggestion layers exist (home/planner/video language and helper modules), but no authoritative auto-judging path is implemented.

## 21. Version Scope
Proposal for review.

### Version 1.0
Recommended minimum complete workflow:
- Account and authentication foundation
- Profile basics
- Operational Home dashboard with clickable recent activity
- Athlete management core
- Planner domain
- Video analysis domain
- Manual Video-to-Planner transfer
- Library
- Basic reports
- Settings
- Localization

### Post-1.0
Examples:
- Advanced live competition operation
- Club collaboration depth
- Cloud media processing
- AI-assisted analysis expansion
- Advanced analytics
- Subscription plans

## 22. Functional Roadmap
Recommended dependency-driven order:

1. Product blueprint approval
2. Design system foundation
3. Account and authentication architecture
4. Persistent project model
5. Real Home dashboard
6. Athlete management
7. Library
8. Reports
9. Competition workflows
10. AI foundations

Dependency rationale:
- Architecture and UX foundations must be approved before expanding modules.
- Auth and persistent ownership model are prerequisites for reliable cross-module data.
- Home dashboard depends on real resources and activity model.
- Athlete, library, and reports depend on stable entities and ownership.
- Competition workflows depend on athlete/program/video integration.
- AI features should layer on top of stable data and workflows.

## 23. Open Product Decisions
Pending product-owner decisions:
- Guest access policy and limits.
- Authentication provider strategy.
- Cloud database and tenancy model.
- Video storage strategy (local-only vs cloud/hybrid).
- Multi-club membership model.
- Athlete self-account model.
- Family access and permission boundaries.
- Competition scope for version 1.0.
- Subscription/commercial model.
- Data retention rules and deletion policy.
- Regulatory compliance obligations by geography.

## 24. Architectural Risks
Evidence-backed risks:

1. LocalStorage scalability and integrity risk
- Multiple critical states rely on localStorage across modules.
- Evidence: planner/context/settings/context/queue/session keys.

2. Static placeholder content risk
- Home recent activity is static and non-clickable.
- Live and Athletes are placeholders.

3. Multiple persistence source complexity
- localStorage + IndexedDB + context singleton patterns without unified ownership model.

4. Navigation inconsistency risk
- Data models reference routes that are absent (`/settings`).
- Sidebar/navigation patterns exist in multiple places with differing usage.

5. Duplicated responsibility risk
- Legacy `core/` data/rules structures coexist with active `features/planner` domain implementations.
- Empty scaffolding can create uncertainty about canonical source.

6. Migration risk from local to cloud model
- Current entities are not user-bound persistent resources yet.

7. Authorization gap risk
- Role model is defined conceptually but no authorization layer is implemented.

8. Repository hygiene risk (documentation conflicts)
- Merge conflict markers in `ARCHITECTURE.md` and `ROADMAP.md` indicate unresolved documentation state.

Anticipated risks (proposal-level):
- As modules expand (competitions, library, reports), inconsistent ownership boundaries may cause cross-module regressions unless source-of-truth rules are formalized early.

## 25. Definition of Product Architecture Completion
Before implementing new major modules, these approvals are required:
- Navigation map and route ownership.
- Account/authentication flow.
- User roles and permission model.
- Data ownership and entity relationships.
- Version 1.0 scope boundaries.
- Home dashboard operational behavior.
- Design-system direction and shell governance.
- Backend strategy (identity, persistence, media, reporting).

Completion criteria:
- Product-owner signoff on this blueprint (or approved revision).
- Engineering architecture alignment document approved.
- Design-system implementation plan aligned with module roadmap.

---

## Final Current Route Table

| Route | Current Purpose | Status |
|---|---|---|
| `/` | Home launcher experience with hero, quick actions, and static recent activity cards | Partially implemented |
| `/planner` | Planner workspace for element selection, technical sheet, validation, scoring controls, and queue consumption | Partially implemented |
| `/video` | Local video analysis workspace with markers, technical calls, and transfer to Planner queue | Partially implemented |
| `/live` | Live competition page placeholder with "Em desenvolvimento..." text | Placeholder |
| `/athletes` | Athletes page placeholder with "Em desenvolvimento..." text | Placeholder |
