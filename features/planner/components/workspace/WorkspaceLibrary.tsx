"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";

import { useWorkspace } from "../../context";
import { jumps, spins, sequences } from "../../data";
import { Jump } from "../../data/jumps";

const rotationLabels: Record<number, string> = {
  1: "Simples",
  2: "Duplo",
  3: "Triplo",
  4: "Quádruplo",
};

function getJumpFamily(jump: Jump) {
  return jump.family;
}

export default function WorkspaceLibrary() {
  const { addElement } = useWorkspace();

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
          className="flex w-full items-center justify-between p-4 font-medium transition hover:bg-slate-50"
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
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold">
          Biblioteca
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Escolha os elementos do esquema.
        </p>
      </div>

      <div className="space-y-4 p-4">
        <Section
          title={`Saltos (${jumpFamilies.length})`}
          open={showJumps}
          toggle={() => setShowJumps(!showJumps)}
        >
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
                <div key={family} className="p-4">
                  <div className="mb-4">
                    <p className="font-semibold text-slate-900">
                      {family}
                    </p>

                    <p className="text-xs text-slate-500">
                      Código {selectedJump.code} • VB{" "}
                      {selectedJump.baseValue.toFixed(2)}
                    </p>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2">
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
                            ? "rounded-xl border border-blue-600 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                            : "rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-blue-400"
                        }
                      >
                        {rotationLabels[jump.rotations]}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => addJump(selectedJump)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div>
                      <p className="font-medium">
                        Adicionar {selectedJump.code}
                      </p>

                      <p className="text-xs text-slate-500">
                        {selectedJump.name} • Valor Base{" "}
                        {selectedJump.baseValue.toFixed(2)}
                      </p>
                    </div>

                    <Plus size={18} className="text-blue-600" />
                  </button>
                </div>
              );
            })}
          </div>
        </Section>

        <Section
          title={`Piruetas (${spins.length})`}
          open={showSpins}
          toggle={() => setShowSpins(!showSpins)}
        >
          {spins.map((spin) => (
            <button
              key={spin.id}
              onClick={() =>
                addSimpleElement(
                  spin.id,
                  spin.code,
                  spin.name,
                  "spin",
                  spin.baseValue
                )
              }
              className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 transition hover:bg-blue-50"
            >
              <div className="text-left">
                <p className="font-medium">{spin.name}</p>

                <p className="text-xs text-slate-500">
                  {spin.code} • VB {spin.baseValue.toFixed(2)}
                </p>
              </div>

              <Plus size={18} className="text-blue-600" />
            </button>
          ))}
        </Section>

        <Section
          title={`Sequências (${sequences.length})`}
          open={showSequences}
          toggle={() => setShowSequences(!showSequences)}
        >
          {sequences.map((sequence) => (
            <button
              key={sequence.id}
              onClick={() =>
                addSimpleElement(
                  sequence.id,
                  sequence.code,
                  sequence.name,
                  "sequence",
                  sequence.baseValue
                )
              }
              className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 transition hover:bg-blue-50"
            >
              <div className="text-left">
                <p className="font-medium">{sequence.name}</p>

                <p className="text-xs text-slate-500">
                  {sequence.code} • VB {sequence.baseValue.toFixed(2)}
                </p>
              </div>

              <Plus size={18} className="text-blue-600" />
            </button>
          ))}
        </Section>
      </div>
    </section>
  );
}