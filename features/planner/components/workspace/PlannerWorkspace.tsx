"use client";

import { useState } from "react";
import Link from "next/link";

import { ContextEngine } from "@/features/core/context";
import { WorkspaceProvider } from "../../context";

import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceAssistant from "./WorkspaceAssistant";
import WorkspaceLibrary from "./WorkspaceLibrary";
import TechnicalPanel from "./TechnicalPanel";
import CoachPanel from "./CoachPanel";
import TechnicalSheet from "./technical-sheet/TechnicalSheet";
import FloatingActionButton from "./mobile/FloatingActionButton";

export default function PlannerWorkspace() {
  const [showLibrary, setShowLibrary] = useState(false);

  const context = ContextEngine.get();

  const hasSchemaContext =
    context.athlete &&
    context.category &&
    context.discipline;

  if (!hasSchemaContext) {
    return (
      <div className="space-y-6">
        <WorkspaceHeader title="Construtor de Esquemas" />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Nenhum esquema ativo
          </h2>

          <p className="mt-2 text-slate-500">
            Volte ao início e peça ao Judgy para criar um novo esquema.
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
    <WorkspaceProvider>
      <div className="space-y-6">
        <WorkspaceHeader title="Construtor de Esquemas" />

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

        <WorkspaceAssistant />

        <div className="hidden gap-6 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-3">
            <WorkspaceLibrary />
          </div>

          <div className="lg:col-span-6">
            <TechnicalSheet />
          </div>

          <div className="space-y-6 lg:col-span-3">
            <TechnicalPanel />

            <CoachPanel />
          </div>
        </div>

        <div className="space-y-6 lg:hidden">
          <TechnicalSheet />

          <TechnicalPanel />

          <CoachPanel />
        </div>

        {showLibrary && (
          <div className="fixed inset-0 z-40 flex items-end bg-black/40 lg:hidden">
            <div className="max-h-[80vh] w-full overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Biblioteca
                </h2>

                <button
                  onClick={() => setShowLibrary(false)}
                  className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
                >
                  Fechar
                </button>
              </div>

              <WorkspaceLibrary />
            </div>
          </div>
        )}

        <FloatingActionButton
          onClick={() => setShowLibrary(true)}
        />
      </div>
    </WorkspaceProvider>
  );
}