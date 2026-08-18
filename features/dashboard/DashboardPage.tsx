"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { ContextEngine } from "@/features/core/context";
import SchemaWizard from "@/features/home/components/SchemaWizard";
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
  const router = useRouter();
  const [showSchemaWizard, setShowSchemaWizard] = useState(false);

  function handleSchemaComplete(data: {
    athlete: string;
    category: string;
    discipline: string;
    programType: "short" | "long";
    ruleProfile: {
      federation: "legacy" | "fpp" | "world-skate";
      season: string;
    };
  }) {
    ContextEngine.set({
      athlete: data.athlete,
      category: data.category,
      discipline: data.discipline,
      programType: data.programType,
      ruleProfile: data.ruleProfile,
      currentModule: "planner",
    });

    router.push("/planner");
  }

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
              <QuickActionsWidget
                actions={quickActions}
                onNewProgram={() => setShowSchemaWizard(true)}
              />
            </section>

            <section className="lg:col-span-12">
              <RecentActivityWidget items={recentActivities} />
            </section>
          </div>
        </main>
      </div>

      {showSchemaWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/40"
            aria-label="Fechar criação de programa"
            onClick={() => setShowSchemaWizard(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Criar novo programa"
            className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setShowSchemaWizard(false)}
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Fechar criação de programa"
              title="Fechar"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <SchemaWizard onComplete={handleSchemaComplete} />
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}