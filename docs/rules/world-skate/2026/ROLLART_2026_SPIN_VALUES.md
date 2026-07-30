# RollArt 2026 Spin Base Value Catalogue

Source scope:
- Source ID: WS-ROLLART-FREE-2026
- Document: RollArt Free Skating Values 2026
- PDF page: 1
- Table/section: SPINS

Extraction rule:
- Only BASE values were extracted from the SPINS table.
- GOE/QOE columns and all non-BASE numeric columns were excluded.

## Confirmed Spin Element Rows
| Official code | Official displayed name | Spin family | Position/type | Level | Base Value | Source ID | PDF page | Table/section | Confidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U | Upright Spin | Upright | Upright | not explicit | 0.5 | WS-ROLLART-FREE-2026 | 1 | SPINS | confirmed | PDF text extraction merges label and code as Upright SpinU; code confirmed by code-column alignment. |
| S | Sit Spins | Sit | Sit | not explicit | 0.8 | WS-ROLLART-FREE-2026 | 1 | SPINS | confirmed | Official displayed name is plural in table row. |
| CBD | Camel Spins Backward | Camel | Backward direction | not explicit | 1.0 | WS-ROLLART-FREE-2026 | 1 | SPINS | confirmed | Displayed row is multiline in PDF extraction. |
| CFD | Camel Spin Forward | Camel | Forward direction | not explicit | 1.2 | WS-ROLLART-FREE-2026 | 1 | SPINS | confirmed | Displayed row is multiline in PDF extraction. |
| Br | Broken Spin | Broken | Broken position | not explicit | 1.8 | WS-ROLLART-FREE-2026 | 1 | SPINS | confirmed | Mixed-case code preserved exactly as displayed. |
| HBD | Heel Spin Backward Direction | Heel | Backward direction | not explicit | 2.0 | WS-ROLLART-FREE-2026 | 1 | SPINS | confirmed | Direction text wraps in PDF extraction. |
| HFD | Heel Spin Forward Direction | Heel | Forward direction | not explicit | 2.5 | WS-ROLLART-FREE-2026 | 1 | SPINS | confirmed | Direction text wraps in PDF extraction. |
| In | Inverted Spin | Inverted | Inverted position | not explicit | 2.8 | WS-ROLLART-FREE-2026 | 1 | SPINS | confirmed | PDF text extraction merges label and code as Inverted SpinIn. |

## Non-Element / Modifier Rows
| Row/code | Official displayed name | Classification | Base Value | Source ID | PDF page | Table/section | Confidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NS | No Spin | non-element state row | 0.0 | WS-ROLLART-FREE-2026 | 1 | SPINS | confirmed | Included in official SPINS table but not treated as a spin element row. |
| none | No explicit spin call-modifier rows in this table | modifier audit | n/a | WS-ROLLART-FREE-2026 | 1 | SPINS | confirmed | No dedicated spin modifier symbols or separate call-modifier rows are shown in SPINS table headers/rows. |

## Spin Catalogue Summary
| Metric | Value | Notes |
| --- | --- | --- |
| Spin element rows extracted | 8 | Confirmed element rows only. |
| Non-element rows documented | 1 | NS (No Spin). |
| Explicit spin level codes present in SPINS table | 0 | No level-coded spin rows in this table section. |
| Explicit spin modifier rows present | 0 | None shown as standalone rows. |

## Duplicate and Ambiguity Audit
| Item | Status | Notes |
| --- | --- | --- |
| Duplicate spin codes in SPINS table | none found | All extracted spin element codes are unique. |
| Upright row label+code merge | requires manual check | Extraction view merges Upright Spin and U on one token; code confirmed via column alignment. |
| Inverted row label+code merge | requires manual check | Extraction view merges Inverted Spin and In on one token; code confirmed via column alignment. |
| Camel backward multiline row | requires manual check | Camel Spins and Backward split across lines; interpreted as one displayed row with code CBD. |
| Heel direction multiline rows | requires manual check | Heel labels wrap around code and Direction text; code/name pair confirmed by alignment. |

## Cross-check Against Code Catalogue
Cross-check source:
- docs/rules/world-skate/2026/ROLLART_2026_CODE_CATALOGUE.md

| Check | Result | Notes |
| --- | --- | --- |
| Spin code count parity | pass | 9 total spin-table codes in code catalogue (including NS) vs 8 spin elements + 1 non-element in this file. |
| Element code set parity | pass | U, S, CBD, CFD, Br, HBD, HFD, In all present. |
| Non-element state parity | pass | NS documented as non-element state in both documents. |
| Base value availability for spin elements | pass | All 8 spin elements have readable BASE cells in official table. |

## Extraction Statistics
- Number of spin values extracted: 8
- Manual checks required: 4
- Unreadable cells: 0
- Duplicate codes: 0
- Missing element codes: 0
