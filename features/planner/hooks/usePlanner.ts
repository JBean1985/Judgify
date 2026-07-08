"use client";

import { usePlannerContext } from "../context/PlannerContext";

export function usePlanner() {
  return usePlannerContext();
}