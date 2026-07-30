"use client";

import { Sparkles } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="py-3 text-center sm:py-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg sm:h-16 sm:w-16">
        <Sparkles size={30} />
      </div>

      <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-3xl">
        Judgify AI
      </h1>

      <p className="mt-2 text-base text-slate-600">
        Inteligência Artificial para Patinagem Artística
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Uma plataforma para treinadores, juízes, atletas e famílias.
      </p>
    </section>
  );
}