"use client";

import Link from "next/link";

import { Button, Card } from "@/shared/components";
import { useTranslation } from "@/shared/i18n";

import type { ContinueProject } from "../dashboardData";

interface ContinueWorkingWidgetProps {
  items: ContinueProject[];
}

const routeByModule = {
  planner: "/planner",
  video: "/video",
  athletes: "/athletes",
  live: "/live",
} as const;

export default function ContinueWorkingWidget({
  items,
}: ContinueWorkingWidgetProps) {
  const { t } = useTranslation();

  const projectContentById = {
    planner: {
      title: t("dashboard.projects.planner.title"),
      context: t("dashboard.projects.planner.context"),
      lastWorkedAt: t("dashboard.projects.planner.lastWorkedAt"),
    },
    video: {
      title: t("dashboard.projects.video.title"),
      context: t("dashboard.projects.video.context"),
      lastWorkedAt: t("dashboard.projects.video.lastWorkedAt"),
    },
    athletes: {
      title: t("dashboard.projects.athletes.title"),
      context: t("dashboard.projects.athletes.context"),
      lastWorkedAt: t("dashboard.projects.athletes.lastWorkedAt"),
    },
  } as const;

  const moduleLabelByType = {
    planner: t("dashboard.modules.planner"),
    video: t("dashboard.modules.video"),
    athletes: t("dashboard.modules.athletes"),
    live: t("dashboard.modules.live"),
  } as const;

  return (
    <Card className="h-full p-4 sm:p-5">
      <div className="flex h-full flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {t("dashboard.continueWorking.title")}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {t("dashboard.continueWorking.subtitle")}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            {t("dashboard.continueWorking.emptyState")}
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const content = projectContentById[item.id];

              return (
                <li
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {content.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {content.context}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {moduleLabelByType[item.module]} • {content.lastWorkedAt}
                      </p>
                    </div>

                    <Link href={routeByModule[item.module]}>
                      <Button className="w-full sm:w-auto">
                        {t("common.actions.continue")}
                      </Button>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}