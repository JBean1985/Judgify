# Regras de negócio do Judgify

Este documento descreve o comportamento atualmente implementado. Os limites de categoria estão em `features/planner/rules/categories.ts`; a sua aplicação está em `features/planner/engine/ValidationEngine.ts`.

## Limites por categoria

| Categoria | Elementos | Saltos | Piruetas | Sequências | Salto repetido | Duração (s) |
| --- | ---: | ---: | ---: | ---: | :---: | ---: |
| Benjamins | 10 | 5 | 2 | 1 | Não | 120 |
| Iniciados | 10 | 6 | 2 | 1 | Não | 150 |
| Cadetes | 11 | 6 | 3 | 1 | Não | 180 |
| Juvenis | 12 | 7 | 3 | 1 | Não | 210 |
| Juniores | 12 | 7 | 3 | 1 | Sim | 240 |
| Seniores | 13 | 8 | 3 | 1 | Sim | 270 |

A propriedade `allowRepeatedJump` faz parte das definições de categoria, mas o `ValidationEngine` ainda não a consulta. Atualmente, qualquer código de elemento repetido produz um aviso e não torna, por si só, o programa inválido.

## Validação do programa

- A categoria predefinida de `ValidationEngine.validate()` é `Juvenis`.
- `ProgramRules` procura a categoria pelo nome, sem distinguir maiúsculas de minúsculas.
- A validação usa atualmente a disciplina `free` e o tipo de programa `long` como valores fixos.
- Se a categoria não for encontrada, são usados os limites de segurança: 10 elementos, 7 saltos, 3 piruetas e 1 sequência.
- Exceder qualquer máximo produz um erro e torna o programa inválido.
- Repetir um código de elemento produz um aviso.
- Um programa é considerado válido quando não existem mensagens do tipo `error`.

## GOE de saltos

A tabela em `features/planner/rules/goe/jumps.ts` associa, para cada código disponível, graus de `-3` a `3` a valores GOE. Exemplos:

- `1A`: `-0.30`, `-0.20`, `-0.10`, `0.00`, `0.10`, `0.20`, `0.30`.
- `2A`: `-0.90`, `-0.60`, `-0.30`, `0.00`, `0.30`, `0.60`, `0.90`.
- `3A`: `-2.10`, `-1.40`, `-0.70`, `0.00`, `0.70`, `1.40`, `2.10`.
- `1Lz`: `-0.18`, `-0.12`, `-0.06`, `0.00`, `0.06`, `0.12`, `0.18`.
- `2Lz`: `-0.63`, `-0.42`, `-0.21`, `0.00`, `0.21`, `0.42`, `0.63`.
- `3Lz`: `-1.77`, `-1.18`, `-0.59`, `0.00`, `0.59`, `1.18`, `1.77`.

`TechnicalEngine.getGoeValue()` devolve o grau recebido quando não encontra uma regra para o código e devolve zero quando a regra existe, mas não contém o grau pedido.

## Pontuação técnica

O `TechnicalEngine`:

- soma o `baseValue` de todos os elementos;
- soma o `goeValue` de todos os elementos;
- calcula `total = baseValue + goe + pcs - deductions`;
- devolve atualmente `pcs = 0` e `deductions = 0`.

PCS e deduções são, portanto, parcelas previstas mas ainda não implementadas.

## Dificuldade

O `DifficultyEngine` agrupa os elementos de acordo com `category`: `jump`, `spin` e `sequence`.

O índice é calculado por:

`totalBaseValue + averageGOE + jumps × 0,5 + spins × 0,25 + sequences × 0,25`

Os níveis são:

- `Iniciante` — índice inferior a 10;
- `Intermédio` — índice maior ou igual a 10 e inferior a 20;
- `Avançado` — índice maior ou igual a 20 e inferior a 30;
- `Elite` — índice maior ou igual a 30.

Numa lista vazia, os totais, as médias, as contagens e o índice são zero.

## Reconhecimento de intenções

As palavras-chave estão em `features/home/assistant/intents.ts` e são usadas por `AssistantEngine`:

- Planeador: `programa`, `esquema`, `folha técnica`, `criar programa`, `program`.
- Vídeo: `vídeo`, `video`, `analisar`, `gravação`.
- Direto: `live`, `competição`, `direto`, `campeonato`.
- Atletas: `atleta`, `patinadora`, `perfil`, `evolução`.

## Disciplinas e tipos de programa

Disciplinas definidas:

- `free` — Livre;
- `solo-dance` — Solo Dance;
- `pairs` — Pares;
- `precision` — Precisão.

Tipos de programa definidos:

- `short` — Programa Curto;
- `long` — Programa Longo.

Estas definições são transportadas por `ProgramRules`, mas ainda não alteram os limites devolvidos: os limites implementados vêm da categoria.

## Contexto e fluxo

- `ContextEngine` pode manter `athlete`, `category`, `discipline`, `competition` e `currentModule`.
- O planeador só ativa o espaço de trabalho quando atleta, categoria e disciplina estão presentes no contexto em memória.
- O fluxo inicial usa `ContextEngine.set()` antes de navegar para `/planner`.
- O `ContextEngine` escreve o contexto em `localStorage`, mas não o restaura atualmente ao iniciar.
- O `WorkspaceContext` restaura e guarda separadamente os elementos do programa em `localStorage`.
