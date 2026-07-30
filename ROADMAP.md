# Roteiro do Judgify

## Concluído

- Aplicação base em Next.js 16, React 19, TypeScript e Tailwind CSS.
- Página inicial com assistente, ações rápidas e atividade recente.
- Fluxo de recolha de atleta, categoria e disciplina antes da abertura do planeador.
- Rota `/planner` com biblioteca de elementos, folha técnica, painel técnico, painel de treinador e experiência responsiva.
- Operações de adição, edição, remoção, reordenação e limpeza de elementos.
- Persistência local dos elementos do planeador através do `WorkspaceContext` e de `localStorage`.
- Motores `TechnicalEngine`, `DifficultyEngine` e `ValidationEngine` em funcionamento para as parcelas já implementadas.
- Regras de categorias, disciplinas, tipos de programa e GOE de saltos.
- Componentes e layouts reutilizáveis em `shared/`.
- Rotas placeholder criadas para `/video`, `/live` e `/athletes`.
- Remoção da dependência de rede para carregar fontes durante o build.

## Em curso ou incompleto

- Restauro do contexto de esquema guardado pelo `ContextEngine` após recarregamento.
- Integração consistente entre `ContextEngine`, `WorkspaceContext`, `PlannerContext` e `AssistantContext`.
- Cálculo de PCS e deduções no `TechnicalEngine`.
- Utilização da disciplina e do tipo de programa reais pelo `ValidationEngine`.
- Decisão sobre integração ou remoção dos módulos de dashboard e dos ficheiros vazios ou inativos.
- Consolidação dos tipos sobrepostos entre `types/` e `features/planner/types/`.
- Documentação detalhada em `README.md` e `docs/`.
- Testes automatizados para motores, contextos, persistência e rotas.

## Próximas etapas

### Curto prazo — estabilização

1. Restaurar de forma segura o contexto local ou transferir a responsabilidade para um contexto React único.
2. Garantir que o contexto do esquema e os elementos persistidos permanecem coerentes após navegação e recarregamento.
3. Integrar ou retirar os contextos redundantes sem alterar o comportamento visível.
4. Adicionar testes unitários aos motores e testes do ciclo de persistência.
5. Atualizar o `README.md` e preencher a documentação técnica em `docs/`.

### Médio prazo — regras e produto

1. Implementar PCS e deduções com regras de negócio confirmadas.
2. Propagar categoria, disciplina e tipo de programa reais para cálculo e validação.
3. Consolidar tipos e dados de domínio duplicados.
4. Definir requisitos antes de desenvolver `/video`, `/live` e `/athletes`.
5. Decidir se o dashboard deve ser exposto por uma rota ou removido.

### Longo prazo — plataforma

1. Criar uma camada de backend para autenticação, sincronização e persistência remota.
2. Permitir guardar, carregar, exportar e associar programas a atletas.
3. Expandir o assistente para além do reconhecimento por palavras-chave.
4. Desenvolver análise de vídeo e apoio em direto quando os requisitos estiverem validados.

## Limites do roteiro

- Não inventar regras de patinagem ou pontuação.
- Não apresentar páginas placeholder como funcionalidades concluídas.
- Não substituir funcionalidades estáveis durante trabalhos de documentação ou refatoração.
- Manter as alterações alinhadas com os módulos e as rotas que existem no repositório.
