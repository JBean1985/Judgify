"use client";

import { Sparkles } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="py-10 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg">
        <Sparkles size={38} />
      </div>

      <h1 className="mt-6 text-4xl font-bold text-slate-900">
        Judgify AI
      </h1>

      <p className="mt-4 text-lg text-slate-600">
        Inteligência Artificial para Patinagem Artística
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Uma plataforma para treinadores, juízes, atletas e famílias.
      </p>

    </section>
  );
}