import {
  Bell,
  Camera,
  FileText,
  Plus,
  Trophy,
  Users,
} from "lucide-react";

export interface ContinueProject {
  id: "planner" | "video" | "athletes";
  module: "planner" | "video" | "athletes" | "live";
}

export interface DashboardQuickAction {
  id:
    | "new-program"
    | "new-video-analysis"
    | "new-athlete"
    | "new-competition";
  icon: typeof FileText;
  route: string;
}

export interface ActivityItem {
  id: "activity-1" | "activity-2" | "activity-3" | "activity-4";
  icon: typeof FileText;
}

export const dashboardUser = {
  name: "Sofia",
};

export const continueProjects: ContinueProject[] = [
  {
    id: "planner",
    module: "planner",
  },
  {
    id: "video",
    module: "video",
  },
  {
    id: "athletes",
    module: "athletes",
  },
];

export const quickActions: DashboardQuickAction[] = [
  {
    id: "new-program",
    icon: FileText,
    route: "/planner",
  },
  {
    id: "new-video-analysis",
    icon: Camera,
    route: "/video",
  },
  {
    id: "new-athlete",
    icon: Users,
    route: "/athletes",
  },
  {
    id: "new-competition",
    icon: Trophy,
    route: "/live",
  },
];

export const recentActivities: ActivityItem[] = [
  {
    id: "activity-1",
    icon: FileText,
  },
  {
    id: "activity-2",
    icon: Camera,
  },
  {
    id: "activity-3",
    icon: Bell,
  },
  {
    id: "activity-4",
    icon: Plus,
  },
];