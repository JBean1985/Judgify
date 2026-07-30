# JUDGIFY Official Rule Sources

This document is the mandatory source registry for official rule packs. It must be completed before any official FPP or World Skate rule values are populated in code.

It complements the implementation roadmap in [JUDGIFY_RULES_ROADMAP.md](JUDGIFY_RULES_ROADMAP.md) and the official pack schema in [features/planner/rules/packs/types.ts](features/planner/rules/packs/types.ts).

## 1. Source Policy

Only official FPP or World Skate documents may be used for official rule packs.

Rules for inclusion:
- Every implemented rule must be traceable to an official document.
- Each rule reference must include:
  - document title,
  - version or date,
  - section or page,
  - effective date when known.
- Secondary websites, social media posts, forum posts, and unofficial summaries must not be treated as authoritative.
- If a source is missing, ambiguous, outdated, or conflicting, the rule must remain draft, disabled, or unimplemented.
- Never infer official numeric values from memory, general knowledge, or unofficial examples.

## 2. Required World Skate 2026 Sources

Checklist placeholders for official World Skate 2026 source confirmation:

- [x] General regulations
- [x] Free skating rules
- [ ] Solo dance rules
- [ ] Pairs rules
- [ ] Precision rules
- [x] Scale of Values / element base values
- [x] GOE tables
- [ ] PCS rules
- [ ] Deductions
- [x] Required elements
- [x] Program duration and composition rules

## 3. Required FPP 2026 Sources

Checklist placeholders for official FPP 2026 source confirmation:

- [x] Regulamento Geral da Patinagem Artística
- [ ] Guia Normativo de Acesso às Provas Nacionais 2026
- [ ] National category definitions
- [ ] National program requirements
- [ ] National exceptions to World Skate rules
- [ ] Competition circulars / technical communications
- [ ] Official updates and errata

## 4. Source Registry Table

Complete one row for every source used by an official pack.

| Source ID | Federation | Season | Discipline | Document title | Version/date | Official URL | Local file/path | Sections covered | Verified | Verified by | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WS-ART-TECH-2026 | world-skate | 2026 | general | Artistic Technical Rules 2026 | 2026 | https://www.worldskate.org/artistic/about/regulations/category/1526-artistic-technical-rules-2026.html |  | General index for 2026 artistic technical regulations | yes | official registry | Verified official World Skate source. |
| WS-FREE-2026 | world-skate | 2026 | free | FREE SKATING RULES FOR ARTISTIC SKATING | July 2025 / 2026 season | https://www.worldskate.org/artistic/about/regulations/category/1526-artistic-technical-rules-2026.html?download=7880%3Afree-2026 |  | Free skating; program composition; technical requirements; required elements; program rules | yes | official registry | Verified official World Skate source. Individual free skating values still need exact document registration in the registry. |
| WS-ROLLART-2026 | world-skate | 2026 | general | RollArt 2026 | 2026 | https://www.worldskate.org/artistic/about/regulations/category/1527-rollart-2026.html |  | Free skating values 2026; GOE / element values; other discipline values | yes | official registry | Verified official World Skate source. Individual Free Skating values document still needs exact document registration. |
| FPP-RGPA-INDEX | fpp | 2025+ | general | Estatutos e Regulamentos | April 2025 | https://fpp.pt/estatutos-regulamentos/ |  | Regulamento Geral da Patinagem Artística index; current listed version | yes | official registry | Verified official FPP source. May remain relevant in 2026 until replaced, but do not assume this without confirmation. |
| FPP-RGPA-2025 | fpp | 2025 | general | Regulamento Geral da Patinagem Artística 2025 | April 2025 | https://fpp.pt/wp-content/uploads/Regulamento-Geral-da-Patinagem-Arti%CC%81stica-2025.pdf |  | General national artistic skating regulation | yes | official registry | Verified official FPP document. Do not classify as FPP 2026-specific without confirmation. |
| FPP-GUIA-NACIONAL-2026-PENDING | fpp | 2026 | general | Guia Normativo de Acesso às Provas Nacionais 2026 | pending | https://fpp.pt/formacao-continua-guia-normativo-de-acesso-as-provas-nacionais-2026/ |  | Confirms existence and update of the 2026 guide | pending | official registry | Official FPP reference. Full official guide document URL still missing. Marked as source pending/document not yet obtained. |

Guidance for each field:
- Source ID: Stable registry identifier, for example `FPP-2026-RG-001`.
- Federation: `fpp` or `world-skate`.
- Season: For example `2026`.
- Discipline: `free`, `solo-dance`, `pairs`, `precision`, or `general`.
- Verified: `yes` only after manual confirmation against the official document; use `pending` when the reference exists but the official document is not yet registered.
- Verified by: Name or team that confirmed the source.
- Notes: Include source quality, ambiguity notes, or implementation constraints.

## 5. Rule Traceability Format

Every future rule in a pack should reference its source using a consistent traceability object.

Recommended rule traceability fields:
- `sourceId`
- `section`
- `page`
- `effectiveDate`
- `notes`

Example format:

```ts
{
  sourceId: "WS-2026-GEN-001",
  section: "Article 4.2",
  page: "12",
  effectiveDate: "2026-01-01",
  notes: "Applies to senior free skating programs."
}
```

Traceability rules:
- Every official value must be linked to at least one source entry.
- If a value is derived from multiple documents, list all relevant source IDs.
- If a rule is still draft, the traceability object must remain empty or explicitly marked as source-needed.

## 6. Missing-Source Policy

- If a source is missing or unclear, the corresponding rule must remain disabled or draft.
- Never infer official numeric values.
- Do not copy values from unofficial summaries or secondary websites.
- If a rule cannot be validated against an official source, keep it out of the active pack.

## 7. FPP 2026 Pack Readiness Checklist

Before the FPP 2026 pack can become active, all mandatory sections must be source-confirmed.

- [ ] Categories confirmed
- [ ] Limits confirmed
- [ ] Required elements confirmed
- [ ] Repetition rules confirmed
- [ ] Base values confirmed
- [ ] GOE confirmed
- [ ] PCS confirmed
- [ ] Deductions confirmed
- [ ] Sources reviewed
- [ ] All mandatory sections source-confirmed
- [ ] Pack may only become active after final reviewer signoff

## 8. Relationship to the Draft Pack

The current FPP 2026 pack stub in [features/planner/rules/packs/fpp/2026/index.ts](features/planner/rules/packs/fpp/2026/index.ts) must remain placeholder-only until the registry above is complete.

Required principle:
- Draft pack sections stay empty or TODO-only.
- No official value may be committed before source confirmation.
- The pack may not become active until the required checklist is complete.

## 9. Review Rule

Any future change that populates official values must be reviewed together with:
- the source registry table,
- the traceability fields,
- the FPP 2026 pack readiness checklist.

If any required source is not verified, the corresponding pack section must remain draft.
