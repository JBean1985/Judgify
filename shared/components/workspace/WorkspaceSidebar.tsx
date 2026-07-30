"use client";

import { ReactNode } from "react";
import { useTranslation } from "@/shared/i18n";

export interface WorkspaceSidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  isActive?: boolean;
  onSelect?: (id: string) => void;
}

interface WorkspaceSidebarProps {
  items: WorkspaceSidebarItem[];
  collapsed?: boolean;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  className?: string;
}

export default function WorkspaceSidebar({
  items,
  collapsed = true,
  headerSlot,
  footerSlot,
  className = "",
}: WorkspaceSidebarProps) {
  const { t } = useTranslation();

  return (
    <nav
      className={`flex h-full flex-col overflow-hidden ${className}`}
      aria-label={t("navigation.workspaceAriaLabel")}
    >
      {headerSlot && (
        <div className="shrink-0 border-b border-slate-200 p-2">
          {headerSlot}
        </div>
      )}

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {items.map((item) => {
          const activeClasses = item.isActive
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:bg-slate-100";

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => item.onSelect?.(item.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition ${activeClasses}`}
                aria-current={item.isActive ? "page" : undefined}
                title={item.label}
              >
                <span className="flex h-4 w-4 items-center justify-center">
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="min-w-0 flex-1 truncate">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge !== undefined && (
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {footerSlot && (
        <div className="shrink-0 border-t border-slate-200 p-2">
          {footerSlot}
        </div>
      )}
    </nav>
  );
}
