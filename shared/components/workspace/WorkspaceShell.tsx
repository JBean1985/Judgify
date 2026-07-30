"use client";

import { ReactNode } from "react";

interface WorkspaceShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
  rightPanel?: ReactNode;
  statusBar?: ReactNode;
  sidebarWidth?: number;
  rightPanelWidth?: number;
  className?: string;
}

export default function WorkspaceShell({
  header,
  sidebar,
  children,
  rightPanel,
  statusBar,
  sidebarWidth = 64,
  rightPanelWidth = 320,
  className = "",
}: WorkspaceShellProps) {
  return (
    <div
      className={`app-shell h-screen overflow-hidden ${className}`}
    >
      <div className="workspace-shell-grid">
        <header className="workspace-shell-header app-border app-surface border-b">
          {header}
        </header>

        <div className="min-h-0 flex">
          <aside
            className="app-border app-surface min-h-0 shrink-0 border-r"
            style={{ width: sidebarWidth }}
          >
            {sidebar}
          </aside>

          <div className="min-h-0 flex flex-1">
            <main className="min-h-0 flex-1 overflow-hidden">
              {children}
            </main>

            {rightPanel && (
              <aside
                className="app-border app-surface min-h-0 shrink-0 border-l"
                style={{ width: rightPanelWidth }}
              >
                {rightPanel}
              </aside>
            )}
          </div>
        </div>

        <footer className="workspace-shell-footer app-border app-surface border-t">
          {statusBar}
        </footer>
      </div>
    </div>
  );
}
