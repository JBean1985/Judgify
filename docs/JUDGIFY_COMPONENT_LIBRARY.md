# Executive Summary

The Judgify Component Library is the official reference for reusable UI building blocks across the platform.

Its purpose is to standardize what components exist, why they exist, where they are used, and how they behave, without prescribing implementation details.

This document is based on:
- docs/JUDGIFY_BLUEPRINT.md
- docs/JUDGIFY_DESIGN_SYSTEM.md
- Current repository structure and component files in shared and feature modules

The library supports:
- Product consistency
- Faster feature delivery
- Accessibility and predictable behavior
- Reduced duplication between modules

---

# 1. Component Philosophy

Judgify components follow these principles:

- reusable: Components are designed for repeated use across multiple modules.
- composable: Components should be assembled into larger workflows without tight coupling.
- accessible: Components must support keyboard, screen reader, and contrast requirements.
- predictable: Similar actions should produce similar interaction patterns.
- responsive: Components must adapt to desktop, tablet, and mobile constraints.
- feature-independent: Shared components should not encode feature business logic.
- shared before feature-specific: New generic patterns must be evaluated for shared extraction first.

Responsibility rule:
- A component must have one primary responsibility.
- Two components must not solve the same problem in parallel.
- If overlap exists, one becomes canonical and the other is migrated or deprecated.

---

# 2. Component Categories

Official categories:

- Navigation
- Workspace
- Forms
- Feedback
- Data Display
- Dialogs
- Media
- Planner
- Video
- Competition
- Athletes
- Reports
- Account
- Settings
- Utility

Category intent:

- Navigation: global and local movement across pages and modules.
- Workspace: shell and panel primitives for operational screens.
- Forms: user input controls and field composition.
- Feedback: status, error, success, warning, and progress communication.
- Data Display: structured rendering of lists, summaries, and dense data.
- Dialogs: interruptive overlays and decision points.
- Media: media playback, navigation, and annotation building blocks.
- Planner: technical program construction and scoring support blocks.
- Video: analysis workflow around timeline, markers, and technical calls.
- Competition: event operations, ordering, and judging surfaces.
- Athletes: athlete entities, profile, and history views.
- Reports: analytics summaries, filters, and export experiences.
- Account: user identity and security-related surfaces.
- Settings: system and preference management surfaces.
- Utility: small cross-cutting helpers and wrappers.

Maturity legend used throughout this document:
- Implemented
- Partial
- Planned
- Future

---

# 3. Navigation Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| AppHeader | Global top-level navigation and context entry. | Show current module context and global utilities. | Active module context, utility actions, locale data. | Navigation actions, quick global access. | Partial (current equivalent: shared workspace header pattern in shared/components/workspace/WorkspaceHeader.tsx). | Converge legacy header usage into one canonical app header contract. |
| Sidebar | Main module navigation container. | Present core routes and stable navigation order. | Navigation items, active route, optional badges. | Route transitions. | Partial (legacy/shared variation exists in shared/layout/Sidebar.tsx; shell sidebar exists in shared/components/workspace/WorkspaceSidebar.tsx; active pages currently pass empty items). | Unify shell sidebar and legacy sidebar into one canonical navigation component. |
| NavigationItem | Single navigable item with active state. | Display label, icon, active/selected indication. | Label, destination, state, optional badge. | Navigation trigger. | Implemented (workspace item model and rendering in shared/components/workspace/WorkspaceSidebar.tsx; legacy variant in shared/layout/SidebarItem.tsx). | Standardize one item behavior model and deprecate duplicate variants. |
| Breadcrumb | Hierarchical location indicator. | Provide context path and quick parent navigation. | Route hierarchy metadata. | Optional upward navigation. | Planned. | Introduce in planner/video/report deep views. |
| PageTitle | Primary page heading primitive. | Communicate current page purpose and subtitle. | Title, optional subtitle/context. | None. | Implemented (shared/components/PageHeader.tsx and title handling in shared/components/workspace/WorkspaceHeader.tsx). | Consolidate title usage patterns between dashboard and workspace screens. |
| UserMenu | Identity menu with account shortcuts. | Account actions and profile shortcuts. | User identity, menu actions. | Account command events. | Planned. | Integrate with future account/auth module. |
| NotificationBell | Notification entry point. | Show unread status and open notification list. | Notification count and state. | Open notifications panel/list. | Planned. | Integrate with live and competition alerts. |
| LanguageSelector | Locale selection UI. | Change active language. | Available locales, current locale. | Locale update event. | Implemented (inside settings panel in shared/settings/SettingsEntryPoint.tsx). | Optionally expose as standalone header utility when needed. |
| ThemeSelector | Appearance mode selection. | Switch light/dark/system appearance. | Current mode, available appearance modes. | Appearance update event. | Implemented (inside settings panel in shared/settings/SettingsEntryPoint.tsx). | Optionally expose quick toggle in header for power users. |
| SearchBox | Global/local command and content search entry. | Accept query and trigger search behavior. | Query text, scope. | Search request. | Planned. | Align with future command palette and cross-module search. |
| QuickActionButton | High-priority shortcut action button. | Execute top workflows quickly. | Action intent and availability state. | Navigation or workflow launch. | Partial (home quick action cards in features/home/components/QuickActions.tsx and features/planner/components/QuickActions.tsx). | Convert to a shared actionable primitive for consistency. |

