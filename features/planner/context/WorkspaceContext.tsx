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
  addElement: (element: AddProgramElement) => void;
  updateElement: (id: string, data: Partial<ProgramElement>) => void;
  removeElement: (id: string) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  clearProgram: () => void;
}

const WorkspaceContext =
  createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({
  children,
}: WorkspaceProviderProps) {
  const [elements, setElements] = useState<ProgramElement[]>(() => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    ) {
      return [];
    }

    const stored = window.localStorage.getItem(
      "judgify-planner-elements"
    );

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

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      return;
    }

    window.localStorage.setItem(
      "judgify-planner-elements",
      JSON.stringify(elements)
    );
  }, [elements]);

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

  const value = useMemo(
    () => ({
      elements,
      addElement,
      updateElement,
      removeElement,
      moveElementUp,
      moveElementDown,
      clearProgram,
    }),
    [elements]
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