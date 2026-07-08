"use client";

import Link from "next/link";
import {
  FileText,
  Camera,
  Radio,
  Users,
} from "lucide-react";

const actions = [
  {
    title: "Criar Programa",
    description: "Construa uma Folha Técnica com o apoio da IA.",
    icon: FileText,
    href: "/planner",
  },
  {
    title: "Analisar Vídeo",
    description: "Analise uma atuação automaticamente.",
    icon: Camera,
    href: "/video",
  },
  {
    title: "Competição LIVE",
    description: "Acompanhe uma competição em tempo real.",
    icon: Radio,
    href: "/live",
  },
  {
    title: "Atletas",
    description: "Consulte a evolução e histórico das atletas.",
    icon: Users,
    href: "/athletes",
  },
];

export default function QuickActions() {
  return (
    <section className="mx-auto max-w-6xl">

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="
                group
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                transition-all
                hover:-translate-y-1
                hover:border-blue-500
                hover:shadow-lg
              "
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

                <Icon size={28} />

              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {action.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.description}
              </p>

            </Link>
          );
        })}

      </div>

    </section>
  );
}