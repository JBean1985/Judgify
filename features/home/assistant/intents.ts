export interface Intent {
  id: string;
  keywords: string[];
  module: string;
}

export const intents: Intent[] = [
  {
    id: "planner",
    module: "planner",
    keywords: [
      "programa",
      "esquema",
      "folha técnica",
      "criar programa",
      "program",
    ],
  },
  {
    id: "video",
    module: "video",
    keywords: [
      "vídeo",
      "video",
      "analisar",
      "gravação",
    ],
  },
  {
    id: "live",
    module: "live",
    keywords: [
      "live",
      "competição",
      "direto",
      "campeonato",
    ],
  },
  {
    id: "athletes",
    module: "athletes",
    keywords: [
      "atleta",
      "patinadora",
      "perfil",
      "evolução",
    ],
  },
];