"use client";

import { useState } from "react";

interface SchemaWizardData {
  athlete: string;
  category: string;
  discipline: string;
  programType: "short" | "long";
  ruleProfile: {
    federation: "legacy" | "fpp" | "world-skate";
    season: string;
  };
}

interface SchemaWizardProps {
  onComplete: (data: SchemaWizardData) => void;
}

export default function SchemaWizard({ onComplete }: SchemaWizardProps) {
  const [athlete, setAthlete] = useState("");
  const [federation, setFederation] = useState<
    "legacy" | "fpp" | "world-skate"
  >("legacy");
  const [season, setSeason] = useState("legacy");
  const [category, setCategory] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [programType, setProgramType] = useState<
    "" | "short" | "long"
  >("");

  const canContinue =
    athlete.trim() !== "" &&
    category !== "" &&
    discipline !== "" &&
    programType !== "";

  function handleContinue() {
    if (!canContinue) return;

    onComplete({
      athlete,
      category,
      discipline,
      programType,
      ruleProfile: {
        federation,
        season,
      },
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-lg font-semibold text-slate-900">
        🤖 Vamos criar um novo esquema
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Indique os dados base antes de abrir o Construtor de Esquemas.
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Federacao
          </label>

          <select
            value={federation}
            onChange={(e) =>
              setFederation(
                e.target.value as
                  | "legacy"
                  | "fpp"
                  | "world-skate"
              )
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="legacy">Legacy</option>
            <option value="fpp">FPP</option>
            <option value="world-skate">World Skate</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Epoca
          </label>

          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="legacy">Legacy</option>
            <option value="2026">2026 (rascunho / nao oficial)</option>
          </select>

          {federation === "fpp" && season === "2026" && (
            <p className="mt-1 text-xs text-amber-600">
              Perfil FPP 2026 em rascunho. Nao usar valores como oficiais sem confirmacao de fonte.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Nome da atleta
          </label>

          <input
            value={athlete}
            onChange={(e) => setAthlete(e.target.value)}
            placeholder="Ex.: Maria Silva"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Categoria
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Selecionar</option>
            <option>Benjamins</option>
            <option>Infantis</option>
            <option>Iniciados</option>
            <option>Cadetes</option>
            <option>Juvenis</option>
            <option>Juniores</option>
            <option>Seniores</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Disciplina
          </label>

          <select
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Selecionar</option>
            <option>Livre</option>
            <option>Solo Dance</option>
            <option>Pares</option>
            <option>Precisão</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Tipo de Programa
          </label>

          <select
            value={programType}
            onChange={(e) =>
              setProgramType(
                e.target.value as "" | "short" | "long"
              )
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Selecionar</option>
            <option value="short">Curto</option>
            <option value="long">Longo</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          disabled={!canContinue}
          onClick={handleContinue}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Abrir Construtor de Esquemas
        </button>
      </div>
    </div>
  );
}