import { PageHeader } from "@/shared/components";

import DashboardCard from "./components/DashboardCard";
import { dashboardItems } from "./dashboardData";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl p-10">

      <PageHeader
        title="Judgify"
        subtitle="AI Figure Skating Coach"
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {dashboardItems.map((item) => (
          <DashboardCard
            key={item.id}
            item={item}
          />
        ))}

      </section>

    </main>
  );
}