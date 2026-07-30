# RollArt 2026

## Document Information
- Source ID: WS-ROLLART-2026
- Federation: World Skate
- Season: 2026
- Version: ROLLART - Free skating values 2026
- Publication date: Update: July 2025 (document metadata creation date: 2025-07-23)
- Official URL: https://www.worldskate.org/artistic/about/regulations/category/1527-rollart-2026.html?download=7890:rollart-free-skating-values-2026
- PDF page count: 2

## Major Sections
Confirmed major chapter blocks present in this specific official PDF:
- Jumps
- Spins
- Choreo Step Sequence
- Step Sequence

Confirmed structural sub-blocks present inside those chapter blocks:
- Element label column (element name)
- Element code column
- GOE columns (positive and negative grade columns around Base)
- Base column
- Jump-call adjustment columns for under-rotation states (`<`, `<<`) in jump tables
- Combination-adjusted variants (`Combo`, `Combo <`, `Combo <<`) where shown

Not present as standalone chapters in this specific 2-page free-skating values PDF:
- Deductions chapter
- Calls chapter
- Symbols chapter (as a dedicated glossary chapter)
- Bonuses chapter (as a dedicated chapter)
- Scale-of-values narrative chapter
- Technical procedure chapter

Note:
- This file is a compact values table document, not a full narrative regulation book.
- Additional RollArt discipline documents (Dance, Pairs, Precision, Quartet) are listed on the official registry page but are out of scope for this file.

## Element Families
Families present in this PDF:
- Jumps
- Spins
- Step Sequences
- Choreographic Sequences

No base values are extracted in this structure analysis.

## Code System
Observed code-organization structure:
- Family-specific short codes are used per element row.
- Jumps use rotational prefixes with jump-family suffixes (for example, rotation number + jump family code pattern).
- Spins use position-oriented abbreviations.
- Sequence families use sequence-level or sequence-type abbreviations.
- "No element" states are represented with dedicated "N..." style codes in each family.

Organization model:
- Human-readable element name + compact code.
- Code is the primary key for table row identity and downstream scoring lookups.
- Adjusted-call variants are represented as separate structural columns rather than separate code families.

## GOE Structure
GOE table organization in this file:
- Each family table is arranged around a Base column.
- Positive GOE columns are shown on one side of Base.
- Negative GOE columns are shown on the other side of Base.
- Grade direction is symmetric in structure around Base, using positive and negative grade levels.

Relationship with element families:
- GOE is presented per family row (jump, spin, sequence variants).
- Jumps include additional call-adjustment structure (`<`, `<<`) and combination variants.
- Sequences and choreographic sequence entries follow the same table-style grade layout centered on Base.

No numeric GOE values are extracted in this document.

## Dependencies
Chapter-to-module dependency map (structure only):

Jumps / Spins / Sequences tables
-> Element Catalogue
-> Technical Engine
-> Scoring Engine
-> Builder

Code columns
-> Element Catalogue
-> Technical Calling
-> Validation Engine
-> Scoring Engine

GOE column structure
-> Scoring Engine
-> Technical Engine
-> QA/verification tools

Jump adjustment columns (`<`, `<<`) and combo variants
-> Technical Calling
-> Validation Engine
-> Scoring Engine

"No element" code rows
-> Validation Engine
-> Technical Calling
-> Scoring Engine

## Extraction Roadmap
Safest extraction order (without implementing yet):
1. Lock source metadata and file hash/page count for WS-ROLLART-2026 free-skating PDF.
2. Extract family and code skeleton only (no values).
3. Validate code uniqueness and alias collisions across all rows.
4. Extract Base column values in a dedicated sprint with double-entry verification.
5. Extract GOE columns in a separate pass, family by family.
6. Extract jump-adjustment and combo-adjustment columns (`<`, `<<`, combo variants).
7. Run cross-table consistency checks (code coverage, row parity, missing variants).
8. Integrate into pack structures only after source-trace review and build validation.

## Risks
High-risk interpretation areas:
- Dense table layout can shift columns during PDF-to-text extraction.
- Decimal separator style can be locale-sensitive and easy to misparse.
- Similar/near-duplicate codes across families can cause collisions if namespace is not explicit.
- "No element" rows can be mistaken as regular scoring rows if not handled as special states.
- Combo and call-adjustment columns can be misread as separate element families.
- Very short (2-page) format provides minimal narrative context, increasing ambiguity risk.
- Version-sensitive updates can silently change rows/columns between releases.
