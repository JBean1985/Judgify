"use client";

import {
  WorkspaceHeader,
  WorkspaceShell,
  WorkspaceSidebar,
} from "@/shared/components/workspace";

import HomeHero from "../components/HomeHero";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";

export default function WelcomeExperience() {
  return (
    <WorkspaceShell
      header={<WorkspaceHeader title="Home" />}
      sidebar={<WorkspaceSidebar items={[]} collapsed />}
      sidebarWidth={0}
      className="[&>div>header]:border-b-0 [&>div>footer]:border-t-0 [&>div>div>aside]:border-r-0"
    >
      <div className="h-full overflow-hidden">
        <main className="h-full overflow-y-auto px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:gap-4">
            <div className="-mt-1 sm:-mt-2">
              <HomeHero />
            </div>

            <QuickActions />

            <RecentActivity />
          </div>
        </main>
      </div>
    </WorkspaceShell>
  );
}