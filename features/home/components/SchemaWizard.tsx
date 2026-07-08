"use client";

import { useState } from "react";

interface SchemaWizardData {
  athlete: string;
  category: string;
  discipline: string;
}

interface SchemaWizardProps {
  onComplete: (data: SchemaWizardData) => void;
}

export default function SchemaWizard({ onComplete }: SchemaWizardProps) {
  const [athlete, setAthlete] = useState("");
  const [category, setCategory] = useState("");
  const [discipline, setDiscipline] = useState("");

  const canContinue =
    athlete.trim() !== "" && category !== "" && discipline !== "";

  function handleContinue() {
    if (!canContinue) return;

    onComplete({
      athlete,
      category,
      discipline,
    });
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">
        🤖 Vamos criar um novo esquema
      </h3>

      <p className="mt-2 text-slate-500">
        Indique os dados base antes de abrir o Construtor de Esquemas.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Nome da atleta
          </label>

          <input
            value={athlete}
            onChange={(e) => setAthlete(e.target.value)}
            placeholder="Ex.: Maria Silva"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Categoria
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
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
          <label className="mb-2 block text-sm font-medium">
            Disciplina
          </label>

          <select
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Selecionar</option>
            <option>Livre</option>
            <option>Solo Dance</option>
            <option>Pares</option>
            <option>Precisão</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          disabled={!canContinue}
          onClick={handleContinue}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Abrir Construtor de Esquemas
        </button>
      </div>
    </div>
  );
}