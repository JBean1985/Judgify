"use client";

import {
  WorkspaceShell,
  WorkspaceSidebar,
  WorkspaceStatusBar,
} from "@/shared/components/workspace";

import ContinueWorkingWidget from "./components/ContinueWorkingWidget";
import DashboardTopHeader from "./components/DashboardTopHeader";
import QuickActionsWidget from "./components/QuickActionsWidget";
import RecentActivityWidget from "./components/RecentActivityWidget";
import {
  continueProjects,
  dashboardUser,
  quickActions,
  recentActivities,
} from "./dashboardData";
import { useTranslation } from "@/shared/i18n";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <WorkspaceShell
      header={(
        <DashboardTopHeader
          userName={dashboardUser.name}
        />
      )}
      sidebar={<WorkspaceSidebar items={[]} collapsed />}
      statusBar={(
        <WorkspaceStatusBar
          leftSlot={<span>{t("dashboard.statusBar.version")}</span>}
          centerSlot={<span>{t("dashboard.statusBar.mockDataMode")}</span>}
          rightSlot={<span>{t("dashboard.statusBar.allSystemsOperational")}</span>}
        />
      )}
      sidebarWidth={0}
      className="[&>div>div>aside]:border-r-0"
    >
      <div className="h-full overflow-hidden">
        <main className="h-full overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
          <div className="mx-auto grid max-w-7xl gap-3 sm:gap-4 lg:grid-cols-12">
            <section className="lg:col-span-7">
              <ContinueWorkingWidget items={continueProjects} />
            </section>

            <section className="lg:col-span-5">
              <QuickActionsWidget actions={quickActions} />
            </section>

            <section className="lg:col-span-12">
              <RecentActivityWidget items={recentActivities} />
            </section>
          </div>
        </main>
      </div>
    </WorkspaceShell>
  );
}