# Prompts do Judgify

## Análise e documentação

- «Revê o repositório atual do Judgify e documenta as rotas, os módulos, o estado e a persistência sem alterar o código da aplicação.»
- «Cria um resumo técnico da arquitetura do Judgify, distinguindo funcionalidades ativas, incompletas e páginas placeholder.»
- «Compara a documentação com o código e identifica afirmações desatualizadas ou contraditórias.»
- «Atualiza o roteiro do Judgify, dando prioridade à estabilização do estado, persistência e pontuação antes de adicionar funcionalidades.»

## Desenvolvimento e refatoração

- «Identifica módulos vazios, inativos ou parcialmente integrados e propõe uma ordem segura para os integrar ou remover.»
- «Propõe uma refatoração segura do `ContextEngine` e dos contextos React, preservando a navegação e os dados guardados.»
- «Consolida tipos de domínio duplicados sem alterar o comportamento público dos componentes e motores.»
- «Completa uma alteração usando os módulos existentes, sem criar regras de negócio não confirmadas.»

## Estado e persistência

- «Confirma no código quais os dados guardados em `localStorage`, quais são restaurados e o que acontece após um recarregamento.»
- «Cria um plano de testes para a persistência de `WorkspaceContext` e para o ciclo de vida do contexto do esquema.»
- «Propõe uma forma de alinhar `ContextEngine`, `WorkspaceContext`, `PlannerContext` e `AssistantContext` sem alterar a interface.»

## Pontuação e validação

- «Descreve as regras implementadas em `TechnicalEngine`, `DifficultyEngine` e `ValidationEngine`, indicando claramente as parcelas ainda incompletas.»
- «Cria testes para o `TechnicalEngine`, incluindo lista vazia, valores GOE, códigos sem regra e total técnico.»
- «Valida o `ValidationEngine` contra os limites definidos em `features/planner/rules/categories.ts`, incluindo máximos e repetições.»
- «Propõe a integração de disciplina e tipo de programa reais na validação, sem inventar regras adicionais.»

## Orientações para agentes de IA

- «Confirma o estado real do código antes de afirmar que uma funcionalidade existe, está ausente ou tem persistência.»
- «Usa português de Portugal na documentação e nos textos destinados ao produto.»
- «Não alteres ficheiros `.ts`, `.tsx` ou `.css` quando a tarefa for exclusivamente documental.»
- «Preserva rotas, comportamento e design, salvo autorização explícita para os alterar.»
- «Não inventes regras de patinagem, pontuação ou validação; limita-te ao código e aos dados confirmados.»
- «No final, indica todos os ficheiros alterados e os comandos de verificação executados.»
