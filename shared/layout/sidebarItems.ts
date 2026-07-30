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
  titleKey:
    | "navigation.sidebar.dashboard"
    | "navigation.sidebar.planner"
    | "navigation.sidebar.video"
    | "navigation.sidebar.live"
    | "navigation.sidebar.athletes"
    | "navigation.sidebar.settings";
  icon: typeof LayoutDashboard;
  href: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    titleKey: "navigation.sidebar.dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    id: "planner",
    titleKey: "navigation.sidebar.planner",
    icon: FileText,
    href: "/planner",
  },
  {
    id: "video",
    titleKey: "navigation.sidebar.video",
    icon: Camera,
    href: "/video",
  },
  {
    id: "live",
    titleKey: "navigation.sidebar.live",
    icon: Radio,
    href: "/live",
  },
  {
    id: "athletes",
    titleKey: "navigation.sidebar.athletes",
    icon: Users,
    href: "/athletes",
  },
  {
    id: "settings",
    titleKey: "navigation.sidebar.settings",
    icon: Settings,
    href: "/settings",
  },
];