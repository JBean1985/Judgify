"use client";

import {
  Calendar,
  Camera,
  FileText,
  Sparkles,
} from "lucide-react";

const activities = [
  {
    icon: FileText,
    title: "Esquema Juvenis",
    description: "Última alteração há 2 horas.",
  },
  {
    icon: Camera,
    title: "Treino da Maria",
    description: "Vídeo analisado ontem.",
  },
  {
    icon: Calendar,
    title: "Campeonato Regional",
    description: "Daqui a 5 dias.",
  },
  {
    icon: Sparkles,
    title: "Sugestão da IA",
    description: "Foi encontrada uma melhoria no esquema.",
  },
];

export default function RecentActivity() {
  return (
    <section className="mx-auto max-w-6xl">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">
        Atividade Recente
      </h2>

      <div className="grid gap-2 lg:grid-cols-2">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Icon size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {activity.title}
                </h3>

                <p className="text-xs text-slate-500">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}