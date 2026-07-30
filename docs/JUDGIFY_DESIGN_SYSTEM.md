# Judgify Design System Foundation

## Executive Summary
The Judgify Design System Foundation defines the visual and interaction baseline for a professional judging platform. This document aligns future UI work across modules without changing current runtime behavior, existing screens, or component implementations.

It establishes principles, identity direction, layout guidance, accessibility requirements, and token strategy so future implementation can be consistent, scalable, and auditable.

---

## 1. Purpose
### Goals of the Design System
- Create a consistent visual and interaction language across all Judgify modules.
- Reduce UI drift between teams and features.
- Improve implementation speed by standardizing reusable patterns.
- Support trustworthy decision-making interfaces for judging workflows.
- Provide a durable foundation for future component and token libraries.

### Scope
- Visual foundations (color roles, typography hierarchy, spacing, radius, elevation, iconography, motion).
- Layout standards for the existing workspace shell model.
- Accessibility and responsive behavior requirements.
- State communication patterns (empty, loading, error, notifications).
- Design token organization strategy for future implementation.

Out of scope in this phase:
- Runtime code changes.
- CSS variable definitions.
- Tailwind utility definitions.
- New React components.
- Redesign of currently shipped screens.
- Final numeric color token values.

### Intended Audience
- Product design
- Frontend engineering
- Platform engineering
- QA and accessibility reviewers
- Product and technical leadership

---

## 2. Design Principles
- Clarity: Interfaces must prioritize immediate comprehension of status, context, and required action.
- Consistency: Similar functions must look and behave similarly across all modules.
- Accessibility: Interfaces must be operable and understandable for users with different abilities and assistive technologies.
- Performance: Visual decisions should support fast rendering and avoid unnecessary motion or visual complexity.
- Professionalism: The platform must communicate reliability and technical rigor.
- Calm interface: Visual hierarchy should reduce stress and avoid decorative noise in critical workflows.
- Minimal cognitive load: Screens should present only the information needed for the current decision.

---

## 3. Brand Personality
Judgify should be expressed as:
- Professional
- Technical
- Trustworthy
- Modern
- Clean
- Calm
- Precise

Judgify is a professional judging platform, not a generic sports application. Visual choices must prioritize analytical clarity, traceability, and confidence in decision support over entertainment aesthetics.

---

## 4. Visual Identity
This phase defines color roles only. Exact color values are deferred to implementation planning.

### Color Role Definitions
- Primary brand color: Main action emphasis, active states, and key identity moments.
- Secondary color: Supporting highlights, secondary accents, and non-primary emphasis.
- Success color: Positive outcomes, completed validations, and confirmed states.
- Warning color: Cautionary conditions, draft or provisional states, and recoverable issues.
- Error color: Critical failures, invalid data, and blocking issues.
- Information color: Neutral informational messaging and contextual guidance.
- Neutral palette: Backgrounds, surfaces, borders, text hierarchy, disabled states, and separators.

### Color Usage Rules
- Use semantic meaning consistently across modules.
- Reserve high-contrast emphasis for critical actions and alerts.
- Avoid overusing strong accents in data-dense contexts.
- Keep backgrounds and surface layers calm and legible for prolonged sessions.

---

## 5. Typography
Font-family selection is deferred. This section defines hierarchy and usage behavior.

### Type Roles
- Heading hierarchy:
  - H1: Primary page/module title
  - H2: Section title
  - H3: Subsection title
  - H4: Component-level heading
- Body text:
  - Body Large: Explanatory content
  - Body Regular: Default content
  - Body Small: Secondary support text
- Captions: Metadata, timestamps, auxiliary context.
- Labels: Form labels, panel labels, status descriptors, and compact UI controls.
- Monospace usage: Technical codes, score breakdown fragments, identifiers, and structured references.

### Typography Rules
- Preserve consistent scale progression between heading levels.
- Ensure body text remains highly readable in long workflows.
- Use captions and labels sparingly to avoid visual clutter.
- Use monospace only for data that benefits from fixed-width recognition.

