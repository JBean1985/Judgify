import { ChevronRight } from "lucide-react";

import { Card } from "@/shared/components";
import { useTranslation } from "@/shared/i18n";
import type { DashboardQuickAction } from "../dashboardData";

interface DashboardCardProps {
  item: DashboardQuickAction;
  onClick?: () => void;
}

export default function DashboardCard({
  item,
  onClick,
}: DashboardCardProps) {
  const { t } = useTranslation();
  const Icon = item.icon;

  const contentById = {
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

  const content = contentById[item.id];

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer hover:border-blue-500"
    >
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-5">

          <div className="rounded-xl bg-blue-50 p-4">
            <Icon
              size={28}
              className="text-blue-600"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              {content.title}
            </h2>

            <p className="mt-1 text-slate-500">
              {content.description}
            </p>

          </div>

        </div>

        <ChevronRight
          className="
            text-slate-300
            transition-all
            group-hover:translate-x-1
            group-hover:text-blue-600
          "
        />

      </div>
    </Card>
  );
}
