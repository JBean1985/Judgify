"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HomeHero from "../components/HomeHero";
import AiPrompt from "../components/AiPrompt";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";

function AiPromptWithQueryKey() {
  const searchParams = useSearchParams();
  const createPlannerKey = searchParams?.get("createPlanner") ?? "0";

  return <AiPrompt key={createPlannerKey} />;
}

export default function WelcomeExperience() {
  return (
    <main className="mx-auto max-w-7xl space-y-12 px-6 py-10">

      <HomeHero />

      <Suspense fallback={null}>
        <AiPromptWithQueryKey />
      </Suspense>

      <QuickActions />

      <RecentActivity />

    </main>
  );
}