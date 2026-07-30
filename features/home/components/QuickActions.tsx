"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  FileText,
  Radio,
  Users,
} from "lucide-react";

import { ContextEngine } from "@/features/core/context";
import SchemaWizard from "./SchemaWizard";

const actions = [
  {
    title: "Criar Esquema",
    description: "Construir um Esquema de Patinagem.",
    icon: FileText,
    href: "/?createPlanner=1",
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
  const router = useRouter();
  const [showSchemaWizard, setShowSchemaWizard] = useState(false);

  function handleSchemaComplete(data: {
    athlete: string;
    category: string;
    discipline: string;
    programType: "short" | "long";
    ruleProfile: {
      federation: "legacy" | "fpp" | "world-skate";
      season: string;
    };
  }) {
    ContextEngine.set({
      athlete: data.athlete,
      category: data.category,
      discipline: data.discipline,
      programType: data.programType,
      ruleProfile: data.ruleProfile,
      currentModule: "planner",
    });

    router.push("/planner");
  }

  return (
    <section className="mx-auto max-w-6xl">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          if (action.title === "Criar Esquema") {
            return (
              <button
                key={action.title}
                type="button"
                onClick={() => setShowSchemaWizard(true)}
                className="min-h-[118px] rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Icon size={18} />
                </div>

                <h3 className="mt-2 text-sm font-semibold text-slate-900">
                  {action.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {action.description}
                </p>
              </button>
            );
          }

          return (
            <Link
              key={action.title}
              href={action.href}
              className="min-h-[118px] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Icon size={18} />
              </div>

              <h3 className="mt-2 text-sm font-semibold text-slate-900">
                {action.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>

      {showSchemaWizard && (
        <div className="mt-3">
          <SchemaWizard onComplete={handleSchemaComplete} />
        </div>
      )}
    </section>
  );
}