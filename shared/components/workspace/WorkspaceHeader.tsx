"use client";

import { ReactNode } from "react";

import { SettingsEntryPoint } from "@/shared/settings";

interface WorkspaceHeaderProps {
  title?: string;
  subtitle?: string;
  leftSlot?: ReactNode;
  centerSlot?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}

export default function WorkspaceHeader({
  title,
  subtitle,
  leftSlot,
  centerSlot,
  rightSlot,
  className = "",
}: WorkspaceHeaderProps) {
  return (
    <div
      className={`flex min-h-14 items-center gap-3 overflow-visible px-3 py-2 ${className}`}
    >
      <div className="min-w-0 shrink-0">
        {leftSlot ?? (
          <div className="min-w-0">
            {title && (
              <h1 className="app-text-primary truncate text-sm font-semibold">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="app-text-muted truncate text-xs">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">{centerSlot}</div>

      <div className="shrink-0 flex items-center gap-2 overflow-visible">
        {rightSlot}
        <SettingsEntryPoint />
      </div>
    </div>
  );
}
