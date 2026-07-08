"use client";

import { useState } from "react";

import {
  AssistantState,
  AssistantStep,
} from "../types/assistant";

const initialState: AssistantState = {
  step: "welcome",
  useAI: true,
  completedSteps: [],
};

const steps: AssistantStep[] = [
  "welcome",
  "category",
  "program",
  "goal",
  "level",
  "summary",
  "editor",
];

export function useAssistant() {
  const [state, setState] =
    useState<AssistantState>(initialState);

  function update(
    values: Partial<AssistantState>
  ) {
    setState((current) => ({
      ...current,
      ...values,
    }));
  }

  function goTo(
    step: AssistantStep
  ) {
    update({
      step,
    });
  }

  function next() {
    const index =
      steps.indexOf(state.step);

    if (index < steps.length - 1) {
      goTo(steps[index + 1]);
    }
  }

  function previous() {
    const index =
      steps.indexOf(state.step);

    if (index > 0) {
      goTo(steps[index - 1]);
    }
  }

  function reset() {
    setState(initialState);
  }

  return {
    state,

    update,

    next,

    previous,

    reset,

    goTo,
  };
}