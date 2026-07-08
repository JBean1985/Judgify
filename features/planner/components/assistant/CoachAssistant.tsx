"use client";

import { useState } from "react";

import { Button, Card } from "@/shared/components";

const categories = [
  "Benjamins",
  "Infantis",
  "Iniciados",
  "Cadetes",
  "Juvenis",
  "Juniores",
  "Seniores",
];

const disciplines = [
  "Livre",
  "Solo Dance",
  "Pares",
  "Precisão",
];

export default function CoachAssistant() {
  const [athlete, setAthlete] = useState("");
  const [category, setCategory] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [started, setStarted] = useState(false);

  const canContinue =
    athlete.trim() !== "" &&
    category !== "" &&
    discipline !== "";

  if (started) {
    return (
      <Card className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold text-slate-900">
          Esquema iniciado
        </h2>

        <div className="mt-6 space-y-3 text-slate-600">
          <p>
            <strong>Atleta:</strong> {athlete}
          </p>

          <p>
            <strong>Categoria:</strong> {category}
          </p>

          <p>
            <strong>Disciplina:</strong> {discipline}
          </p>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Agora vamos avançar para a construção da Folha Técnica.
        </p>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <div>
        <p className="text-sm font-medium text-blue-600">
          Assistente Judgify
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Criar novo esquema
        </h2>

        <p className="mt-2 text-slate-500">
          Antes de construir a Folha Técnica, indique os dados base do esquema.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Nome da atleta
          </label>

          <input
            value={athlete}
            onChange={(event) => setAthlete(event.target.value)}
            placeholder="Ex: Maria Silva"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Categoria
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
          >
            <option value="">Selecionar categoria</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Disciplina
          </label>

          <select
            value={discipline}
            onChange={(event) => setDiscipline(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
          >
            <option value="">Selecionar disciplina</option>

            {disciplines.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={() => setStarted(true)}
          disabled={!canContinue}
        >
          Continuar
        </Button>
      </div>
    </Card>
  );
}