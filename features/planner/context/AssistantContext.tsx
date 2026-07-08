"use client";

import {
  createContext,
  useContext,
  useMemo,
} from "react";

import { useAssistant } from "../hooks/useAssistant";

type AssistantContextType = ReturnType<typeof useAssistant>;

const AssistantContext =
  createContext<AssistantContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export function AssistantProvider({
  children,
}: Props) {
  const assistant = useAssistant();

  const value = useMemo(
    () => assistant,
    [assistant]
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistantContext() {
  const context = useContext(AssistantContext);

  if (!context) {
    throw new Error(
      "useAssistantContext deve ser utilizado dentro de AssistantProvider."
    );
  }

  return context;
}