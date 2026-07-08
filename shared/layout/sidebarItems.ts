import {
  Camera,
  FileText,
  LayoutDashboard,
  Radio,
  Settings,
  Users,
} from "lucide-react";

export interface SidebarItem {
  id: string;
  title: string;
  icon: typeof LayoutDashboard;
  href: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    title: "Painel",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    id: "planner",
    title: "Construtor de Esquemas",
    icon: FileText,
    href: "/planner",
  },
  {
    id: "video",
    title: "Análise de Vídeo",
    icon: Camera,
    href: "/video",
  },
  {
    id: "live",
    title: "Análise em Direto",
    icon: Radio,
    href: "/live",
  },
  {
    id: "athletes",
    title: "Atletas",
    icon: Users,
    href: "/athletes",
  },
  {
    id: "settings",
    title: "Definições",
    icon: Settings,
    href: "/settings",
  },
];