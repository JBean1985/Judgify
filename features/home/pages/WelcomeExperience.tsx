"use client";

import HomeHero from "../components/HomeHero";
import AiPrompt from "../components/AiPrompt";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";

export default function WelcomeExperience() {
  return (
    <main className="mx-auto max-w-7xl space-y-12 px-6 py-10">

      <HomeHero />

      <AiPrompt />

      <QuickActions />

      <RecentActivity />

    </main>
  );
}