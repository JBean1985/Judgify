"use client";

import Link from "next/link";
import {
  Camera,
  FileText,
  Radio,
  Users,
} from "lucide-react";

const actions = [
  {
    title: "Criar Esquema",
    description: "Construir um Esquema de Patinagem.",
    icon: FileText,
    href: "/planner",
  },
  {
    title: "Analisar Vídeo",
    description: "Analisar uma atuação.",
    icon: Camera,
    href: "/video",
  },
  {
    title: "Competição LIVE",
    description: "Acompanhar uma competição.",
    icon: Radio,
    href: "/live",
  },
  {
    title: "Atletas",
    description: "Consultar atletas.",
    icon: Users,
    href: "/athletes",
  },
];

export default function QuickActions() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Icon size={28} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}