"use client";

import { Trophy } from "lucide-react";

import ActionCard from "./ActionCard";
import { actions } from "./actions";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-8">

        {/* Logo */}

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
          <Trophy size={28} />
        </div>

        {/* Título */}

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Judgify
        </h1>

        <p className="mt-2 text-base text-slate-600">
          Assistente Inteligente de Patinagem Artística
        </p>

        <p className="mt-6 text-center text-slate-500">
          Olá João 👋
          <br />
          Como posso ajudá-lo hoje?
        </p>

        {/* Menu */}

        <div className="mt-8 grid w-full max-w-4xl gap-5 md:grid-cols-2">

          {actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
            />
          ))}

        </div>

        {/* Último trabalho */}

        <div className="mt-10 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold">
                Último trabalho
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ainda não existem programas criados.
              </p>

            </div>

            <button
              className="
                rounded-xl
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              Novo Esquema
            </button>

          </div>

        </div>

        {/* Rodapé */}

        <p className="mt-8 text-xs text-slate-400">
          Judgify • Alpha 0.1.0
        </p>

      </div>
    </main>
  );
}