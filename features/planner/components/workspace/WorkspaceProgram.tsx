"use client";

import { Trash2 } from "lucide-react";

import { useWorkspace } from "../../context";

export default function WorkspaceProgram() {
  const {
    elements,
    removeElement,
    clearProgram,
  } = useWorkspace();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Cabeçalho */}

      <div className="flex items-center justify-between border-b border-slate-200 p-5">

        <div>

          <h2 className="text-lg font-semibold">
            Programa
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Elementos do esquema
          </p>

        </div>

        <div className="flex items-center gap-3">

          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            {elements.length} elemento{elements.length !== 1 ? "s" : ""}
          </span>

          {elements.length > 0 && (
            <button
              onClick={clearProgram}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
            >
              Limpar
            </button>
          )}

        </div>

      </div>

      {/* Conteúdo */}

      <div className="p-5">

        {elements.length === 0 ? (

          <div className="flex min-h-[420px] items-center justify-center rounded-xl border-2 border-dashed border-slate-200">

            <div className="text-center">

              <h3 className="text-lg font-medium text-slate-500">
                Ainda não existem elementos.
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Escolha um elemento na Biblioteca para começar.
              </p>

            </div>

          </div>

        ) : (

          <div className="space-y-3">

            {elements.map((element, index) => (

              <div
                key={element.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-blue-400"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>

                  <div>

                    <h3 className="font-medium">
                      {element.name}
                    </h3>

                    <div className="mt-1 flex gap-2">

                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                        {element.type}
                      </span>

                      <span className="text-xs text-slate-400">
                        Valor Base {element.baseValue.toFixed(2)}
                      </span>

                    </div>

                  </div>

                </div>

                <button
                  onClick={() => removeElement(element.id)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}