"use client";

import { useAssistant } from "../../hooks/useAssistant";

const categories = [
  {
    id: "benjamim",
    title: "Benjamim",
    description: "Atletas em fase inicial de competição.",
  },
  {
    id: "iniciado",
    title: "Iniciado",
    description: "Primeiras competições com maior exigência técnica.",
  },
  {
    id: "cadete",
    title: "Cadete",
    description: "Maior diversidade de elementos técnicos.",
  },
  {
    id: "juvenil",
    title: "Juvenil",
    description: "Programas mais completos e exigentes.",
  },
  {
    id: "junior",
    title: "Júnior",
    description: "Preparação para alto rendimento.",
  },
  {
    id: "senior",
    title: "Sénior",
    description: "Máxima exigência competitiva.",
  },
];

export default function AssistantCategory() {
  const { state, update } = useAssistant();

  return (
    <div>

      <h2 className="text-3xl font-bold">
        Qual é a categoria da atleta?
      </h2>

      <p className="mt-2 text-slate-500">
        Esta informação permite ao Judgify aplicar automaticamente as regras corretas.
      </p>

      <div className="mt-8 grid gap-4">

        {categories.map((category) => (

          <button
            key={category.id}
            onClick={() =>
              update({
                category: category.id as any,
              })
            }
            className={`
              rounded-xl
              border
              p-5
              text-left
              transition

              ${
                state.category === category.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-300 hover:border-blue-400"
              }
            `}
          >

            <h3 className="font-semibold">
              {category.title}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {category.description}
            </p>

          </button>

        ))}

      </div>

    </div>
  );
}