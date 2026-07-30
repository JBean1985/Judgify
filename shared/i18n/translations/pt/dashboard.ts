import type { DashboardTranslations } from "../../types";

export const ptDashboard: DashboardTranslations = {
  header: {
    searchPlaceholder: "Pesquisar projetos, atletas, vídeos, competições...",
    notificationsPlaceholder: "Notificações (placeholder)",
    userAvatarPlaceholder: "Avatar do utilizador (placeholder)",
    greeting: {
      morning: "Bom dia",
      afternoon: "Boa tarde",
      evening: "Boa noite",
    },
    greetingWithName: "{{greeting}}, {{name}}",
    fallbackUserName: "Treinador",
  },
  statusBar: {
    version: "Dashboard V1",
    mockDataMode: "Modo de dados simulados",
    allSystemsOperational: "Todos os sistemas operacionais",
  },
  modules: {
    planner: "Planeador",
    video: "Video",
    athletes: "Atletas",
    live: "Direto",
  },
  continueWorking: {
    title: "Continuar trabalho",
    subtitle: "Retome onde ficou.",
    emptyState: "Ainda não existem projetos recentes. Use ações rápidas para iniciar o primeiro fluxo.",
  },
  projects: {
    planner: {
      title: "Programa Juvenil - Taça Regional",
      context: "3 elementos pendentes de validação",
      lastWorkedAt: "há 2 h",
    },
    video: {
      title: "Revisão de treino - Maria",
      context: "5 marcadores por transferir",
      lastWorkedAt: "Ontem",
    },
    athletes: {
      title: "Perfil de atleta - Lucas Costa",
      context: "Notas de prontidão para competição atualizadas",
      lastWorkedAt: "há 3 dias",
    },
  },
  quickActions: {
    title: "Ações rápidas",
    subtitle: "Inicie os fluxos mais frequentes.",
    emptyState: "Ainda não existem ações disponíveis.",
    newProgram: {
      title: "Novo programa",
      description: "Iniciar um novo espaço de planeamento.",
    },
    newVideoAnalysis: {
      title: "Nova análise de vídeo",
      description: "Abrir o espaço de vídeo e iniciar a análise.",
    },
    newAthlete: {
      title: "Novo atleta",
      description: "Criar e gerir registos de atletas.",
    },
    newCompetition: {
      title: "Nova competição",
      description: "Preparar próximas sessões de competição.",
    },
  },
  recentActivity: {
    title: "Atividade recente",
    subtitle: "Últimas atualizações nos seus fluxos.",
    emptyState: "Ainda não há atividade registada.",
    activity1: {
      title: "Validação do programa concluída",
      details: "Programa curto júnior passou para estado pronto.",
      happenedAt: "há 1 h",
    },
    activity2: {
      title: "Marcador de vídeo transferido",
      details: "Chamada técnica de Axel enviada para a fila do planeador.",
      happenedAt: "há 4 h",
    },
    activity3: {
      title: "Cronograma da competição atualizado",
      details: "A agenda da Taça Regional inclui agora o bloco de programa livre.",
      happenedAt: "Ontem",
    },
    activity4: {
      title: "Novo perfil de atleta iniciado",
      details: "Rascunho do perfil criado para Inês Matos.",
      happenedAt: "há 2 dias",
    },
  },
};
