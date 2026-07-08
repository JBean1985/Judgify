"use client";

import { useWorkspace } from "../../../context";

import TechnicalElementCard from "./TechnicalElementCard";

export default function TechnicalSheet() {
  const { elements, clearProgram } = useWorkspace();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Cabeçalho */}

      <div className="flex items-center justify-between border-b border-slate-200 p-5">

        <div>

          <h2 className="text-xl font-semibold">
            Folha Técnica
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Programa em construção
          </p>

        </div>

        <div className="flex items-center gap-3">

          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            {elements.length} elemento{elements.length !== 1 ? "s" : ""}
          </span>

          {elements.length > 0 && (
            <button
              onClick={clearProgram}
              className="
                rounded-lg
                border
                border-red-200
                px-3
                py-2
                text-sm
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              Limpar
            </button>
          )}

        </div>

      </div>

      {/* Conteúdo */}

      <div className="p-5">

        {elements.length === 0 ? (

          <div className="flex min-h-[450px] items-center justify-center rounded-xl border-2 border-dashed border-slate-200">

            <div className="text-center">

              <h3 className="text-lg font-medium text-slate-500">
                A Folha Técnica está vazia
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Adicione elementos através da Biblioteca para começar.
              </p>

            </div>

          </div>

        ) : (

          <div className="space-y-5">

            {elements.map((element, index) => (

              <TechnicalElementCard
                key={element.id}
                element={element}
                index={index}
              />

            ))}

          </div>

        )}

      </div>

    </section>
  );
}