---

## 6. Spacing System
Judgify adopts an 8-point spacing system.

Base unit: 8
Recommended scale: 4, 8, 12, 16, 24, 32, 40, 48, 64

Guidance:
- Use 8-point increments for structural spacing (sections, panels, gutters).
- Use 4-point half steps for dense controls and inline alignment.
- Keep vertical rhythm consistent across headers, content, and footers.

---

## 7. Border Radius
Define a consistent radius scale with semantic tiers:
- None: Hard edges for data grids or strict separators.
- Small: Inputs, tags, compact controls.
- Medium: Buttons, cards, common containers.
- Large: Primary panels and elevated surfaces.
- Extra Large: Large overlays and major modal surfaces.

Use the smallest radius that communicates containment without adding visual softness where precision is required.

---

## 8. Elevation
Define shadow and elevation levels semantically:
- Level 0: Flat surfaces and base canvas.
- Level 1: Standard cards/panels.
- Level 2: Floating controls and dropdowns.
- Level 3: Dialogs and high-priority overlays.
- Level 4: Critical modal states only.

Guidance:
- Prefer subtle elevation transitions.
- Avoid deep shadows in dense analytical views.
- Use elevation to indicate interaction hierarchy, not decoration.

---

## 9. Icons
Adopt one consistent icon library across product surfaces.

Recommendation: Lucide icon set (already aligned with current codebase usage).

Rules:
- Maintain consistent stroke style and optical size.
- Pair icons with text labels in critical actions.
- Do not mix multiple icon families in the same product area.

---

## 10. Motion
Motion principles only (no implementation values in this phase):
- Purposeful: Every animation must communicate state or relationship.
- Subtle: Avoid distracting movement in technical workflows.
- Fast and calm: Prefer short transitions that do not delay decisions.
- Consistent: Reuse the same motion language for similar interactions.
- Accessible: Respect reduced-motion preferences.

---

## 11. Layout
Layout guidance must align with the existing WorkspaceShell architecture.

Reference architecture elements:
- Header
- Sidebar
- Workspace (main content)
- Panels (left/right and internal sections)
- Status bar
- Dialogs

### Layout Responsibilities
- Header: Global context, module title, utility actions (including settings entry).
- Sidebar: Navigation and module switching context.
- Workspace: Primary task area with highest content priority.
- Panels: Secondary context, inspectors, technical details, and side workflows.
- Status bar: Persistent lightweight status and hints.
- Dialogs: Focused interruption for confirmation, settings, and critical workflows.

Guidance:
- Keep shell regions structurally stable across modules.
- Keep cognitive focus inside the workspace region.
- Use panel hierarchy to avoid overloading primary workspace views.

---

## 12. Responsive Behaviour
No redesign is introduced; behavior adapts existing layouts.

### Desktop
- Full workspace shell with persistent header and status bar.
- Sidebar and optional right panel available when relevant.
- Multi-panel productivity layout is primary mode.

### Tablet
- Preserve workspace structure with tighter spacing and controlled panel behavior.
- Secondary panels may collapse or switch to contextual reveal patterns.
- Maintain clear action hierarchy and touch-friendly controls.

### Mobile
- Preserve functional parity for key workflows where feasible.
- Stack workspace regions with clear priority order.
- Keep header and key actions discoverable.
- Reduce simultaneous panel density while preserving context access.

---

## 13. Component Categories
Future component inventory should be organized by category.

- Navigation: App navigation, module nav, breadcrumbs, tabs, segmented controls.
- Forms: Inputs, selects, toggles, sliders, field groups, validation helpers.
- Data Display: Tables, lists, badges, key-value blocks, technical rows.
- Feedback: Alerts, inline status, banners, progress indicators.
- Overlay: Dialogs, drawers, popovers, context menus, tooltips.
- Media: Video canvas controls, timeline primitives, marker indicators.
- Planner: Element cards, technical sheets, rule notices, score panels.
- Video: Marker editor, technical call editor, transfer status widgets.
- Charts: Score trends, comparison charts, distribution views.

