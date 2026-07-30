"use client";

import { Bell, Search, User } from "lucide-react";

import { WorkspaceHeader } from "@/shared/components/workspace";
import { useTranslation } from "@/shared/i18n";

interface DashboardTopHeaderProps {
  userName?: string;
}

export default function DashboardTopHeader({
  userName,
}: DashboardTopHeaderProps) {
  const { t } = useTranslation();
  const fallbackUserName = t("dashboard.header.fallbackUserName");
  const resolvedUserName = userName?.trim() || fallbackUserName;

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t("dashboard.header.greeting.morning")
      : hour < 18
        ? t("dashboard.header.greeting.afternoon")
        : t("dashboard.header.greeting.evening");

  const personalizedGreeting = t("dashboard.header.greetingWithName", {
    greeting,
    name: resolvedUserName,
  });

  return (
    <WorkspaceHeader
      leftSlot={(
        <div>
          <p className="app-text-muted text-xs">
            {personalizedGreeting}
          </p>
          <h1 className="app-text-primary text-sm font-semibold">
            {resolvedUserName}
          </h1>
        </div>
      )}
      centerSlot={(
        <div className="hidden md:block">
          <div className="app-border app-surface-muted app-text-muted flex min-h-9 items-center gap-2 rounded-lg border px-3 text-xs">
            <Search size={14} />
            <span>{t("dashboard.header.searchPlaceholder")}</span>
          </div>
        </div>
      )}
      rightSlot={(
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="app-border app-surface-muted app-text-muted focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg border"
            aria-label={t("dashboard.header.notificationsPlaceholder")}
            title={t("dashboard.header.notificationsPlaceholder")}
          >
            <Bell size={14} />
          </button>

          <div
            className="app-border app-surface-muted app-text-muted inline-flex h-8 w-8 items-center justify-center rounded-full border"
            aria-label={t("dashboard.header.userAvatarPlaceholder")}
            title={t("dashboard.header.userAvatarPlaceholder")}
          >
            <User size={14} />
          </div>
        </div>
      )}
    />
  );
}