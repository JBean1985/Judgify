"use client";

import { useState } from "react";
import { categories, type CategoryId } from "@/features/planner/rules/categories";
import { disciplines, type DisciplineId } from "@/features/planner/rules/disciplines";
import { programTypes, type ProgramTypeId } from "@/features/planner/rules/programTypes";

export interface SchemaWizardData {
  athlete: string;
  category: CategoryId;
  discipline: DisciplineId;
  programType: ProgramTypeId;
}

interface SchemaWizardProps {
  onComplete: (data: SchemaWizardData) => void;
  onCancel: () => void;
}

export default function SchemaWizard({ onComplete, onCancel }: SchemaWizardProps) {
  const [athlete, setAthlete] = useState("");
  const [category, setCategory] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [programType, setProgramType] = useState("");

  const canContinue =
    athlete.trim() !== "" &&
    category !== "" &&
    discipline !== "" &&
    programType !== "";

  function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canContinue) return;

    onComplete({
      athlete: athlete.trim(),
      category: category as CategoryId,
      discipline: discipline as DisciplineId,
      programType: programType as ProgramTypeId,
    });
  }

  return (
    <form
      onSubmit={handleContinue}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-xl font-semibold text-slate-900">
        🤖 Vamos criar um novo esquema
      </h3>

      <p className="mt-2 text-slate-500">
        Indique os dados base antes de abrir o Construtor de Esquemas.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor="schema-athlete" className="mb-2 block text-sm font-medium">
            Nome da atleta
          </label>

          <input
            id="schema-athlete"
            required
            value={athlete}
            onChange={(e) => setAthlete(e.target.value)}
            placeholder="Ex.: Maria Silva"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="schema-category" className="mb-2 block text-sm font-medium">
            Escalão
          </label>

          <select
            id="schema-category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Selecionar escalão</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="schema-discipline" className="mb-2 block text-sm font-medium">
            Disciplina
          </label>

          <select
            id="schema-discipline"
            required
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Selecionar disciplina</option>
            {disciplines.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="schema-program-type" className="mb-2 block text-sm font-medium">
            Tipo de programa
          </label>

          <select
            id="schema-program-type"
            required
            value={programType}
            onChange={(e) => setProgramType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Selecionar tipo de programa</option>
            {programTypes.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-6 py-3 text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!canContinue}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Abrir Construtor de Esquemas
        </button>
      </div>
    </form>
  );
}
