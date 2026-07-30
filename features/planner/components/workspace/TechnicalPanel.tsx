"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { ContextEngine } from "@/features/core/context";

import { useWorkspace } from "../../context";
import { ScoreEngine } from "../../engine/ScoreEngine";
import { ValidationEngine } from "../../engine/ValidationEngine";

export default function TechnicalPanel() {
  const {
    elements,
    deductions,
    pcs,
    addDeduction,
    removeDeduction,
    clearDeductions,
    updatePCS,
    clearPCS,
  } = useWorkspace();
  const [deductionLabel, setDeductionLabel] = useState("Queda");
  const [deductionValue, setDeductionValue] = useState("");

  const context = ContextEngine.get();

  const score = useMemo(() => {
    return ScoreEngine.calculate(elements, deductions, pcs);
  }, [elements, deductions, pcs]);

  function handlePCSChange(
    component: "skatingSkills" | "transitions" | "performance" | "composition",
    rawValue: string
  ) {
    if (rawValue.trim() === "") {
      updatePCS(component, 0);
      return;
    }

    const numericValue = Number(rawValue);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    updatePCS(component, numericValue);
  }

  const deductionError = useMemo(() => {
    const label = deductionLabel.trim();
    const value = Number(deductionValue);

    if (label.length === 0) {
      return "Selecione ou preencha um rótulo.";
    }

    if (!Number.isFinite(value) || value <= 0) {
      return "Insira um valor positivo.";
    }

    return "";
  }, [deductionLabel, deductionValue]);

  function handleAddDeduction() {
    if (deductionError) {
      return;
    }

    addDeduction(deductionLabel.trim(), Number(deductionValue));
    setDeductionValue("");
  }

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

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-2.5 py-2">
        <h2 className="text-sm font-semibold">
          Painel Técnico
        </h2>

        <div className="mt-1.5 flex items-center gap-1.5">
          <div
            className={
              validation.valid
                ? "h-2 w-2 rounded-full bg-green-500"
                : "h-2 w-2 rounded-full bg-yellow-500"
            }
          />

          <span className="text-xs text-slate-500">
            Motor Técnico Ativo
          </span>
        </div>
      </div>

      <div className="space-y-1.5 px-2.5 py-2 text-xs">
        <div className="rounded-md border border-blue-100 bg-blue-50 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
            TECHNICAL SCORE
          </p>

          <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            <div className="rounded border border-blue-100 bg-white px-2 py-1.5">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Base Value</p>
              <p className="tabular-nums text-sm font-semibold text-slate-900">
                {score.baseValue.toFixed(2)}
              </p>
            </div>

            <div className="rounded border border-blue-100 bg-white px-2 py-1.5">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">GOE</p>
              <p className="tabular-nums text-sm font-semibold text-slate-900">
                {score.goe > 0 ? "+" : ""}
                {score.goe.toFixed(2)}
              </p>
            </div>

            <div className="rounded border border-blue-200 bg-white px-2 py-1.5">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">TES</p>
              <p className="tabular-nums text-sm font-semibold text-blue-700">
                {score.tes.toFixed(2)}
              </p>
            </div>
          </div>

          <hr className="my-2 border-blue-100" />

          <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
            PROGRAM COMPONENTS
          </p>

          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between rounded border border-blue-100 bg-white px-2 py-1">
              <span className="text-[11px] text-slate-700">Skating Skills</span>
              <strong className="tabular-nums text-[11px] text-slate-900">
                {score.pcsBreakdown.skatingSkills.toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center justify-between rounded border border-blue-100 bg-white px-2 py-1">
              <span className="text-[11px] text-slate-700">Transitions</span>
              <strong className="tabular-nums text-[11px] text-slate-900">
                {score.pcsBreakdown.transitions.toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center justify-between rounded border border-blue-100 bg-white px-2 py-1">
              <span className="text-[11px] text-slate-700">Performance</span>
              <strong className="tabular-nums text-[11px] text-slate-900">
                {score.pcsBreakdown.performance.toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center justify-between rounded border border-blue-100 bg-white px-2 py-1">
              <span className="text-[11px] text-slate-700">Composition</span>
              <strong className="tabular-nums text-[11px] text-slate-900">
                {score.pcsBreakdown.composition.toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center justify-between rounded border border-blue-200 bg-white px-2 py-1.5">
              <span className="text-[11px] font-semibold text-slate-700">PCS Total</span>
              <strong className="tabular-nums text-[12px] font-semibold text-blue-700">
                {score.pcs.toFixed(2)}
              </strong>
            </div>
          </div>

          {score.pcs === 0 ? (
            <p className="mt-1.5 text-[10px] text-amber-700">
              PCS ainda não preenchido
            </p>
          ) : null}
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">
              DEDUCTIONS
            </p>

            {score.deductionItems.length > 0 ? (
              <button
                type="button"
                onClick={clearDeductions}
                className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              >
                Limpar
              </button>
            ) : null}
          </div>

          <p className="mt-1 text-[10px] text-slate-500">
            Lista de deduções manuais. As regras oficiais ainda não são aplicadas automaticamente.
          </p>

          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_88px_auto] gap-1.5">
            <select
              value={deductionLabel}
              onChange={(event) => setDeductionLabel(event.target.value)}
              className="h-7 rounded border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none transition focus:border-blue-400"
            >
              <option value="Queda">Queda</option>
              <option value="Tempo">Tempo</option>
              <option value="Costume">Costume</option>
              <option value="Outra">Outra</option>
            </select>

            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={deductionValue}
              onChange={(event) => setDeductionValue(event.target.value)}
              placeholder="0.00"
              className="h-7 rounded border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none transition focus:border-blue-400"
            />

            <button
              type="button"
              onClick={handleAddDeduction}
              disabled={Boolean(deductionError)}
              className="h-7 rounded border border-blue-200 bg-blue-50 px-2 text-[11px] font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Adicionar
            </button>
          </div>

          {deductionError ? (
            <p className="mt-1 text-[10px] text-red-600">
              {deductionError}
            </p>
          ) : null}

          {score.deductionItems.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {score.deductionItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded border border-slate-200 bg-white px-2 py-1"
                >
                  <span className="truncate text-[11px] text-slate-700">
                    {item.label}
                  </span>

                  <div className="ml-2 flex items-center gap-2">
                    <span className="tabular-nums text-[11px] font-semibold text-slate-800">
                      {item.value.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeDeduction(item.id)}
                      className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[10px] text-slate-500">
              Sem deduções
            </p>
          )}

          <div className="mt-2 flex items-center justify-between rounded border border-slate-200 bg-white px-2 py-1">
            <span className="text-[11px] font-semibold text-slate-700">Deductions Total</span>
            <strong className="tabular-nums text-[11px] font-semibold text-slate-900">
              {score.deductions.toFixed(2)}
            </strong>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-700">
              PCS manual
            </p>

            <button
              type="button"
              onClick={clearPCS}
              className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            >
              Limpar PCS
            </button>
          </div>

          <p className="mt-1 text-[10px] text-slate-500">
            PCS manual sem fatores oficiais. A ponderacao World Skate/FPP ainda nao e aplicada.
          </p>

          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <label className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2 py-1">
              <span className="text-[11px] text-slate-700">Skating Skills</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                inputMode="decimal"
                value={pcs.skatingSkills}
                onChange={(event) =>
                  handlePCSChange("skatingSkills", event.target.value)
                }
                className="h-6 w-16 rounded border border-slate-200 px-1.5 text-right text-[11px] text-slate-700 outline-none transition focus:border-blue-400"
              />
            </label>

            <label className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2 py-1">
              <span className="text-[11px] text-slate-700">Transitions</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                inputMode="decimal"
                value={pcs.transitions}
                onChange={(event) =>
                  handlePCSChange("transitions", event.target.value)
                }
                className="h-6 w-16 rounded border border-slate-200 px-1.5 text-right text-[11px] text-slate-700 outline-none transition focus:border-blue-400"
              />
            </label>

            <label className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2 py-1">
              <span className="text-[11px] text-slate-700">Performance</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                inputMode="decimal"
                value={pcs.performance}
                onChange={(event) =>
                  handlePCSChange("performance", event.target.value)
                }
                className="h-6 w-16 rounded border border-slate-200 px-1.5 text-right text-[11px] text-slate-700 outline-none transition focus:border-blue-400"
              />
            </label>

            <label className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2 py-1">
              <span className="text-[11px] text-slate-700">Composition</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                inputMode="decimal"
                value={pcs.composition}
                onChange={(event) =>
                  handlePCSChange("composition", event.target.value)
                }
                className="h-6 w-16 rounded border border-slate-200 px-1.5 text-right text-[11px] text-slate-700 outline-none transition focus:border-blue-400"
              />
            </label>
          </div>

          <div className="mt-2 flex items-center justify-between rounded border border-slate-200 bg-white px-2 py-1">
            <span className="text-[11px] text-slate-600">PCS Total</span>
            <strong className="tabular-nums text-[11px] text-slate-800">
              {score.pcs.toFixed(2)}
            </strong>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border border-slate-100 px-2 py-1">
          <span className="text-slate-500">Categoria</span>
          <strong className="text-slate-800">
            {context.category ?? "Sem categoria"}
          </strong>
        </div>

        <div className="flex items-center justify-between rounded-md border border-slate-100 px-2 py-1">
          <span className="text-slate-500">Elementos</span>
          <strong className="tabular-nums text-slate-800">
            {elements.length}
          </strong>
        </div>

        <div className="rounded-md border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
            FINAL SCORE
          </p>

          <p className="mt-1 text-[10px] text-blue-700/80">
            TES + PCS - Deductions
          </p>

          <p className="mt-1 tabular-nums text-2xl font-bold leading-none text-blue-700">
            {score.finalScore.toFixed(2)}
          </p>
        </div>

        {validation.valid ? (
          <div className="rounded-md border border-green-200 bg-green-50 p-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2
                size={14}
                className="text-green-600"
              />

              <span className="text-xs font-medium text-green-700">
                Esquema válido
              </span>
            </div>

            <p className="mt-1 text-xs text-green-600">
              Não foram encontrados problemas técnicos.
            </p>
          </div>
        ) : (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle
                size={14}
                className="text-yellow-600"
              />

              <span className="text-xs font-medium text-yellow-700">
                Atenção
              </span>
            </div>

            <ul className="mt-1 space-y-1 text-xs text-yellow-700">
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