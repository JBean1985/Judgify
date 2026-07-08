import {
  Camera,
  FileText,
  Settings,
  Trophy,
  Users,
} from "lucide-react";

export interface DashboardItem {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  route: string;
}

export const dashboardItems: DashboardItem[] = [
  {
    id: "planner",
    title: "Construtor de Esquemas",
    description: "Crie e otimize esquemas para maximizar a pontuação.",
    icon: FileText,
    route: "/planner",
  },

  {
    id: "video",
    title: "Análise de Vídeo",
    description: "Analise treinos e competições com apoio da IA.",
    icon: Camera,
    route: "/video",
  },

  {
    id: "live",
    title: "Análise em Direto",
    description: "Acompanhe e pontue o esquema em tempo real.",
    icon: Trophy,
    route: "/live",
  },

  {
    id: "athletes",
    title: "Atletas",
    description: "Gerir atletas, treinos e histórico.",
    icon: Users,
    route: "/athletes",
  },

  {
    id: "settings",
    title: "Definições",
    description: "Personalizar a aplicação.",
    icon: Settings,
    route: "/settings",
  },
];