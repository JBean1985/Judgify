"use client";

import { ReactNode } from "react";

interface WorkspaceStatusBarProps {
  leftSlot?: ReactNode;
  centerSlot?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}

export default function WorkspaceStatusBar({
  leftSlot,
  centerSlot,
  rightSlot,
  className = "",
}: WorkspaceStatusBarProps) {
  return (
    <div
      className={`app-text-muted flex h-full items-center gap-3 px-3 text-xs ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0 shrink-0">{leftSlot}</div>
      <div className="min-w-0 flex-1 truncate text-center">
        {centerSlot}
      </div>
      <div className="min-w-0 shrink-0">{rightSlot}</div>
    </div>
  );
}
