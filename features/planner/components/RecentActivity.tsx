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
    title: "Programa Juvenis Femininos",
    description: "Última alteração há 2 horas",
  },
  {
    icon: Camera,
    title: "Vídeo - Treino da Maria",
    description: "Analisado ontem",
  },
  {
    icon: Calendar,
    title: "Campeonato Regional",
    description: "Daqui a 5 dias",
  },
  {
    icon: Sparkles,
    title: "Sugestão da IA",
    description: "Foi encontrada uma melhoria para o programa.",
  },
];

export default function RecentActivity() {
  return (
    <section className="mx-auto max-w-6xl">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-900">
          Atividade Recente
        </h2>

        <p className="mt-2 text-slate-500">
          Continue exatamente onde ficou.
        </p>

      </div>

      <div className="space-y-4">

        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:border-blue-500
                hover:shadow-md
              "
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                <Icon size={24} />

              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-900">
                  {activity.title}
                </h3>

                <p className="text-sm text-slate-500">
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