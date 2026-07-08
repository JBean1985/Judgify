"use client";

import {
  AlertTriangle,
  Info,
  Lightbulb,
} from "lucide-react";

import { useWorkspace } from "../../context";
import { CoachEngine } from "../../engine/CoachEngine";

export default function CoachPanel() {
  const { elements } = useWorkspace();

  const suggestions = CoachEngine.analyse(elements);

  function getIcon(type: string) {
    switch (type) {
      case "warning":
        return <AlertTriangle size={18} className="text-yellow-600" />;

      case "tip":
        return <Lightbulb size={18} className="text-blue-600" />;

      default:
        return <Info size={18} className="text-slate-500" />;
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold">
          Coach Judgify
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Sugestões automáticas para melhorar o esquema.
        </p>
      </div>

      <div className="space-y-3 p-5">
        {suggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.message}-${index}`}
            className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mt-0.5">
              {getIcon(suggestion.type)}
            </div>

            <p className="text-sm text-slate-700">
              {suggestion.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}