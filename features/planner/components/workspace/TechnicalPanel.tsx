"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { ContextEngine } from "@/features/core/context";

import { useWorkspace } from "../../context";
import { TechnicalEngine } from "../../engine/TechnicalEngine";
import { ValidationEngine } from "../../engine/ValidationEngine";

export default function TechnicalPanel() {
  const { elements } = useWorkspace();

  const context = ContextEngine.get();

  const technical = useMemo(() => {
    return TechnicalEngine.calculate(elements);
  }, [elements]);

  const validation = useMemo(() => {
    return ValidationEngine.validate(
      elements,
      context.category
    );
  }, [elements, context.category]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold">
          Painel Técnico
        </h2>

        <div className="mt-4 flex items-center gap-2">
          <div
            className={
              validation.valid
                ? "h-3 w-3 rounded-full bg-green-500"
                : "h-3 w-3 rounded-full bg-yellow-500"
            }
          />

          <span className="text-sm text-slate-500">
            Motor Técnico Ativo
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex justify-between">
          <span className="text-slate-500">Categoria</span>
          <strong>{context.category ?? "Sem categoria"}</strong>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Elementos</span>
          <strong>{technical.elementsCount}</strong>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Valor Base</span>
          <strong>{technical.baseValue.toFixed(2)}</strong>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">GOE</span>
          <strong>
            {technical.goe > 0
              ? `+${technical.goe.toFixed(2)}`
              : technical.goe.toFixed(2)}
          </strong>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">PCS</span>
          <strong>{technical.pcs.toFixed(2)}</strong>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Deduções</span>
          <strong>{technical.deductions.toFixed(2)}</strong>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>TOTAL</span>

          <span className="text-blue-600">
            {technical.total.toFixed(2)}
          </span>
        </div>

        {validation.valid ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={18}
                className="text-green-600"
              />

              <span className="font-medium text-green-700">
                Esquema válido
              </span>
            </div>

            <p className="mt-2 text-sm text-green-600">
              Não foram encontrados problemas técnicos.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={18}
                className="text-yellow-600"
              />

              <span className="font-medium text-yellow-700">
                Atenção
              </span>
            </div>

            <ul className="mt-3 space-y-2 text-sm text-yellow-700">
              {validation.messages.map((item, index) => (
                <li key={`${item.message}-${index}`}>
                  • {item.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}