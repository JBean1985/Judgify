# Arquitetura do Judgify

## Visão geral

O Judgify é uma aplicação Next.js organizada por funcionalidades para criar, validar e pontuar esquemas de patinagem artística. O fluxo principal começa no assistente da página inicial e segue para o espaço de planeamento. A maioria da lógica e do estado é executada no navegador.

## Tecnologias

- Next.js 16 com App Router.
- React 19 e TypeScript.
- Tailwind CSS.
- `lucide-react` para ícones.
- Fontes de sistema, sem dependência de rede para carregamento tipográfico.

## Rotas

- `/` — página inicial e entrada do assistente.
- `/planner` — construtor de esquemas técnicos.
- `/video` — página placeholder para análise de vídeo.
- `/live` — página placeholder para análise em direto.
- `/athletes` — página placeholder para gestão de atletas.

## Estrutura principal

- `app/` — páginas das rotas, layout e estilos globais.
- `features/home/` — experiência inicial, assistente, ações rápidas, atividade recente e criação do contexto do esquema.
- `features/planner/` — espaço de planeamento, biblioteca, folha técnica, painéis, contextos, motores, dados e regras.
- `features/core/` — `ContextEngine` e tipos do contexto global do esquema.
- `features/dashboard/` — módulos de dashboard existentes, mas não ligados a uma rota.
- `features/workspace/` — componentes atualmente vazios ou inativos.
- `shared/` — componentes e layouts reutilizáveis.
- `core/` — dados e regras de domínio; vários ficheiros continuam vazios ou inativos.
- `types/` — modelos de domínio partilhados.
- `docs/` — documentação complementar, ainda maioritariamente vazia.

## Fluxo da aplicação

1. A página inicial apresenta o assistente e as ações rápidas.
2. O fluxo de criação recolhe atleta, categoria e disciplina e chama `ContextEngine.set()`.
3. A aplicação navega para `/planner`.
4. `PlannerWorkspace` consulta o `ContextEngine`; sem os três campos obrigatórios, apresenta o estado “Nenhum esquema ativo”.
5. Com contexto válido, `WorkspaceProvider` disponibiliza os elementos e as operações do programa à biblioteca, folha técnica e painéis.

## Estado e persistência

### `ContextEngine`

- Singleton global com `get`, `set`, `clear` e `hasContext`.
- Mantém atleta, categoria, disciplina, competição e módulo atual em memória.
- Escreve atualizações na chave `judgify-global-context` do `localStorage` e remove-a ao limpar.
- Não lê atualmente o valor guardado ao iniciar; um recarregamento pode, por isso, perder o contexto necessário para entrar no planeador.

### `WorkspaceContext`

- Contexto React ativo do programa técnico.
- Gere adição, atualização, remoção, reordenação e limpeza de elementos.
- Recupera os elementos da chave `judgify-planner-elements` do `localStorage`.
- Volta a guardar a coleção sempre que os elementos mudam.

`PlannerContext` e `AssistantContext` também existem, mas não estão totalmente integrados no fluxo ativo. Não existe uma camada de backend ou persistência remota confirmada no código atual.

## Motores e regras

- `TechnicalEngine` soma valor base e GOE e calcula `baseValue + goe + pcs - deductions`; PCS e deduções permanecem a zero.
- `DifficultyEngine` calcula totais, médias, contagens por tipo, índice de dificuldade e nível.
- `ValidationEngine` verifica repetições e máximos por categoria através de `ProgramRules`; usa atualmente `free` e `long` como disciplina e tipo de programa fixos.
- `features/planner/rules/` define categorias, disciplinas, tipos de programa e valores GOE de saltos.

## Áreas incompletas e riscos

- O contexto global guardado não é restaurado, embora os elementos do programa tenham persistência local funcional.
- PCS e deduções ainda não estão implementados.
- Disciplina e tipo de programa ainda não são propagados para a validação.
- `PlannerContext` e `AssistantContext` estão apenas parcialmente integrados.
- Dashboard, componentes vazios e entradas de módulos inativas criam caminhos arquiteturais concorrentes.
- Existem tipos sobrepostos entre `types/` e `features/planner/types/`.
- `/video`, `/live` e `/athletes` não têm funcionalidade para além do placeholder.
- Não existe uma suite de testes automatizados configurada.

## Princípios de evolução

- Preservar o fluxo e o design existentes durante refatorações técnicas.
- Consolidar o estado antes de expandir funcionalidades.
- Confirmar regras de negócio antes de completar os motores.
- Reutilizar tipos, contextos e componentes existentes e eliminar duplicação de forma incremental.
- Tratar as páginas placeholder como trabalho futuro.
