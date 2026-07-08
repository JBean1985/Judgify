import { Trophy } from "lucide-react";

import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./sidebarItems";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">

      <div className="border-b border-slate-200 p-6">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-600 p-3 text-white">
            <Trophy size={24} />
          </div>

          <div>

            <h1 className="text-xl font-bold">
              Judgify
            </h1>

            <p className="text-sm text-slate-500">
              Assistente Inteligente
            </p>

          </div>

        </div>

      </div>

      <nav className="flex-1 space-y-2 p-4">

        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
          />
        ))}

      </nav>

      <div className="border-t border-slate-200 p-4 text-xs text-slate-400">
        Alpha 0.1
      </div>

    </aside>
  );
}