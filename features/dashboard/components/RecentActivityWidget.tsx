"use client";

import { Card } from "@/shared/components";
import { useTranslation } from "@/shared/i18n";

import type { ActivityItem } from "../dashboardData";

interface RecentActivityWidgetProps {
  items: ActivityItem[];
}

export default function RecentActivityWidget({
  items,
}: RecentActivityWidgetProps) {
  const { t } = useTranslation();

  const recentActivityById = {
    "activity-1": {
      title: t("dashboard.recentActivity.activity1.title"),
      details: t("dashboard.recentActivity.activity1.details"),
      happenedAt: t("dashboard.recentActivity.activity1.happenedAt"),
    },
    "activity-2": {
      title: t("dashboard.recentActivity.activity2.title"),
      details: t("dashboard.recentActivity.activity2.details"),
      happenedAt: t("dashboard.recentActivity.activity2.happenedAt"),
    },
    "activity-3": {
      title: t("dashboard.recentActivity.activity3.title"),
      details: t("dashboard.recentActivity.activity3.details"),
      happenedAt: t("dashboard.recentActivity.activity3.happenedAt"),
    },
    "activity-4": {
      title: t("dashboard.recentActivity.activity4.title"),
      details: t("dashboard.recentActivity.activity4.details"),
      happenedAt: t("dashboard.recentActivity.activity4.happenedAt"),
    },
  } as const;

  return (
    <Card className="h-full p-4 sm:p-5">
      <div className="flex h-full flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {t("dashboard.recentActivity.title")}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {t("dashboard.recentActivity.subtitle")}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            {t("dashboard.recentActivity.emptyState")}
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              const content = recentActivityById[item.id];

              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Icon size={15} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {content.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {content.details}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-slate-400">
                    {content.happenedAt}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}