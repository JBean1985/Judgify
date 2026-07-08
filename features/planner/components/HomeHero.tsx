"use client";

import { Sparkles } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="text-center py-10">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg">

        <Sparkles size={38} />

      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
        Judgify AI
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
        Inteligência Artificial para Patinagem Artística.
      </p>

      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
        Uma plataforma para treinadores, juízes, atletas e famílias.
      </p>

    </section>
  );
}