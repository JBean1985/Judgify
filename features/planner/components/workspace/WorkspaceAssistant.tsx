"use client";

import { useMemo } from "react";

import { ContextEngine } from "@/features/core/context";

import { useWorkspace } from "../../context";
import { CoachEngine } from "../../engine/CoachEngine";
import { TechnicalEngine } from "../../engine/TechnicalEngine";
import { ValidationEngine } from "../../engine/ValidationEngine";

export default function WorkspaceAssistant() {
  const { elements } = useWorkspace();
  const context = ContextEngine.get();

  const technical = useMemo(() => {
    return TechnicalEngine.calculate(elements);
  }, [elements]);

  const coachSuggestions = useMemo(() => {
    return CoachEngine.analyse(elements);
  }, [elements]);

  const validation = useMemo(() => {
    return ValidationEngine.validate(
      elements,
      context.category,
      context.discipline,
      context.programType,
      context.ruleProfile
    );
  }, [
    elements,
    context.category,
    context.discipline,
    context.programType,
    context.ruleProfile,
  ]);

  const warningMessages = validation.messages.filter(
    (item) => item.type === "warning"
  );

  const errorMessages = validation.messages.filter(
    (item) => item.type === "error"
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-2.5 py-1.5">
        <h2 className="text-sm font-semibold text-slate-900">
          Assistente Judgify
        </h2>

        <p className="mt-0.5 text-[11px] text-slate-500">
          Bem-vindo ao Workspace. Vamos construir um novo esquema.
        </p>
      </header>

      <div className="max-h-[260px] space-y-1.5 overflow-y-auto px-2.5 py-1.5 text-[11px]">
        <section className="rounded-md border border-slate-200 bg-slate-50 p-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-slate-700">Validation</h3>
            <span
              className={
                validation.valid
                  ? "rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700"
                  : "rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-700"
              }
            >
              {validation.valid ? "Válido" : "Atenção"}
            </span>
          </div>

          <ul className="mt-1 space-y-1 text-slate-600">
            {validation.messages.length === 0 ? (
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-green-500" />
                <span>Não foram encontrados problemas técnicos.</span>
              </li>
            ) : (
              validation.messages.slice(0, 2).map((message, index) => (
                <li
                  key={`${message.message}-${index}`}
                  className="flex items-start gap-1.5"
                >
                  <span
                    className={
                      message.type === "error"
                        ? "mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500"
                        : "mt-0.5 h-1.5 w-1.5 rounded-full bg-yellow-500"
                    }
                  />
                  <span>{message.message}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-md border border-slate-200 bg-slate-50 p-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-slate-700">
              Sugestoes de treino
            </h3>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {coachSuggestions.length}
            </span>
          </div>

          <p className="mt-1 text-[10px] text-slate-500">
            Otimizacao tecnica (nao substitui regras oficiais).
          </p>

          <ul className="mt-1 space-y-1 text-slate-600">
            {coachSuggestions.length === 0 ? (
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Sem sugestoes de treino no momento.</span>
              </li>
            ) : (
              coachSuggestions.slice(0, 3).map((suggestion, index) => (
                <li
                  key={`${suggestion.message}-${index}`}
                  className="flex items-start gap-1.5"
                >
                  <span
                    className={
                      suggestion.type === "warning"
                        ? "mt-0.5 h-1.5 w-1.5 rounded-full bg-yellow-500"
                        : suggestion.type === "tip"
                          ? "mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500"
                          : "mt-0.5 h-1.5 w-1.5 rounded-full bg-slate-400"
                    }
                  />
                  <span>{suggestion.message}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-md border border-slate-200 bg-slate-50 p-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-slate-700">Suggestions</h3>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {warningMessages.length}
            </span>
          </div>

          <ul className="mt-1 space-y-1 text-slate-600">
            {warningMessages.length === 0 ? (
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Sem sugestões no momento.</span>
              </li>
            ) : (
              warningMessages.slice(0, 2).map((message, index) => (
                <li
                  key={`${message.message}-${index}`}
                  className="flex items-start gap-1.5"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  <span>{message.message}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-md border border-slate-200 bg-slate-50 p-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-slate-700">Warnings</h3>
            <div className="flex items-center gap-1">
              <span className="rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-700">
                W: {warningMessages.length}
              </span>
              <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
                E: {errorMessages.length}
              </span>
            </div>
          </div>

          <ul className="mt-1 space-y-1 text-slate-600">
            {validation.messages.length === 0 ? (
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Sem alertas no momento.</span>
              </li>
            ) : (
              validation.messages.slice(0, 3).map((message, index) => (
                <li
                  key={`${message.message}-${index}`}
                  className="flex items-start gap-1.5"
                >
                  <span
                    className={
                      message.type === "error"
                        ? "mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500"
                        : "mt-0.5 h-1.5 w-1.5 rounded-full bg-yellow-500"
                    }
                  />
                  <span>{message.message}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-md border border-slate-200 bg-slate-50 p-1.5">
          <h3 className="font-medium text-slate-700">Score Summary</h3>

          <div className="mt-1 grid grid-cols-5 gap-1.5">
            <div className="rounded border border-slate-200 bg-white px-1.5 py-1 text-center">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">EL</p>
              <p className="font-semibold tabular-nums text-slate-700">
                {technical.elementsCount}
              </p>
            </div>

            <div className="rounded border border-slate-200 bg-white px-1.5 py-1 text-center">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">BV</p>
              <p className="font-semibold tabular-nums text-slate-700">
                {technical.baseValue.toFixed(2)}
              </p>
            </div>

            <div className="rounded border border-slate-200 bg-white px-1.5 py-1 text-center">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">GOE</p>
              <p className="font-semibold tabular-nums text-slate-700">
                {technical.goe > 0 ? "+" : ""}
                {technical.goe.toFixed(2)}
              </p>
            </div>

            <div className="rounded border border-slate-200 bg-white px-1.5 py-1 text-center">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">DED</p>
              <p className="font-semibold tabular-nums text-slate-700">
                {technical.deductions.toFixed(2)}
              </p>
            </div>

            <div className="rounded border border-slate-200 bg-white px-1.5 py-1 text-center">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">TOT</p>
              <p className="font-semibold tabular-nums text-blue-600">
                {technical.total.toFixed(2)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}