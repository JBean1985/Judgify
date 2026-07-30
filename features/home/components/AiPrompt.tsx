"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles } from "lucide-react";

import { ContextEngine } from "@/features/core/context";
import { AssistantEngine } from "../assistant/AssistantEngine";

import AssistantResponse from "./AssistantResponse";
import SchemaWizard from "./SchemaWizard";
import type { SchemaWizardData } from "./SchemaWizard";
import {
  GLOBAL_CONTEXT_STORAGE_KEY,
  PLANNER_ELEMENTS_STORAGE_KEY,
} from "@/shared/constants/storage";

function destinationWithoutCreatePlanner(pathname?: string): string {
  const url = new URL(window.location.href);
  url.searchParams.delete("createPlanner");

  if (pathname) {
    url.pathname = pathname;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export default function AiPrompt() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createPlannerRequested = searchParams.get("createPlanner") === "1";

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(() =>
    createPlannerRequested
      ? "📋 Excelente! Vamos criar um novo esquema. Preencha os dados abaixo para continuar."
      : ""
  );
  const [showSchemaWizard, setShowSchemaWizard] = useState(
    createPlannerRequested
  );

  function handleSubmit() {
    if (!message.trim()) return;

    const result = AssistantEngine.detect(message);

    setShowSchemaWizard(false);

    if (!result.found) {
      setResponse(
        "Ainda não percebi esse pedido. Experimente criar um esquema, analisar um vídeo ou acompanhar uma competição."
      );
      return;
    }

    switch (result.module) {
      case "planner":
        setResponse(
          "📋 Excelente! Vamos criar um novo esquema. Preencha os dados abaixo para continuar."
        );
        setShowSchemaWizard(true);
        break;

      case "video":
        setResponse("🎥 A análise de vídeo estará disponível em breve.");
        break;

      case "live":
        setResponse("📡 O modo LIVE estará disponível em breve.");
        break;

      case "athletes":
        setResponse("👤 A gestão de atletas estará disponível em breve.");
        break;

      default:
        setResponse("🤖 Pedido reconhecido.");
    }
  }

  function handleSchemaComplete(data: SchemaWizardData) {
    let previousStoredContext: string | null = null;
    let previousStoredElements: string | null = null;
    let snapshotsTaken = false;

    try {
      previousStoredContext = window.localStorage.getItem(
        GLOBAL_CONTEXT_STORAGE_KEY
      );
      previousStoredElements = window.localStorage.getItem(
        PLANNER_ELEMENTS_STORAGE_KEY
      );
      snapshotsTaken = true;

      ContextEngine.set({
        athlete: data.athlete,
        category: data.category,
        discipline: data.discipline,
        programType: data.programType,
        currentModule: "planner",
      });

      window.localStorage.removeItem(PLANNER_ELEMENTS_STORAGE_KEY);
    } catch {
      let rollbackSucceeded = !snapshotsTaken;

      if (snapshotsTaken) {
        try {
          if (previousStoredContext === null) {
            window.localStorage.removeItem(GLOBAL_CONTEXT_STORAGE_KEY);
          } else {
            window.localStorage.setItem(
              GLOBAL_CONTEXT_STORAGE_KEY,
              previousStoredContext
            );
          }

          if (previousStoredElements === null) {
            window.localStorage.removeItem(PLANNER_ELEMENTS_STORAGE_KEY);
          } else {
            window.localStorage.setItem(
              PLANNER_ELEMENTS_STORAGE_KEY,
              previousStoredElements
            );
          }

          ContextEngine.restore();
          rollbackSucceeded = true;
        } catch {
          rollbackSucceeded = false;
        }
      }

      setResponse(
        rollbackSucceeded
          ? "Não foi possível guardar o novo esquema. O esquema anterior foi mantido. Tente novamente."
          : "Não foi possível guardar o novo esquema nem confirmar a recuperação dos dados anteriores. Recarregue a página antes de continuar."
      );
      return;
    }

    setResponse("✅ Dados guardados. A abrir o Construtor de Esquemas...");

    router.push(destinationWithoutCreatePlanner("/planner"));
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <Sparkles size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Judgy
            </h2>

            <p className="text-sm text-slate-500">
              Como o posso ajudar hoje?
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder="Ex.: Quero criar um esquema"
              className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 outline-none transition focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="rounded-2xl bg-blue-600 px-6 text-white transition hover:bg-blue-700"
          >
            Enviar
          </button>
        </div>

        {response && (
          <div className="mt-6">
            <AssistantResponse message={response} />
          </div>
        )}

        {showSchemaWizard && (
          <div className="mt-6">
            <SchemaWizard
              onComplete={handleSchemaComplete}
              onCancel={() => {
                setShowSchemaWizard(false);
                setResponse("");
                router.replace(destinationWithoutCreatePlanner());
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
