"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export interface ProgramElement {
  id: string;
  code: string;
  name: string;
  type: string;
  family: string;
  category: string;
  rotations?: number;
  baseValue: number;
  goeGrade: number;
  goeValue: number;
  notes: string;
  status: "valid" | "warning" | "invalid";
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
  const [elements, setElements] = useState<ProgramElement[]>([]);

  function addElement(element: AddProgramElement) {
    const code = element.code ?? element.id.split("-")[0];

    setElements((current) => [
      ...current,
      {
        ...element,
        code,
        family: element.family ?? element.name,
        category: element.category ?? element.type,
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