---

# 4. Workspace Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| WorkspaceShell | Canonical operational frame for modules. | Arrange header, sidebar, main workspace, optional right panel, optional status bar. | Header slot, sidebar slot, panel slots, optional sizing hints. | Structured layout regions. | Implemented (shared/components/workspace/WorkspaceShell.tsx; used in home/planner/video pages). | Formalize reusable presets for each module type. |
| WorkspaceHeader | Top workspace context and utilities. | Show title/subtitle, slots, settings entry point. | Title/context data, optional slot content. | Header actions and context display. | Implemented (shared/components/workspace/WorkspaceHeader.tsx). | Add breadcrumb/search integration. |
| WorkspaceSidebar | Workspace-local navigation area. | Render local nav items and active state. | Item set, collapsed state, optional header/footer slots. | Item selection events. | Implemented (shared/components/workspace/WorkspaceSidebar.tsx). | Adopt richer navigation metadata and groups. |
| WorkspacePanel | Reusable panel container for workspace sections. | Standard section framing, optional header/actions/footer, scroll strategy. | Title/subtitle/actions/footer/content. | Structured panel region. | Implemented (shared/components/workspace/WorkspacePanel.tsx; used by video workspace). | Expand density variants and panel semantics. |
| WorkspaceStatusBar | Persistent low-noise status row. | Present short status hints and global workflow state. | Left/center/right slots. | Passive status updates. | Implemented (shared/components/workspace/WorkspaceStatusBar.tsx; used in video workspace). | Add standardized status item patterns. |
| SplitView | Multi-panel side-by-side workspace split. | Compose multiple workspace panels in shared viewport. | Panels and split ratios. | Coordinated panel visibility. | Partial (achieved structurally via WorkspaceShell slots; no dedicated standalone split component yet). | Promote to explicit shared primitive if independent split logic grows. |
| ResizablePanel | User-resizable panel region. | Support drag resize and persisted panel dimensions. | Panel content and current size model. | Updated panel size state. | Planned. | Expected for advanced planner/video productivity flows. |
| PanelTabs | Tabbed navigation within a panel. | Toggle multiple panel views in same container. | Tab items, active tab, panel content mappings. | Active tab changes. | Planned. | Useful for technical/coach/validation condensed panels. |

Shared responsibilities for workspace category:
- Keep shell regions stable across features.
- Preserve focus on the central task area.
- Keep secondary context in side or support panels.
- Ensure status communication remains persistent and low-distraction.

---

# 5. Home Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| GreetingCard | Welcome and orientation block on home. | Communicate product identity and immediate context. | Branding text and context copy. | None. | Partial (home hero implemented as features/home/components/HomeHero.tsx). | Normalize into reusable greeting surface. |
| ContinueWorkingCard | Resume last workflow quickly. | Show resumable activity and action to continue. | Recent workspace/session summary. | Resume navigation. | Planned. | Integrate with session manager and context engine. |
| RecentActivityCard | Summarize recent actions. | Display list of recent modules and timestamps. | Recent activity dataset. | Optional navigation to activity item. | Partial (features/home/components/RecentActivity.tsx). | Refactor into reusable card/list component for other modules. |
| QuickActions | Display key module entry shortcuts. | Provide high-frequency action launch points. | Action list and destinations. | Route transitions/workflow launch. | Implemented (features/home/components/QuickActions.tsx). | Consolidate duplicated variant in planner feature quick actions. |
| ProjectsOverview | Overview of user projects/programs. | Aggregate active/archived work summaries. | Project collection summary. | Navigation into selected project. | Planned. | Candidate for dashboard/report convergence. |
| NotificationCard | Home-level important message summary. | Surface relevant warnings/updates at a glance. | Notification data and severity. | Optional navigation or dismiss action. | Planned. | Integrate with future alerts subsystem. |
| DashboardWidget | Reusable modular home dashboard unit. | Render single metric or short list widget in dashboard grid. | Widget content model and state. | Optional action events. | Partial (dashboard cards exist in features/dashboard/components/DashboardCard.tsx). | Create canonical widget contract for home/reports. |
| StatisticCard | Compact metric display component. | Show one key metric and trend/state. | Metric label/value/change state. | Optional detail navigation. | Planned. | Shared use across dashboard, planner summary, and reports. |
| EmptyDashboard | Empty state for new users or no data. | Explain absence of data and provide next steps. | Context and suggested actions. | Launch actions. | Planned. | Required for first-run and filtered-empty contexts. |