---

## 14. Accessibility
### Keyboard Navigation
- All interactive controls must be reachable and operable via keyboard.
- Focus order must follow visual and logical reading order.

### Focus Visibility
- Focus indicator must be clear, persistent, and high-contrast.
- Focus style must be consistent across all modules.

### Contrast
- Text and controls must meet WCAG contrast requirements for intended size and weight.
- Semantic states (success, warning, error, info) must remain distinguishable under contrast constraints.

### Reduced Motion
- Honor user reduced-motion preference in all non-essential animations.

### Screen Readers
- Use semantic landmarks and accurate ARIA naming.
- Dynamic status updates should use appropriate live region behavior.

### Touch Targets
- Interactive touch targets must meet minimum comfortable size.
- Maintain sufficient spacing between adjacent touch controls.

---

## 15. Empty States
Empty states should:
- Explain why content is empty.
- Provide the next meaningful action.
- Preserve context of the current module.
- Avoid decorative illustrations that reduce professional tone.

---

## 16. Loading States
Loading states should:
- Communicate what is loading.
- Use non-blocking indicators where possible.
- Preserve layout stability to avoid content shift.
- Provide graceful fallback for slower devices.

---

## 17. Error States
Error states should:
- Clearly describe what failed.
- Separate blocking errors from recoverable issues.
- Offer concrete recovery actions.
- Preserve unsaved user context when possible.

---

## 18. Notification Patterns
Notification guidance:
- Use inline notifications for local, contextual feedback.
- Use persistent banners for important cross-section conditions.
- Use transient toasts only for low-risk confirmations.
- Ensure notification priority does not obscure critical workflow controls.

---

## 19. Design Tokens Strategy
Token implementation is deferred; this section defines organization strategy.

### Token Families
- Color tokens: semantic roles + surface/text/border levels.
- Typography tokens: roles for heading/body/caption/label/monospace.
- Spacing tokens: 8-point scale aliases.
- Radius tokens: semantic curvature tiers.
- Elevation tokens: shadow/layer levels.
- Motion tokens: duration/easing/transition roles.
- Size tokens: control heights, icon sizes, touch targets.
- Z-index tokens: overlay and shell layer ordering.

### Naming Strategy
- Prefer semantic names over raw numeric intent in product-facing tokens.
- Keep global foundation tokens separate from component-level alias tokens.
- Maintain strict one-way mapping: foundation -> semantic -> component.

### Governance
- Token changes require design and engineering review.
- Tokens must be versioned and documented with migration notes.
- Deprecated tokens should include replacement guidance.

---

## 20. Future Evolution
### Version 1.0
Includes:
- This foundation specification
- Approved semantic token model and naming conventions
- Core layout behavior rules for the workspace shell
- Accessibility baseline requirements
- Initial component taxonomy and state patterns

### Future
Planned expansions:
- Finalized token values and theme sets
- Component-level specifications and interaction contracts
- Cross-module visual audits and conformance checks
- Advanced data-visualization patterns
- Internationalization-aware content density and typography refinements

---

## Final Checklist: Foundation Completion Criteria
The Design System Foundation can be considered complete when all items below are true:

- Executive summary approved by product and design leadership.
- Purpose, scope, and audience are explicitly aligned.
- Design principles are approved and referenced in planning.
- Brand personality is documented and adopted as review criteria.
- Color roles are defined semantically without final implementation values.
- Typography hierarchy and usage roles are approved.
- Spacing, radius, and elevation scales are documented.
- Icon library decision is confirmed.
- Motion principles are documented with accessibility intent.
- Layout rules align with existing workspace shell architecture.
- Responsive behavior expectations are documented for desktop, tablet, and mobile.
- Component categories are defined for future library planning.
- Accessibility requirements are documented and testable.
- Empty/loading/error/notification patterns are documented.
- Token strategy and governance are defined.
- Version 1.0 vs Future scope is clearly separated.
- No runtime code, component code, CSS variable implementation, or Tailwind implementation was introduced in this phase.
