"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";

import { ContextEngine } from "@/features/core/context";

import { useWorkspace } from "../../context";
import { jumps, spins, sequences } from "../../data";
import { Jump } from "../../data/jumps";
import {
  BuilderObjective,
  ProgramBuilderEngine,
} from "../../engine/ProgramBuilderEngine";

const rotationLabels: Record<number, string> = {
  1: "Simples",
  2: "Duplo",
  3: "Triplo",
  4: "Quádruplo",
};

function getJumpFamily(jump: Jump) {
  return jump.family;
}

function ElementRow({
  code,
  name,
  baseValue,
  onAdd,
}: {
  code: string;
  name: string;
  baseValue: number;
  onAdd: () => void;
}) {
  return (
    <div className="grid grid-cols-[68px_minmax(0,1fr)_72px_36px] items-center gap-2 border-b border-slate-100 px-2 py-1.5 text-sm last:border-b-0">
      <p className="truncate font-mono text-xs font-semibold text-slate-700">
        {code}
      </p>

      <p className="truncate text-xs text-slate-800">{name}</p>

      <p className="text-right text-xs tabular-nums text-slate-600">
        {baseValue.toFixed(2)}
      </p>

      <button
        onClick={onAdd}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-blue-600 transition hover:border-blue-500 hover:bg-blue-50"
        aria-label={`Adicionar ${code}`}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

export default function WorkspaceLibrary() {
  const { addElement, clearProgram, elements } = useWorkspace();
  const context = ContextEngine.get();

  const isFpp2026DraftProfile =
    context.ruleProfile?.federation === "fpp" &&
    context.ruleProfile?.season === "2026";

  const [objective, setObjective] = useState<BuilderObjective>(
    "seguro"
  );
  const [insertMode, setInsertMode] = useState<
    "adicionar" | "substituir"
  >("adicionar");
  const [builderFeedback, setBuilderFeedback] = useState<{
    tone: "success" | "warning";
    message: string;
  } | null>(null);

  const [showJumps, setShowJumps] = useState(true);
  const [showSpins, setShowSpins] = useState(false);
  const [showSequences, setShowSequences] = useState(false);

  const [selectedRotations, setSelectedRotations] = useState<
    Record<string, number>
  >({});

  const jumpFamilies = Array.from(
    new Set(jumps.map((jump) => getJumpFamily(jump)))
  );

  function addJump(jump: Jump) {
    addElement({
      id: `${jump.id}-${Date.now()}-${Math.random()}`,
      code: jump.code,
      name: jump.name,
      type: "jump",
      family: jump.family,
      category: jump.category,
      rotations: jump.rotations,
      baseValue: jump.baseValue,
      goeGrade: 0,
      goeValue: 0,
      notes: "",
      status: "valid",
    });
  }

  function addSimpleElement(
    id: string,
    code: string,
    name: string,
    type: string,
    baseValue: number
  ) {
    addElement({
      id: `${id}-${Date.now()}-${Math.random()}`,
      code,
      name,
      type,
      family: name,
      category: type,
      baseValue,
      goeGrade: 0,
      goeValue: 0,
      notes: "",
      status: "valid",
    });
  }

  function handleGenerateSuggestion() {
    const baseElements =
      insertMode === "substituir" ? [] : elements;

    const generated = ProgramBuilderEngine.buildSuggestion({
      category: context.category,
      discipline: context.discipline,
      programType: context.programType,
      ruleProfile: context.ruleProfile,
      objective,
      existingElements: baseElements,
    });

    if (insertMode === "substituir") {
      clearProgram();
    }

    generated.elements.forEach((element, index) => {
      addElement({
        id: `${element.code}-${Date.now()}-${index}-${Math.random()}`,
        code: element.code,
        name: element.name,
        type: element.type,
        family: element.family,
        category: element.category,
        rotations: element.rotations,
        baseValue: element.baseValue,
        goeGrade: 0,
        goeValue: 0,
        notes: "",
        status: "valid",
      });
    });

    if (generated.addedCount === 0) {
      setBuilderFeedback({
        tone: "warning",
        message:
          "Não foram adicionados mais elementos porque o programa já atingiu os limites da categoria.",
      });
      return;
    }

    if (
      generated.stopReason !== "none" ||
      generated.addedCount < generated.requestedCount
    ) {
      setBuilderFeedback({
        tone: "warning",
        message: `Foram adicionados ${generated.addedCount} elementos. Alguns limites da categoria já foram atingidos.`,
      });
      return;
    }

    setBuilderFeedback({
      tone: "success",
      message: `Foram adicionados ${generated.addedCount} elementos.`,
    });
  }

  function Section({
    title,
    open,
    toggle,
    children,
  }: {
    title: string;
    open: boolean;
    toggle: () => void;
    children: React.ReactNode;
  }) {
    return (
      <div className="rounded-xl border border-slate-200">
        <button
          onClick={toggle}
          className="flex w-full items-center justify-between px-2 py-2 text-sm font-medium transition hover:bg-slate-50"
        >
          <span>{title}</span>
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {open && (
          <div className="border-t border-slate-200">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-3">
        <h2 className="text-base font-semibold">Biblioteca</h2>

        <p className="mt-1 text-xs text-slate-500">
          Escolha os elementos do esquema.
        </p>
      </div>

      <div className="max-h-[420px] space-y-2 overflow-y-auto p-3">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              Gerar sugestao de treino
            </h3>

            <div className="flex items-center gap-1.5">
              <select
                value={objective}
                onChange={(event) =>
                  setObjective(
                    event.target.value as BuilderObjective
                  )
                }
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
              >
                <option value="seguro">Seguro</option>
                <option value="competitivo">Competitivo</option>
                <option value="elite">Elite</option>
              </select>

              <select
                value={insertMode}
                onChange={(event) =>
                  setInsertMode(
                    event.target
                      .value as "adicionar" | "substituir"
                  )
                }
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
              >
                <option value="adicionar">Adicionar</option>
                <option value="substituir">Substituir</option>
              </select>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-slate-500">
            Sugestao de treino. Validar sempre com regras oficiais FPP/World Skate.
          </p>

          {isFpp2026DraftProfile && (
            <p className="mt-1 text-[11px] text-amber-700">
              Perfil FPP 2026 em rascunho. As regras oficiais ainda nao estao confirmadas.
            </p>
          )}

          <button
            type="button"
            onClick={handleGenerateSuggestion}
            className="mt-2 w-full rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
          >
            Gerar programa base
          </button>

          {builderFeedback && (
            <p
              className={
                builderFeedback.tone === "success"
                  ? "mt-1 text-[11px] text-green-700"
                  : "mt-1 text-[11px] text-amber-700"
              }
            >
              {builderFeedback.message}
            </p>
          )}
        </section>

        <Section
          title={`Saltos (${jumpFamilies.length})`}
          open={showJumps}
          toggle={() => setShowJumps(!showJumps)}
        >
          <div className="grid grid-cols-[68px_minmax(0,1fr)_72px_36px] gap-2 border-b border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Código</span>
            <span>Elemento</span>
            <span className="text-right">VB</span>
            <span className="text-center">+</span>
          </div>

          <div className="divide-y divide-slate-100">
            {jumpFamilies.map((family) => {
              const familyJumps = jumps.filter(
                (jump) => getJumpFamily(jump) === family
              );

              const selectedRotation =
                selectedRotations[family] ??
                familyJumps[0]?.rotations;

              const selectedJump = familyJumps.find(
                (jump) => jump.rotations === selectedRotation
              );

              if (!selectedJump) return null;

              return (
                <div key={family} className="px-2 py-2">
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-slate-900">
                      {family}
                    </p>
                  </div>

                  <div className="mb-2 flex flex-wrap gap-1">
                    {familyJumps.map((jump) => (
                      <button
                        key={jump.id}
                        onClick={() =>
                          setSelectedRotations((current) => ({
                            ...current,
                            [family]: jump.rotations,
                          }))
                        }
                        className={
                          selectedRotation === jump.rotations
                            ? "rounded-md border border-blue-600 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700"
                            : "rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-600 transition hover:border-blue-400"
                        }
                      >
                        {rotationLabels[jump.rotations]}
                      </button>
                    ))}
                  </div>

                  <ElementRow
                    code={selectedJump.code}
                    name={selectedJump.name}
                    baseValue={selectedJump.baseValue}
                    onAdd={() => addJump(selectedJump)}
                  />
                </div>
              );
            })}
          </div>
        </Section>

        <Section
          title={`Piões (${spins.length})`}
          open={showSpins}
          toggle={() => setShowSpins(!showSpins)}
        >
          <div className="grid grid-cols-[68px_minmax(0,1fr)_72px_36px] gap-2 border-b border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Código</span>
            <span>Elemento</span>
            <span className="text-right">VB</span>
            <span className="text-center">+</span>
          </div>

          <div>
            {spins.map((spin) => (
              <ElementRow
                key={spin.id}
                code={spin.code}
                name={spin.name}
                baseValue={spin.baseValue}
                onAdd={() =>
                  addSimpleElement(
                    spin.id,
                    spin.code,
                    spin.name,
                    "spin",
                    spin.baseValue
                  )
                }
              />
            ))}
          </div>
        </Section>

        <Section
          title={`Sequências (${sequences.length})`}
          open={showSequences}
          toggle={() => setShowSequences(!showSequences)}
        >
          <div className="grid grid-cols-[68px_minmax(0,1fr)_72px_36px] gap-2 border-b border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Código</span>
            <span>Elemento</span>
            <span className="text-right">VB</span>
            <span className="text-center">+</span>
          </div>

          <div>
            {sequences.map((sequence) => (
              <ElementRow
                key={sequence.id}
                code={sequence.code}
                name={sequence.name}
                baseValue={sequence.baseValue}
                onAdd={() =>
                  addSimpleElement(
                    sequence.id,
                    sequence.code,
                    sequence.name,
                    "sequence",
                    sequence.baseValue
                  )
                }
              />
            ))}
          </div>
        </Section>
      </div>
    </section>
  );
}