---

# 6. Planner Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| TechnicalSheet | Core technical element sheet view. | Display/edit element data, scoring columns, validation context. | Program elements, score context, rule profile context. | Element update actions and summary exports. | Implemented (features/planner/components/workspace/technical-sheet/TechnicalSheet.tsx). | Evolve into structured grid with richer row grouping and comparison tools. |
| PlannerElementCard | Single program element editor/display row or card. | Show element identity, status, score fields, edit controls. | Element data and ordering context. | Update/reorder/remove actions. | Implemented (features/planner/components/workspace/technical-sheet/TechnicalElementCard.tsx). | Converge any duplicate element rendering into one canonical component. |
| ProgramTimeline | Program sequence timeline view. | Show order and timing of planned elements. | Element sequence and timing metadata. | Reorder/select actions. | Planned. | Useful for choreography and pacing planning. |
| ElementCatalogue | Browsable source catalogue for elements. | Present jumps/spins/sequences and add operations. | Rule profile/context and catalog datasets. | Add element actions to planner program. | Implemented (features/planner/components/workspace/WorkspaceLibrary.tsx). | Split into reusable catalog + filter/search subcomponents. |
| GOEBadge | Quick GOE state indicator. | Display GOE grade/value status compactly. | GOE value/grade and severity context. | None. | Partial (GOE displayed inline in technical cards and sheets, no standalone badge component). | Promote to shared data display primitive. |
| ValidationBadge | Compact validity indicator. | Show valid/warning/error with concise label. | Validation state metadata. | None. | Partial (inline status chips present in planner panels). | Extract canonical badge for planner/video/report consistency. |
| RuleViolationCard | Detailed rule issue explanation card. | Present rule warning/error context and guidance. | Validation message and rule metadata. | Optional jump-to-element action. | Partial (validation messages rendered in TechnicalPanel and WorkspaceAssistant). | Build dedicated violation card and list container. |
| DifficultySummary | Aggregate difficulty/technical summary block. | Show totals, TES composition, and element count. | Program elements and score calculations. | None. | Implemented (technical summaries inside TechnicalPanel and WorkspaceAssistant). | Centralize into shared planner summary component. |
| PCSPanel | Program components score editing/display panel. | Manage PCS values and derived totals. | PCS values and scoring engine output. | PCS update events. | Partial (implemented inside TechnicalPanel, not isolated as a standalone component). | Extract as standalone planner subcomponent. |
| ElementEditor | Focused editor for element details. | Edit element name/base/notes/GOE and metadata. | Selected element data. | Update/save/cancel actions. | Partial (editing behavior embedded in TechnicalElementCard). | Extract a dedicated editor for complex editing scenarios. |
| TransferQueuePanel | Planner-side queue intake/status panel for video transfers. | Show incoming technical transfers and status. | Transfer queue state and resolution status. | Accept/reject/apply actions. | Partial (transfer consumption implemented in planner workspace logic, but no explicit panel). | Add visible queue panel for traceability and control. |

---

# 7. Video Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| VideoPlayer | Primary video playback surface. | Load, play, pause, seek, and display video source. | Video source and playback state. | Playback events/time updates. | Implemented (inside features/video/pages/VideoWorkspace.tsx). | Extract into dedicated reusable media primitive. |
| VideoControls | Playback control cluster. | Provide play/pause, seek, speed, volume, fullscreen controls. | Playback state and user input. | Playback command events. | Implemented (inside VideoWorkspace). | Decompose into subcomponents for consistency and testing. |
| Timeline | Time navigation strip for playback and annotations. | Render time scale, zoom, playhead position, and seek interaction. | Duration/current time/zoom state/markers. | Seek and zoom updates. | Implemented (inside VideoWorkspace). | Extract to shared media timeline with optional marker plugins. |
| VideoMarker | Marker indicator on timeline. | Represent point-in-time annotation with type/status. | Marker metadata/time/type/state. | Marker selection event. | Implemented (inside VideoWorkspace marker rendering). | Standardize marker visuals and semantics across video/live. |
| MarkerList | List of markers and metadata. | Browse and select markers quickly. | Marker collection and selection state. | Marker selection and list actions. | Implemented (inside VideoWorkspace). | Split into list + row components. |
| TechnicalCallCard | Technical call editor/display for marker. | Edit code, display name, type, status, notes, GOE. | Selected marker technical call data. | Technical call update events. | Implemented (inside VideoWorkspace selected marker section). | Extract standalone card used by live judging flows. |
| TransferPreview | Preview before sending technical call to planner. | Communicate what transfer will send and current status. | Marker technical call and transfer status. | Transfer command. | Partial (transfer status and trigger exist inline in VideoWorkspace). | Build explicit reusable transfer preview panel. |
| FrameNavigator | Frame-step navigation control. | Step playback by frame approximation and fine seek. | Current time/frame step settings. | Seek step commands. | Implemented (inside VideoWorkspace controls). | Improve with source frame metadata where available. |
| PlaybackToolbar | Consolidated media command strip. | Group playback and timeline quick commands. | Playback and timeline state. | Command events. | Partial (commands exist but are not isolated in a toolbar component). | Extract for reuse in video/live modules. |
| AnalysisSummary | Summary of marker and call outcomes. | Present high-level analysis statistics and status. | Marker dataset and transfer outcomes. | Optional navigation/filter actions. | Partial (status appears in messages and lists, no dedicated summary block). | Add reusable analysis summary card/panel. |

