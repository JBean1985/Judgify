"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { PlannerState } from "../types/planner";
import { Program } from "../types/program";

interface PlannerContextType {
  state: PlannerState;

  setProgram: (program: Program) => void;

  clearProgram: () => void;

  markSaved: () => void;
}

const PlannerContext =
  createContext<PlannerContextType | null>(null);

interface Props {
  children: ReactNode;
}

const initialState: PlannerState = {
  program: null,
  isDirty: false,
  isSaving: false,
};

export function PlannerProvider({
  children,
}: Props) {
  const [state, setState] =
    useState<PlannerState>(initialState);

  function setProgram(program: Program) {
    setState({
      program,
      isDirty: true,
      isSaving: false,
      lastSavedAt: undefined,
    });
  }

  function clearProgram() {
    setState(initialState);
  }

  function markSaved() {
    setState((current) => ({
      ...current,
      isDirty: false,
      lastSavedAt: new Date(),
    }));
  }

  const value = useMemo(
    () => ({
      state,
      setProgram,
      clearProgram,
      markSaved,
    }),
    [state]
  );

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlannerContext() {
  const context = useContext(PlannerContext);

  if (!context) {
    throw new Error(
      "usePlannerContext deve ser utilizado dentro de PlannerProvider."
    );
  }

  return context;
}