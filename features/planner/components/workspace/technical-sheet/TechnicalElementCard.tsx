"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  ProgramElement,
  useWorkspace,
} from "../../../context";

import { TechnicalEngine } from "../../../engine/TechnicalEngine";

interface TechnicalElementCardProps {
  element: ProgramElement;
  index: number;
}

const goeOptions = [-3, -2, -1, 0, 1, 2, 3];

export default function TechnicalElementCard({
  element,
  index,
}: TechnicalElementCardProps) {
  const {
    elements,
    removeElement,
    moveElementUp,
    moveElementDown,
    updateElement,
  } = useWorkspace();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(element.name);
  const [baseValue, setBaseValue] = useState(
    element.baseValue.toString()
  );

  const isFirst = index === 0;
  const isLast = index === elements.length - 1;

  const elementTotal = element.baseValue + element.goeValue;

  function saveEdit() {
    updateElement(element.id, {
      name,
      baseValue: Number(baseValue) || 0,
    });

    setEditing(false);
  }

  function updateGoe(value: number) {
    const goeValue = TechnicalEngine.getGoeValue(
      element.code,
      value
    );

    updateElement(element.id, {
      goeGrade: value,
      goeValue,
    });
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-400">
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {index + 1}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-lg font-bold">
                {element.code}
              </span>

              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                {element.category === "jump" ? "Salto" : element.category}
              </span>
            </div>

            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            ) : (
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {element.name}
              </h3>
            )}

            <p className="mt-1 text-xs text-slate-500">
              {element.family}
              {element.rotations ? ` • ${element.rotations} rotação` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => moveElementUp(element.id)}
            disabled={isFirst}
            className="rounded-lg p-2 transition hover:bg-slate-100 disabled:opacity-30"
          >
            <ArrowUp size={18} />
          </button>

          <button
            onClick={() => moveElementDown(element.id)}
            disabled={isLast}
            className="rounded-lg p-2 transition hover:bg-slate-100 disabled:opacity-30"
          >
            <ArrowDown size={18} />
          </button>

          {editing ? (
            <>
              <button
                onClick={saveEdit}
                className="rounded-lg p-2 transition hover:bg-green-50 hover:text-green-600"
              >
                <Save size={18} />
              </button>

              <button
                onClick={() => setEditing(false)}
                className="rounded-lg p-2 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg p-2 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <Pencil size={18} />
            </button>
          )}

          <button
            onClick={() => removeElement(element.id)}
            className="rounded-lg p-2 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-500">Valor Base</span>

            {editing ? (
              <input
                type="number"
                step="0.01"
                value={baseValue}
                onChange={(e) => setBaseValue(e.target.value)}
                className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-none focus:border-blue-500"
              />
            ) : (
              <strong>{element.baseValue.toFixed(2)}</strong>
            )}
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-slate-500">GOE</span>

              <strong>
                {element.goeGrade > 0
                  ? `+${element.goeGrade}`
                  : element.goeGrade}
              </strong>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {goeOptions.map((value) => (
                <button
                  key={value}
                  onClick={() => updateGoe(value)}
                  className={
                    element.goeGrade === value
                      ? "rounded-lg bg-blue-600 px-2 py-2 text-sm font-semibold text-white"
                      : "rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-600 hover:border-blue-400"
                  }
                >
                  {value > 0 ? `+${value}` : value}
                </button>
              ))}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Valor GOE: {element.goeValue.toFixed(2)}
            </p>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Total Elemento</span>

            <strong className="text-blue-600">
              {elementTotal.toFixed(2)}
            </strong>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Estado</span>

            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={16} />
              <span>Válido</span>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Observações
          </label>

          <textarea
            rows={4}
            placeholder="Adicionar observações..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-blue-500"
          />
        </div>
      </div>
    </article>
  );
}