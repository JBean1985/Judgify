"use client";

import { ReactNode } from "react";

interface WorkspacePanelProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  scrollable?: boolean;
  className?: string;
  contentClassName?: string;
}

export default function WorkspacePanel({
  title,
  subtitle,
  actions,
  footer,
  children,
  scrollable = true,
  className = "",
  contentClassName = "",
}: WorkspacePanelProps) {
  return (
    <section
      className={`app-border app-surface flex h-full min-h-0 flex-col rounded-xl border shadow-sm ${className}`}
    >
      {(title || subtitle || actions) && (
        <header className="app-border flex items-start justify-between gap-3 border-b px-3 py-2">
          <div className="min-w-0">
            {title && (
              <h2 className="app-text-primary truncate text-sm font-semibold">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="app-text-muted mt-0.5 truncate text-xs">
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div className="shrink-0">{actions}</div>}
        </header>
      )}

      <div
        className={`min-h-0 flex-1 px-3 py-2 ${
          scrollable ? "overflow-auto" : "overflow-hidden"
        } ${contentClassName}`}
      >
        {children}
      </div>

      {footer && (
        <footer className="app-border shrink-0 border-t px-3 py-2">
          {footer}
        </footer>
      )}
    </section>
  );
}
