import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="h-screen overflow-hidden bg-slate-50">
      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden px-6 py-6">
        {children}
      </div>
    </main>
  );
}