---

# 8. Athlete Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| AthleteCard | Compact athlete overview. | Show athlete identity and key metrics/status. | Athlete identity and summary data. | Navigation to profile. | Planned (athletes route currently placeholder in app/athletes/page.tsx). | Required for athlete list and dashboard modules. |
| AthleteProfile | Full athlete detail surface. | Aggregate athlete details, programs, and performance context. | Athlete profile model and related entities. | Edit/navigation actions. | Future. | Build when athlete module reaches implementation stage. |
| ProgramList | Athlete-linked program list. | List and filter athlete programs. | Program collection for athlete. | Program selection and management actions. | Planned. | Align with planner data entities and future persistence model. |
| VideoList | Athlete-linked video records list. | Browse associated videos and analysis sessions. | Video metadata collection. | Open video analysis action. | Planned. | Connect with video storage and project model. |
| CompetitionHistory | Athlete competition history timeline/table. | Show participation and result progression. | Competition and result history entries. | Drill-down actions. | Future. | Build with competition module completion. |
| CoachCard | Coach identity and relationship card. | Show coach assignment and contact role. | Coach profile summary. | Contact/navigation action. | Future. | Integrate with account/team model. |
| ClubCard | Club affiliation summary card. | Show club identity and association details. | Club profile summary. | Navigation to club context. | Future. | Integrate with organization-level features. |

---

# 9. Competition Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| CompetitionCard | Competition overview tile/card. | Display event name, date, status, and quick actions. | Competition summary data. | Navigation actions. | Planned (live route currently placeholder in app/live/page.tsx). | Entry component for competition module home. |
| CompetitionHeader | Active competition context header. | Show event identity and phase metadata. | Competition context data. | None. | Future. | Align with shared header slots and event status. |
| EntryList | Competition entries list. | Display participants with category/discipline grouping. | Entry dataset. | Selection and management events. | Future. | Build with registration and data model support. |
| RunningOrder | Ordered performance queue. | Present sequence of participants and current status. | Running order data. | Reorder/progress actions. | Future. | Central in live competition operations. |
| JudgePanel | Judge operation panel. | Provide call inputs, status, and contextual controls. | Performance context and judge input state. | Judging action outputs. | Future. | Must align with strict accessibility and low-latency interactions. |
| ResultsTable | Structured competition results display. | Render ranking and score breakdowns. | Final or live result data. | Sorting/export actions. | Planned. | Shared foundation with report tables. |
| RankingCard | Condensed ranking summary block. | Highlight top positions or participant rank. | Ranking snippet data. | Optional drill-down action. | Future. | Complement results table and dashboards. |

---

# 10. Reports Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| ReportCard | Report entry/summary card. | Present report type, scope, and quick action. | Report metadata. | Open report action. | Future. | Used in reports index and dashboard recommendations. |
| ChartCard | Chart container with context and actions. | Host chart visualization with title and controls. | Chart data and configuration metadata. | Filter/interaction events. | Future. | Shared chart wrapper across reports and analytics panels. |
| StatisticsPanel | Multi-metric report panel. | Show key KPIs and trend context. | Statistical summary data. | None or optional drill-down. | Planned (stat-like summaries exist in planner/video but not reports module). | Normalize metric display semantics product-wide. |
| ExportDialog | Report export decision surface. | Select export format/scope and confirm action. | Export options and report scope. | Export request event. | Future. | Reuse across planner and competition exports. |
| ReportFilter | Filter controls for report data slicing. | Manage date, module, athlete, and category filters. | Filter state and available dimensions. | Filter change events. | Future. | Shared filter patterns with data grids and competition lists. |

---

