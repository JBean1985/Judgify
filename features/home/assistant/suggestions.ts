export interface Suggestion {
  id: string;
  title: string;
  prompt: string;
}

export const suggestions: Suggestion[] = [
  {
    id: "planner",
    title: "📋 Criar Esquema",
    prompt: "Quero preparar um esquema.",
  },
  {
    id: "video",
    title: "🎥 Analisar Vídeo",
    prompt: "Quero analisar um vídeo.",
  },
  {
    id: "live",
    title: "📡 Competição LIVE",
    prompt: "Quero acompanhar uma competição.",
  },
  {
    id: "athlete",
    title: "👤 Consultar Atleta",
    prompt: "Quero consultar uma atleta.",
  },
  {
    id: "score",
    title: "⭐ Explicar uma Nota",
    prompt: "Explica esta nota.",
  },
];