import type { DashboardTranslations } from "../../types";

export const enDashboard: DashboardTranslations = {
  header: {
    searchPlaceholder: "Search projects, athletes, videos, competitions...",
    notificationsPlaceholder: "Notifications (placeholder)",
    userAvatarPlaceholder: "User avatar (placeholder)",
    greeting: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    greetingWithName: "{{greeting}}, {{name}}",
    fallbackUserName: "Coach",
  },
  statusBar: {
    version: "Dashboard V1",
    mockDataMode: "Mock data mode",
    allSystemsOperational: "All systems operational",
  },
  modules: {
    planner: "Planner",
    video: "Video",
    athletes: "Athletes",
    live: "Live",
  },
  continueWorking: {
    title: "Continue working",
    subtitle: "Resume where you left off.",
    emptyState: "No recent projects yet. Use Quick Actions to start your first workflow.",
  },
  projects: {
    planner: {
      title: "Juvenile Program - Regional Cup",
      context: "3 elements pending validation",
      lastWorkedAt: "2h ago",
    },
    video: {
      title: "Maria Training Review",
      context: "5 markers not transferred",
      lastWorkedAt: "Yesterday",
    },
    athletes: {
      title: "Athlete Profile - Lucas Costa",
      context: "Competition readiness notes updated",
      lastWorkedAt: "3 days ago",
    },
  },
  quickActions: {
    title: "Quick Actions",
    subtitle: "Launch the most common workflows.",
    emptyState: "No actions available yet.",
    newProgram: {
      title: "New Program",
      description: "Start a new planning workspace.",
    },
    newVideoAnalysis: {
      title: "New Video Analysis",
      description: "Open video workspace and begin analysis.",
    },
    newAthlete: {
      title: "New Athlete",
      description: "Create and manage athlete records.",
    },
    newCompetition: {
      title: "New Competition",
      description: "Prepare upcoming competition sessions.",
    },
  },
  recentActivity: {
    title: "Recent Activity",
    subtitle: "Latest updates across your workflows.",
    emptyState: "No activity recorded yet.",
    activity1: {
      title: "Program validation completed",
      details: "Junior short program moved to ready status.",
      happenedAt: "1h ago",
    },
    activity2: {
      title: "Video marker transferred",
      details: "Axel technical call sent to planner queue.",
      happenedAt: "4h ago",
    },
    activity3: {
      title: "Competition timeline updated",
      details: "Regional Cup schedule now includes free skate block.",
      happenedAt: "Yesterday",
    },
    activity4: {
      title: "New athlete profile started",
      details: "Profile draft created for Ines Matos.",
      happenedAt: "2 days ago",
    },
  },
};