# 11. Forms

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| Button | Primary action trigger. | Execute explicit user action with clear hierarchy. | Label/state/action intent. | Click action. | Implemented (shared/components/Button.tsx). | Expand semantic variants and shared loading/disabled conventions. |
| IconButton | Compact icon-only action control. | Provide quick action with accessible labeling. | Icon, label, action, state. | Click action. | Partial (used repeatedly inline as local buttons in multiple modules). | Extract canonical shared IconButton. |
| Input | Generic single-line text field. | Capture short text values. | Value, label, validation context. | Value change and submit events. | Partial (multiple local inputs exist in planner/video/settings, no shared primitive). | Create shared input foundation. |
| SearchInput | Query-focused input field. | Capture search/filter terms with clear affordances. | Query value and scope. | Query updates. | Planned. | Reuse in navigation/search/report filters. |
| Textarea | Multi-line text input. | Capture notes and long text fields. | Value and validation context. | Value updates. | Partial (used in planner/video local implementations). | Promote to shared primitive with consistent labeling/help state. |
| Checkbox | Binary option control. | Toggle on/off preferences or selections. | Checked state and label. | State change. | Partial (implemented in settings panel locally). | Extract shared checkbox for forms consistency. |
| Radio | Exclusive option selector. | Choose one option in a small set. | Option list and current value. | Value change. | Partial (implemented in settings panel locally). | Extract shared radio group primitive. |
| Select | Option list dropdown selector. | Choose one value from predefined options. | Options, selected value, label. | Value change. | Partial (many local selects in home/planner/video/settings). | Shared select component recommended for consistency. |
| DatePicker | Date selection field. | Select valid date values for filters/forms. | Date value constraints. | Date change. | Planned. | Needed for reports and competition modules. |
| FileUploader | Generic file upload entry. | Validate and load local file content. | File constraints and selected file. | File selection event. | Partial (video local file upload flow exists in VideoWorkspace). | Extract reusable uploader primitive. |
| AvatarUploader | Profile avatar upload field. | Upload and preview account/avatar image. | Avatar file input and current avatar. | Avatar update request. | Future. | Required with account profile module. |
| PasswordInput | Secure password field with visibility toggle. | Capture credential input safely. | Password value and validation messages. | Value change. | Future. | Required with authentication/account security modules. |

---

# 12. Data Display

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| Card | Generic content container with optional interaction affordance. | Group related content in reusable surface. | Content and optional interaction state. | Optional click event. | Implemented (shared/components/Card.tsx). | Add canonical density variants and semantic intent modes. |
| Table | Structured row/column data display. | Render comparable records efficiently. | Column definitions and row data. | Sort/select events. | Planned. | Priority for competition/results/report features. |
| DataGrid | Advanced table with richer interaction. | Support filter/sort/pagination/multi-actions. | Data model and interaction state. | Grid interaction events. | Future. | Needed for high-volume operational datasets. |
| List | Ordered/unordered data listing primitive. | Render sequential or grouped item collections. | Collection and item renderer pattern. | Item select/action events. | Partial (many local list renderings in home/planner/video). | Standardize one shared list foundation. |
| Badge | Compact status or metadata chip. | Communicate small semantic state quickly. | Label and semantic state. | None. | Partial (inline custom badges in planner/workspace/video). | Extract as shared badge primitive. |
| Chip | Compact selectable/removable token. | Show selected filter/tag/token entities. | Label and interaction state. | Select/remove events. | Planned. | Useful in filters and multi-select interactions. |
| Tag | Non-interactive categorical label. | Mark category/type context. | Label and optional semantic role. | None. | Partial (inline equivalents in planner technical cards). | Extract shared tag primitive. |
| Tooltip | Contextual helper overlay. | Explain controls without layout disruption. | Trigger element and helper text. | Show/hide behavior. | Planned. | Needed for dense controls in planner/video/competition. |
| Accordion | Collapsible grouped content sections. | Expand/collapse section groups. | Section headers/content and expansion state. | Section toggle events. | Partial (similar behavior locally in planner library sections). | Extract canonical accordion component. |
| Tabs | Lateral section switching control. | Switch sibling views in same context. | Tab labels, active key, content mapping. | Tab change events. | Planned. | Key for workspace and reports complexity management. |
| Progress | Completion/progression indicator. | Represent operation progression or completion ratio. | Value/range/state. | None. | Planned. | Needed for upload/export/long-running tasks. |
| Skeleton | Loading shape placeholder. | Preserve layout while content is loading. | Placeholder layout variant. | None. | Planned. | Introduce in asynchronous surfaces. |

---

