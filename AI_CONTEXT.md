# Judgify — Contexto para IA

## Objetivo

O Judgify é uma aplicação web em Next.js e React para apoiar treinadores, atletas e juízes na criação, organização, validação e pontuação de esquemas de patinagem artística. A experiência principal liga um assistente na página inicial a um espaço de planeamento técnico.

A aplicação deve manter-se simples, rápida e intuitiva. A interface e os textos apresentados ao utilizador devem usar português de Portugal.

## Ambiente de desenvolvimento

O desenvolvimento é feito pelo Codex Cloud no navegador, ligado diretamente ao GitHub. Não se assume uma instalação local como fluxo de trabalho atual.

## Tecnologia e organização

- Next.js 16 com App Router.
- React 19 e TypeScript.
- Tailwind CSS para estilos e `lucide-react` para ícones.
- `app/` contém as entradas das rotas, o layout global e os estilos globais.
- `features/home/` contém a experiência inicial, o assistente, as ações rápidas e a atividade recente.
- `features/planner/` contém o espaço de planeamento, biblioteca de elementos, folha técnica, contextos, regras e motores.
- `features/core/` contém o `ContextEngine`, usado para transportar o contexto do esquema entre o início e o planeador.
- `shared/` contém componentes e elementos de layout reutilizáveis.
- `core/` e `types/` contêm dados, regras e tipos de domínio partilhados; existem ainda tipos sobrepostos em `features/planner/types/`.
- `docs/` contém documentação complementar, ainda maioritariamente por preencher.

## Rotas atuais

### Funcionais

- `/` — página inicial com experiência de boas-vindas, assistente, ações rápidas e atividade recente.
- `/planner` — construtor de esquemas com biblioteca de elementos, folha técnica, painéis técnico e de treinador e suporte responsivo. Só apresenta o espaço de trabalho quando existem atleta, categoria e disciplina no `ContextEngine`.

### Páginas placeholder

- `/video` — apresenta apenas a indicação de que a análise de vídeo está em desenvolvimento.
- `/live` — apresenta apenas a indicação de que a análise em direto está em desenvolvimento.
- `/athletes` — apresenta apenas a indicação de que a gestão de atletas está em desenvolvimento.

## Funcionalidades concluídas

- Experiência inicial com entrada orientada por assistente e reconhecimento simples de intenções por palavras-chave.
- Criação do contexto base de um esquema com atleta, categoria e disciplina antes da navegação para o planeador.
- Espaço de planeamento com elementos de saltos, piruetas e sequências.
- Operações para adicionar, editar, remover, reordenar e limpar elementos do esquema.
- Persistência local dos elementos do planeador em `localStorage`, através da chave `judgify-planner-elements`; o `WorkspaceContext` recupera os elementos guardados ao iniciar e volta a guardá-los quando são alterados.
- Cálculo do valor base, GOE e total técnico disponível no `TechnicalEngine`.
- Análise de dificuldade disponível no `DifficultyEngine`, incluindo totais, médias, contagem por tipo, índice de dificuldade e nível.
- Validação de limites de elementos, saltos, piruetas e sequências, com avisos para elementos repetidos.
- Definições de categorias, disciplinas, tipos de programa e tabela de GOE para saltos.

## Funcionalidades incompletas ou parcialmente integradas

- O `TechnicalEngine` mantém PCS e deduções com valor fixo de zero; estas parcelas da pontuação ainda não estão implementadas.
- O `ValidationEngine` aceita a categoria, mas usa atualmente disciplina `free` e tipo de programa `long` como valores fixos.
- O `ContextEngine` mantém o contexto ativo num singleton em memória e escreve-o em `localStorage` com a chave `judgify-global-context`, mas não recupera atualmente esse valor guardado. Por isso, o contexto necessário para abrir o planeador pode perder-se após um recarregamento, mesmo que os elementos do esquema estejam persistidos pelo `WorkspaceContext`.
- `PlannerContext` e `AssistantContext` existem, mas não estão totalmente integrados no fluxo ativo do planeador.
- Os módulos em `features/dashboard/` não estão ligados a nenhuma rota.
- `features/planner/index.ts`, `features/planner/plannerData.ts`, vários ficheiros em `core/` e vários componentes de `features/workspace/` estão vazios ou inativos.
- Não existe no estado atual uma camada de serviço ou backend para sincronização remota, autenticação ou armazenamento de programas no servidor.
- A documentação em `docs/` e o `README.md` ainda não descrevem integralmente a arquitetura e o funcionamento do produto.
- Não existem testes automatizados configurados no `package.json`.

## Estado e persistência

- `ContextEngine` é um singleton global com as operações `get`, `set`, `clear` e `hasContext`. Guarda atleta, categoria, disciplina, competição e módulo atual; a escrita e remoção em `localStorage` estão implementadas, mas a leitura inicial não está ligada.
- `WorkspaceContext` é o estado React ativo do programa técnico. Gere a coleção de elementos e fornece operações de adição, atualização, remoção, reordenação e limpeza.
- Os elementos do programa têm persistência local funcional no navegador. Esta persistência é distinta do contexto do esquema gerido pelo `ContextEngine`.
- Não há confirmação no código atual de persistência remota ou de gravação de programas completos num backend.

## Motores técnicos

### `TechnicalEngine`

- Soma os valores base e os valores GOE dos elementos.
- Consulta a tabela de GOE de saltos quando é solicitado um valor por código e grau.
- Calcula o total como `valor base + GOE + PCS - deduções`.
- PCS e deduções continuam por implementar e são atualmente zero.

### `DifficultyEngine`

- Agrupa elementos em saltos, piruetas e sequências.
- Calcula valor base total e médio, GOE médio e índice de dificuldade.
- Classifica o resultado como `Iniciante`, `Intermédio`, `Avançado` ou `Elite`.

### `ValidationEngine`

- Obtém limites através de `ProgramRules` e das regras de categoria.
- Produz erros quando são excedidos os máximos de elementos ou de cada tipo.
- Produz avisos para códigos de elementos repetidos.
- Considera o programa válido quando não existem mensagens de erro.

## Prioridades de desenvolvimento seguro

1. Restaurar de forma segura o contexto guardado ou consolidar o fluxo no contexto React, sem quebrar a navegação atual.
2. Alinhar `ContextEngine`, `WorkspaceContext`, `PlannerContext` e `AssistantContext` para evitar estados divergentes.
3. Completar PCS e deduções no motor técnico com regras de negócio confirmadas.
4. Passar disciplina e tipo de programa reais ao motor de validação.
5. Consolidar tipos duplicados e decidir se os módulos vazios devem ser implementados ou removidos.
6. Adicionar testes para motores, persistência, contextos e fluxos entre rotas.
7. Desenvolver as páginas placeholder apenas quando os respetivos requisitos estiverem definidos.

## Regras para alterações futuras

- Não quebrar funcionalidades existentes.
- Manter o design e os textos visíveis, salvo indicação explícita em contrário.
- Usar português de Portugal na interface e na documentação destinada ao produto.
- Confirmar sempre o estado real do código antes de descrever uma funcionalidade como concluída, ausente ou persistente.
- Não inventar regras de patinagem, pontuação ou validação; usar apenas regras confirmadas no código ou fornecidas pelo responsável do projeto.
- Preferir TypeScript e reutilizar os contextos, tipos, componentes e regras existentes.
- Explicar claramente todos os ficheiros alterados e as verificações executadas.
- Tratar `/video`, `/live` e `/athletes` como trabalho futuro, não como funcionalidades ativas.
