"use client";

import Link from "next/link";

import { PageHeader } from "@/shared/components";
import { ContextEngine } from "@/features/core/context";

import CoachAssistant from "./assistant/CoachAssistant";

export default function ProgramEditor() {
  const context = ContextEngine.get();

  const hasSchemaContext =
    context.athlete &&
    context.category &&
    context.discipline;

  if (!hasSchemaContext) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Construtor de Esquemas"
          subtitle="Ainda não existe um esquema iniciado."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Nenhum esquema ativo
          </h2>

          <p className="mt-2 text-slate-500">
            Volte à página inicial e peça ao Judgy para criar um novo esquema.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Construtor de Esquemas"
        subtitle="Construa a Folha Técnica com base nos dados definidos pelo Judgy."
      />

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
        <div>
          <p className="text-sm text-slate-500">Atleta</p>
          <p className="mt-1 font-semibold text-slate-900">
            {context.athlete}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Categoria</p>
          <p className="mt-1 font-semibold text-slate-900">
            {context.category}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Disciplina</p>
          <p className="mt-1 font-semibold text-slate-900">
            {context.discipline}
          </p>
        </div>
      </div>

      <CoachAssistant />
    </div>
  );
}