# 13. Feedback

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| Toast | Temporary non-blocking status message. | Inform user of action result quickly. | Severity, message, timeout behavior. | Dismiss/expire events. | Planned. | Shared event feedback layer across modules. |
| Alert | Persistent contextual warning/error/info block. | Communicate notable state requiring awareness. | Severity and message content. | Optional acknowledgment action. | Partial (inline alert-like panels/messages in planner/video/settings). | Promote to shared alert primitive. |
| Banner | High-level page/workspace message bar. | Surface broad contextual notices. | Message, severity, optional action. | Optional action events. | Planned. | Useful for draft-rule warnings and environment notices. |
| InlineError | Field-level validation message. | Explain specific input issue near source field. | Error message and field association. | None. | Partial (local inline errors in planner technical panel and forms). | Standardize shared inline-error rendering. |
| ValidationMessage | Validation-specific structured feedback row. | Show rule validation issue with severity and context. | Validation message metadata. | Optional jump-to-issue action. | Partial (planner validation messages shown in multiple local panels). | Centralize format and interaction in planner and reports. |
| SuccessMessage | Positive confirmation feedback block. | Confirm successful completion or save. | Success message and optional details. | Optional dismiss action. | Partial (local positive states/messages in planner/video). | Standardize shared success format. |
| WarningMessage | Warning-state informational block. | Show caution without hard blocking. | Warning message and context. | Optional acknowledgment. | Partial (local warning states/messages in planner/video). | Shared warning component for consistency and accessibility. |
| LoadingIndicator | Processing indicator for async behavior. | Communicate ongoing background operation. | Activity state and optional label. | None. | Partial (loading state flags exist in video restore flow, no shared UI component). | Extract common loading indicator and busy-state semantics. |

---

# 14. Overlay Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| Dialog | General modal interruption container. | Focus user on an isolated task/decision. | Open state, title/content, actions. | Confirm/cancel/close events. | Partial (settings panel behaves as an overlay dialog-like experience). | Introduce canonical modal dialog for cross-feature reuse. |
| ConfirmationDialog | Explicit destructive/critical decision confirmation. | Prevent accidental destructive operations. | Message and action labels. | Confirm/cancel actions. | Planned. | Needed for delete/reset/clear critical flows. |
| Drawer | Side-panel overlay for secondary workflows. | Present contextual tasks without full navigation. | Open state, side preference, content. | Close/action events. | Partial (settings panel is right-side drawer behavior in shared/settings/SettingsEntryPoint.tsx). | Extract into reusable drawer primitive used by settings and future panels. |
| Popover | Anchored lightweight overlay. | Show contextual actions/details near trigger. | Trigger, content, placement. | Open/close/action events. | Planned. | Useful for compact marker and quick actions. |
| Dropdown | Compact menu of selectable options. | Provide small option lists tied to a trigger. | Options and selected state. | Selection events. | Partial (native selects exist; no custom reusable dropdown component). | Introduce for richer command and filter controls. |
| ContextMenu | Secondary action menu by context target. | Provide right-click/long-press actions. | Context target and menu options. | Selected action event. | Future. | Valuable in dense data and marker workflows. |
| CommandPalette | Keyboard-first command entry surface. | Execute navigation and actions by command search. | Command registry and query input. | Command execution events. | Planned. | Align with future global search and productivity goals. |

---

# 15. Account Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| UserAvatar | Compact user identity visual. | Represent current user identity in compact spaces. | User initials/avatar source. | Optional profile open action. | Planned. | Needed for header account controls. |
| UserProfileCard | Profile summary block. | Show user details and quick account status. | User profile data. | Optional edit/navigation actions. | Future. | Add once account module is active. |
| AccountMenu | Account action dropdown/menu. | Offer sign in/out and profile/security shortcuts. | Account state and available actions. | Action selection events. | Planned. | Pair with UserAvatar in header/menu entry. |
| SignInButton | Entry for authentication start. | Trigger sign-in flow. | Auth availability state. | Start auth action. | Future. | Introduce with auth provider integration. |
| CreateAccountButton | Entry for registration flow. | Trigger account creation flow. | Registration availability state. | Start registration action. | Future. | Introduce with onboarding/auth feature. |
| ProfileEditor | User profile editing surface. | Manage profile attributes and preferences. | User profile model. | Save/update/cancel actions. | Future. | Coordinate with settings and account governance. |
| SecurityPanel | Security and session controls panel. | Manage password/session/security options. | Security settings and policy data. | Update actions and confirmations. | Future. | Required for production account hardening. |

---

# 16. Settings Components

