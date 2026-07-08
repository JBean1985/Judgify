import { Sparkles } from "lucide-react";

export default function AssistantWelcome() {
  return (
    <div className="py-6 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

        <Sparkles
          size={40}
          className="text-blue-600"
        />

      </div>

      <h1 className="mt-8 text-4xl font-bold">
        Olá! 👋
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">

        Eu sou o Assistente Judgify.

      </p>

      <p className="mx-auto mt-4 max-w-2xl text-slate-500">

        Vou ajudá-lo a construir o melhor esquema possível para a sua atleta.

      </p>

      <div className="mt-10 rounded-xl bg-blue-50 p-6 text-left">

        <h3 className="font-semibold text-blue-700">
          O que vou fazer?
        </h3>

        <ul className="mt-4 space-y-2 text-slate-600">

          <li>✓ Aplicar automaticamente as regras.</li>

          <li>✓ Evitar erros no esquema.</li>

          <li>✓ Calcular a pontuação prevista.</li>

          <li>✓ Sugerir melhorias com IA.</li>

        </ul>

      </div>

    </div>
  );
}