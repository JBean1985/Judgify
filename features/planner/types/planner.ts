import { Program } from "./program";

export interface PlannerState {
  program: Program | null;

  isDirty: boolean;

  isSaving: boolean;

  lastSavedAt?: Date;
}