| Component | Purpose | Responsibilities | Inputs | Outputs | Current status | Future evolution |
|---|---|---|---|---|---|---|
| SettingsPanel | Central preference management surface. | Host grouped preference controls and interaction state. | Current settings state and update handlers. | Preference update events. | Implemented (shared/settings/SettingsEntryPoint.tsx). | Split into reusable sub-panels with shared section contracts. |
| AppearanceSelector | Appearance mode setting control. | Select system/light/dark mode. | Current appearance and allowed options. | Appearance change event. | Implemented (within settings panel). | Optional extraction as standalone selector control. |
| LanguageSelector | Locale setting control. | Select UI locale. | Current locale and supported locales. | Locale change event. | Implemented (within settings panel). | Optional header quick access variant if needed. |
| VideoPreferences | Video-specific preferences block. | Manage restore/delete-hint shortcut settings. | Video preference model. | Video preference updates. | Implemented (within settings panel, backed by user settings provider). | Expand with advanced timeline and marker preferences. |
| AccessibilityPanel | User-level accessibility preferences. | Configure motion, contrast, text scaling, and assistance options. | Accessibility preference model. | Accessibility update events. | Planned. | Priority for broader compliance and personalization. |
| NotificationPreferences | Notification behavior settings block. | Control channels, severities, and timing. | Notification settings model. | Settings update events. | Future. | Align with future notification subsystem. |
| PrivacyPanel | Privacy and data controls surface. | Manage data retention and visibility preferences. | Privacy settings and legal metadata. | Save/update events. | Future. | Required for production governance maturity. |
| AboutPanel | Product metadata and legal/about information surface. | Show version, references, and legal links. | Build metadata and static content. | External link actions. | Planned. | Useful in settings and support flows. |

---

# 17. Component Relationships

Canonical containment relationships:

WorkspaceShell
→ WorkspaceHeader
→ WorkspaceSidebar
→ WorkspacePanel (one or many)
→ WorkspaceStatusBar

HomeWorkspace
→ GreetingCard
→ QuickActions
→ RecentActivityCard
→ DashboardWidget

PlannerWorkspace
→ TechnicalSheet
→ PlannerElementCard
→ ElementCatalogue
→ ValidationBadge
→ RuleViolationCard
→ DifficultySummary
→ PCSPanel
→ TransferQueuePanel

VideoWorkspace
→ VideoPlayer
→ VideoControls
→ Timeline
→ VideoMarker
→ MarkerList
→ TechnicalCallCard
→ TransferPreview
→ FrameNavigator

SettingsPanel
→ LanguageSelector
→ AppearanceSelector
→ VideoPreferences
→ AccessibilityPanel
→ NotificationPreferences
→ PrivacyPanel
→ AboutPanel

CompetitionWorkspace
→ CompetitionHeader
→ EntryList
→ RunningOrder
→ JudgePanel
→ ResultsTable
→ RankingCard

ReportsWorkspace
→ ReportFilter
→ StatisticsPanel
→ ChartCard
→ ReportCard
→ ExportDialog

Relationship rules:
- Shared shell components may contain feature components, not the inverse.
- Feature components may compose shared data display and form primitives.
- Overlay components should not own core page navigation responsibilities.

---

# 18. State Guidelines

Expected states by category:

Navigation:
- Default: visible and clear hierarchy.
- Hover: visual affordance for selectable targets.
- Focus: strong keyboard-visible indicator.
- Pressed: immediate command acknowledgment.
- Disabled: explicit non-interactive treatment.
- Loading: avoid blocking navigation when possible.
- Error: show recoverable navigation failure messaging.
- Empty: clear fallback when no navigation items exist.
- Success: optional confirmation only for explicit navigation-side actions.

Workspace:
- Default: stable shell and panel layout.
- Hover: local to interactive controls only.
- Focus: preserve tab order across panel regions.
- Pressed: command confirmation for panel controls.
- Disabled: non-available tools visibly inactive.
- Loading: panel-level loading without shell collapse.
- Error: panel-local error with clear recovery.
- Empty: explicit task-start guidance.
- Success: lightweight status in panel/status bar.

Forms:
- Default: readable labels and current values.
- Hover: optional affordance for pointer users.
- Focus: high-contrast focus treatment.
- Pressed: actionable feedback on controls.
- Disabled: clearly unavailable but legible.
- Loading: submit/progress indication for async operations.
- Error: inline field and form-level messages.
- Empty: placeholder/help guidance where useful.
- Success: confirmation after successful submit/update.

Feedback:
- Default: calm and contextual messaging.
- Hover: interactive feedback only when actionable.
- Focus: keyboard access to dismiss/action controls.
- Pressed: action acknowledgment.
- Disabled: avoid disabled feedback controls unless necessary.
- Loading: in-progress communication with minimal noise.
- Error: prominent, readable, and actionable.
- Empty: absence of alerts should remain unobtrusive.
- Success: concise positive confirmation.

Data Display:
- Default: high readability and scanability.
- Hover: row/item emphasis where interactive.
- Focus: keyboard traceability across rows/cells/items.
- Pressed: clear selection/activation behavior.
- Disabled: de-emphasized and non-actionable rows/items.
- Loading: skeleton/placeholder that preserves structure.
- Error: data retrieval/render failure state.
- Empty: clear no-data guidance with next steps.
- Success: optional status markers for updated data.

