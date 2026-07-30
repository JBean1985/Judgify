"use client";

import Link from "next/link";

import { Card } from "@/shared/components";
import { useTranslation } from "@/shared/i18n";

import type { DashboardQuickAction } from "../dashboardData";

interface QuickActionsWidgetProps {
  actions: DashboardQuickAction[];
}

export default function QuickActionsWidget({
  actions,
}: QuickActionsWidgetProps) {
  const { t } = useTranslation();

  const quickActionContentById = {
    "new-program": {
      title: t("dashboard.quickActions.newProgram.title"),
      description: t("dashboard.quickActions.newProgram.description"),
    },
    "new-video-analysis": {
      title: t("dashboard.quickActions.newVideoAnalysis.title"),
      description: t("dashboard.quickActions.newVideoAnalysis.description"),
    },
    "new-athlete": {
      title: t("dashboard.quickActions.newAthlete.title"),
      description: t("dashboard.quickActions.newAthlete.description"),
    },
    "new-competition": {
      title: t("dashboard.quickActions.newCompetition.title"),
      description: t("dashboard.quickActions.newCompetition.description"),
    },
  } as const;

  return (
    <Card className="h-full p-4 sm:p-5">
      <div className="flex h-full flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {t("dashboard.quickActions.title")}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {t("dashboard.quickActions.subtitle")}
          </p>
        </div>

        {actions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            {t("dashboard.quickActions.emptyState")}
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;
              const content = quickActionContentById[action.id];

              return (
                <Link
                  key={action.id}
                  href={action.route}
                  className="group rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-blue-500"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Icon size={16} />
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-slate-900">
                    {content.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {content.description}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}