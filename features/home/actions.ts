import {
  Camera,
  FileText,
  Radio,
  Users,
} from "lucide-react";

export interface HomeAction {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: typeof FileText;
}

export const actions: HomeAction[] = [
  {
    id: "planner",
    title: "Novo Esquema",
    description: "Criar ou editar um esquema de prova.",
    href: "/planner",
    icon: FileText,
  },
  {
    id: "video",
    title: "Análise de Vídeo",
    description: "Analisar um vídeo de uma atleta.",
    href: "/video",
    icon: Camera,
  },
  {
    id: "live",
    title: "Análise LIVE",
    description: "Analisar uma prova em tempo real.",
    href: "/live",
    icon: Radio,
  },
  {
    id: "athletes",
    title: "Atletas",
    description: "Gerir atletas e histórico.",
    href: "/athletes",
    icon: Users,
  },
];