Dialogs and Overlays:
- Default: clear title, purpose, and action hierarchy.
- Hover: action affordance on controls.
- Focus: trapped focus and visible active element.
- Pressed: immediate action acknowledgment.
- Disabled: non-available actions must remain understandable.
- Loading: action-level and dialog-level pending states.
- Error: explicit blocking or inline recovery messaging.
- Empty: when applicable, clear explanatory fallback.
- Success: close/transition behavior clearly communicated.

Media, Planner, Video, Competition, Athletes, Reports, Account, Settings, Utility:
- All must support the same base state model above.
- Domain-specific states may be added only when they do not conflict with default state semantics.

---

# 19. Accessibility Requirements

Keyboard:
- Every interactive component must be reachable and operable via keyboard.
- Focus order must follow visual and logical order.
- No keyboard traps outside intentional overlays.

ARIA:
- Use semantic landmarks and roles where needed.
- Interactive controls require clear accessible names.
- Dynamic status updates should use appropriate live-region patterns.

Focus:
- Focus indicator must always be visible and high contrast.
- Focus should return to logical origin after closing overlays.

Contrast:
- Text and controls must meet WCAG contrast requirements.
- Semantic states must remain distinguishable at required contrast levels.

Touch targets:
- Controls must meet comfortable minimum touch size.
- Adjacent interactive areas need sufficient spacing.

Screen readers:
- Structure, labels, and status updates must be understandable without visual context.
- Component state changes must be announced when relevant.

Reduced motion:
- Non-essential motion must respect user reduced-motion preference.
- Motion should never be required to understand state.

---

# 20. Component Governance

Create a new shared component when:
- The pattern appears in two or more features.
- The responsibility is generic and independent from feature domain rules.
- Accessibility and behavior can be standardized across use cases.

Extend an existing shared component when:
- The use case is a variation of existing responsibility.
- New behavior does not break predictability of the component.
- Extension avoids introducing parallel versions of the same concept.

Feature-specific components are acceptable when:
- Behavior is tied to domain logic unique to one feature.
- Shared extraction would create unnecessary abstraction.
- The component may later become shared if reuse appears.

Duplication avoidance process:
- Search existing shared and feature libraries before creation.
- Prefer composition over creating near-identical alternatives.
- Document canonical ownership when similar components exist.
- Plan migration/deprecation when overlap is confirmed.

---

# 21. Version 1.0 Coverage

Required for version 1.0:
- WorkspaceShell
- WorkspaceHeader
- WorkspaceSidebar
- WorkspacePanel
- WorkspaceStatusBar
- NavigationItem
- PageTitle
- Button
- Card
- Input
- Select
- Textarea
- Checkbox
- Radio
- TechnicalSheet
- PlannerElementCard
- ElementCatalogue
- DifficultySummary
- VideoPlayer
- VideoControls
- Timeline
- VideoMarker
- MarkerList
- TechnicalCallCard
- SettingsPanel
- AppearanceSelector
- LanguageSelector
- VideoPreferences
- Alert
- ValidationMessage
- LoadingIndicator

Optional for version 1.0:
- Breadcrumb
- QuickActionButton (as standalone primitive)
- GOEBadge
- ValidationBadge
- RuleViolationCard
- PCSPanel
- TransferPreview
- PlaybackToolbar
- AnalysisSummary
- StatisticsPanel
- EmptyDashboard
- AboutPanel

Future (post 1.0):
- CompetitionHeader
- EntryList
- RunningOrder
- JudgePanel
- ResultsTable
- RankingCard
- AthleteProfile
- CompetitionHistory
- ReportCard
- ChartCard
- ExportDialog
- ReportFilter
- AccountMenu
- UserAvatar
- UserProfileCard
- SecurityPanel
- PrivacyPanel
- NotificationPreferences
- CommandPalette
- DataGrid
- ContextMenu

---

# 22. Review Checklist

Every new component must satisfy all items before acceptance:

- Single responsibility is clear and documented.
- Reusable scope is validated (shared or intentionally feature-specific).
- No duplicated functionality exists in current library.
- Accessibility requirements are satisfied (keyboard, ARIA, focus, contrast).
- Responsive behavior is defined for desktop, tablet, and mobile contexts.
- States are defined: Default, Hover, Focus, Pressed, Disabled, Loading, Error, Empty, Success.
- Component behavior is predictable and consistent with category patterns.
- Internationalization readiness is verified for all user-facing text.
- Theme/appearance compatibility is verified.
- Loading and error handling behavior is documented.
- Relationship to parent/child components is explicit.
- Maturity status is declared: Implemented, Partial, Planned, or Future.
- Usage examples are linked to existing repository modules when implemented.

