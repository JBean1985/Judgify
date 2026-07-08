import { ChevronRight } from "lucide-react";

import { Card } from "@/shared/components";
import { DashboardItem } from "../dashboardData";

interface DashboardCardProps {
  item: DashboardItem;
  onClick?: () => void;
}

export default function DashboardCard({
  item,
  onClick,
}: DashboardCardProps) {
  const Icon = item.icon;

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
              {item.title}
            </h2>

            <p className="mt-1 text-slate-500">
              {item.description}
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
