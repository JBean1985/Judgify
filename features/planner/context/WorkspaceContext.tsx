"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Import the canonical ProgramElement type from the shared `types/element.ts`.
import type { ProgramElement as CanonicalProgramElement, ElementType } from "../../../types/element";

// Re-export a planner-compatible `ProgramElement` that keeps runtime-required
// fields non-optional so existing UI and logic remain type-safe without edits.
export type ProgramElement = CanonicalProgramElement & {
  goeGrade: number;
  goeValue: number;
  status: "valid" | "warning" | "invalid";
  notes: string;
};

export interface ManualDeductionItem {
  id: string;
  label: string;
  value: number;
}

export type PcsComponentName =
  | "skatingSkills"
  | "transitions"
  | "performance"
  | "composition";

export interface ManualPCS {
  skatingSkills: number;
  transitions: number;
  performance: number;
  composition: number;
}

type AddProgramElement = {
  id: string;
  name: string;
  type: string;
  baseValue: number;
  code?: string;
  family?: string;
  category?: string;
  rotations?: number;
  goeGrade?: number;
  goeValue?: number;
  notes?: string;
  status?: "valid" | "warning" | "invalid";
};

interface WorkspaceContextValue {
  elements: ProgramElement[];
  deductions: ManualDeductionItem[];
  pcs: ManualPCS;
  addElement: (element: AddProgramElement) => void;
  updateElement: (id: string, data: Partial<ProgramElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (elementId: string) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  clearProgram: () => void;
  addDeduction: (label: string, value: number) => void;
  removeDeduction: (id: string) => void;
  clearDeductions: () => void;
  updatePCS: (component: PcsComponentName, value: number) => void;
  clearPCS: () => void;
}

const WorkspaceContext =
  createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({
  children,
}: WorkspaceProviderProps) {
  const ELEMENTS_STORAGE_KEY = "judgify-planner-elements";
  const DEDUCTIONS_STORAGE_KEY = "judgify-planner-deductions";
  const PCS_STORAGE_KEY = "judgify-planner-pcs";
  const EMPTY_PCS: ManualPCS = {
    skatingSkills: 0,
    transitions: 0,
    performance: 0,
    composition: 0,
  };

  const [elements, setElements] = useState<ProgramElement[]>(() => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    ) {
      return [];
    }

    const stored = window.localStorage.getItem(ELEMENTS_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored) as ProgramElement[];

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [deductions, setDeductions] = useState<ManualDeductionItem[]>(() => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    ) {
      return [];
    }

    const stored = window.localStorage.getItem(DEDUCTIONS_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored) as ManualDeductionItem[];

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item) => {
        const label = String(item?.label ?? "").trim();
        const value = Number(item?.value);

        return (
          typeof item?.id === "string" &&
          item.id.length > 0 &&
          label.length > 0 &&
          Number.isFinite(value) &&
          value > 0
        );
      });
    } catch {
      return [];
    }
  });

  const [pcs, setPCS] = useState<ManualPCS>(() => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    ) {
      return EMPTY_PCS;
    }

    const stored = window.localStorage.getItem(PCS_STORAGE_KEY);

    if (!stored) {
      return EMPTY_PCS;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<ManualPCS>;

      function sanitize(value: unknown): number {
        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
          return 0;
        }

        return Math.min(10, Math.max(0, numericValue));
      }

      return {
        skatingSkills: sanitize(parsed?.skatingSkills),
        transitions: sanitize(parsed?.transitions),
        performance: sanitize(parsed?.performance),
        composition: sanitize(parsed?.composition),
      };
    } catch {
      return EMPTY_PCS;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      return;
    }

    window.localStorage.setItem(
      ELEMENTS_STORAGE_KEY,
      JSON.stringify(elements)
    );
  }, [elements]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    ) {
      return;
    }

    window.localStorage.setItem(
      DEDUCTIONS_STORAGE_KEY,
      JSON.stringify(deductions)
    );
  }, [deductions]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    ) {
      return;
    }

    window.localStorage.setItem(PCS_STORAGE_KEY, JSON.stringify(pcs));
  }, [pcs]);

  function addElement(element: AddProgramElement) {
    const code = element.code ?? element.id.split("-")[0];

    setElements((current) => [
      ...current,
      {
        id: element.id,
        code,
        name: element.name,
        type: (element.type as ElementType) ?? ("spin" as ElementType),
        family: element.family ?? element.name,
        category: (element.category ?? element.type) as ElementType,
        rotations: element.rotations,
        baseValue: element.baseValue,
        goeGrade: element.goeGrade ?? 0,
        goeValue: element.goeValue ?? 0,
        notes: element.notes ?? "",
        status: element.status ?? "valid",
      },
    ]);
  }

  function updateElement(id: string, data: Partial<ProgramElement>) {
    setElements((current) =>
      current.map((element) =>
        element.id === id ? { ...element, ...data } : element
      )
    );
  }

  function removeElement(id: string) {
    setElements((current) =>
      current.filter((element) => element.id !== id)
    );
  }

  function duplicateElement(elementId: string) {
    setElements((current) => {
      const index = current.findIndex(
        (element) => element.id === elementId
      );

      if (index === -1) {
        return current;
      }

      const source = current[index];
      const nextId =
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${source.code}-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`;

      const duplicate: ProgramElement = {
        ...source,
        id: nextId,
      };

      const updated = [...current];
      updated.splice(index + 1, 0, duplicate);

      return updated;
    });
  }

  function moveElementUp(id: string) {
    setElements((current) => {
      const index = current.findIndex((element) => element.id === id);

      if (index <= 0) return current;

      const updated = [...current];

      [updated[index - 1], updated[index]] = [
        updated[index],
        updated[index - 1],
      ];

      return updated;
    });
  }

  function moveElementDown(id: string) {
    setElements((current) => {
      const index = current.findIndex((element) => element.id === id);

      if (index === -1 || index >= current.length - 1) {
        return current;
      }

      const updated = [...current];

      [updated[index + 1], updated[index]] = [
        updated[index],
        updated[index + 1],
      ];

      return updated;
    });
  }

  function clearProgram() {
    setElements([]);
  }

  function addDeduction(label: string, value: number) {
    const normalizedLabel = String(label).trim();
    const normalizedValue = Number(value);

    if (
      normalizedLabel.length === 0 ||
      !Number.isFinite(normalizedValue) ||
      normalizedValue <= 0
    ) {
      return;
    }

    const id =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `deduction-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;

    setDeductions((current) => [
      ...current,
      {
        id,
        label: normalizedLabel,
        value: normalizedValue,
      },
    ]);
  }

  function removeDeduction(id: string) {
    setDeductions((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function clearDeductions() {
    setDeductions([]);
  }

  function updatePCS(component: PcsComponentName, value: number) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    const clampedValue = Math.min(10, Math.max(0, numericValue));

    setPCS((current) => ({
      ...current,
      [component]: clampedValue,
    }));
  }

  function clearPCS() {
    setPCS(EMPTY_PCS);
  }

  const value = useMemo(
    () => ({
      elements,
      deductions,
      pcs,
      addElement,
      updateElement,
      removeElement,
      duplicateElement,
      moveElementUp,
      moveElementDown,
      clearProgram,
      addDeduction,
      removeDeduction,
      clearDeductions,
      updatePCS,
      clearPCS,
    }),
    [elements, deductions, pcs]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace deve ser utilizado dentro de WorkspaceProvider."
    );
  }

  return context;
}