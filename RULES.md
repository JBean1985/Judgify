<<<<<<< HEAD

=======
# Judgify Business Rules

## Category Constraints
Rules are defined in `features/planner/rules/categories.ts` and enforced by `ValidationEngine`.

### Benjamins
- `maxElements`: 10
- `maxJumps`: 5
- `maxSpins`: 2
- `maxSequences`: 1
- `allowRepeatedJump`: false
- `programDuration`: 120

### Iniciados
- `maxElements`: 10
- `maxJumps`: 6
- `maxSpins`: 2
- `maxSequences`: 1
- `allowRepeatedJump`: false
- `programDuration`: 150

### Cadetes
- `maxElements`: 11
- `maxJumps`: 6
- `maxSpins`: 3
- `maxSequences`: 1
- `allowRepeatedJump`: false
- `programDuration`: 180

### Juvenis
- `maxElements`: 12
- `maxJumps`: 7
- `maxSpins`: 3
- `maxSequences`: 1
- `allowRepeatedJump`: false
- `programDuration`: 210

### Juniores
- `maxElements`: 12
- `maxJumps`: 7
- `maxSpins`: 3
- `maxSequences`: 1
- `allowRepeatedJump`: true
- `programDuration`: 240

### Seniores
- `maxElements`: 13
- `maxJumps`: 8
- `maxSpins`: 3
- `maxSequences`: 1
- `allowRepeatedJump`: true
- `programDuration`: 270

## Program Validation Rules
Implemented in `features/planner/engine/ValidationEngine.ts`.

- A repeated element is allowed but is flagged as a warning.
- If the number of program elements exceeds `maxElements`, the program is invalid.
- If the number of jumps exceeds `maxJumps`, the program is invalid.
- If the number of spins exceeds `maxSpins`, the program is invalid.
- If the number of sequences exceeds `maxSequences`, the program is invalid.

## GOE Rules for Jumps
Defined in `features/planner/rules/goe/jumps.ts`.

For each jump code, GOE grade maps to a GOE value as follows:
- `-3` through `3` are converted by lookup values.
- Example values:
  - `1A`: `-0.30`, `-0.20`, `-0.10`, `0.00`, `0.10`, `0.20`, `0.30`
  - `2A`: `-0.90`, `-0.60`, `-0.30`, `0.00`, `0.30`, `0.60`, `0.90`
  - `3A`: `-2.10`, `-1.40`, `-0.70`, `0.00`, `0.70`, `1.40`, `2.10`
  - `1Lz`: `-0.18`, `-0.12`, `-0.06`, `0.00`, `0.06`, `0.12`, `0.18`
  - `2Lz`: `-0.63`, `-0.42`, `-0.21`, `0.00`, `0.21`, `0.42`, `0.63`
  - `3Lz`: `-1.77`, `-1.18`, `-0.59`, `0.00`, `0.59`, `1.18`, `1.77`

## Scoring Rules
Implemented in `features/planner/engine/TechnicalEngine.ts`.

- Total technical score is computed as: `baseValue + goe + pcs - deductions`.
- Currently, `pcs` and `deductions` are returned as `0`.

## Difficulty Rules
Implemented in `features/planner/engine/DifficultyEngine.ts`.

- Difficulty analysis groups elements into jumps, spins, and sequences.
- Difficulty index = `totalBaseValue + averageGOE + jumps * 0.5 + spins * 0.25 + sequences * 0.25`.
- Level assignments:
  - `Iniciante` for difficulty below 10
  - `Intermédio` for difficulty from 10 to 19.999...
  - `Avançado` for difficulty from 20 to 29.999...
  - `Elite` for difficulty 30 and above

## Intent Recognition Rules
Implemented in `features/home/assistant/intents.ts` and used by `features/home/assistant/AssistantEngine.ts`.

- Keywords map to modules:
  - Planner: `programa`, `esquema`, `folha técnica`, `criar programa`, `program`
  - Video: `vídeo`, `video`, `analisar`, `gravação`
  - Live: `live`, `competição`, `direto`, `campeonato`
  - Athletes: `atleta`, `patinadora`, `perfil`, `evolução`

## Available Disciplines and Program Types
Defined in planner rule modules.

### Disciplines
- `free` — Livre
- `solo-dance` — Solo Dance
- `pairs` — Pares
- `precision` — Precisão

### Program Types
- `short` — Programa Curto
- `long` — Programa Longo

## Context and Flow Rules
- `ContextEngine` stores active schema properties: `athlete`, `category`, `discipline`, `competition`, and `currentModule`.
- Planner workspace only activates when `athlete`, `category`, and `discipline` are present in context.
- Home assistant uses `ContextEngine.set()` to populate schema context before navigation to `/planner`.
>>>>>>> 034504a (Sprint 1: Foundation and architecture)
