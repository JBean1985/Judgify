export type AssistantStep =
  | "welcome"
  | "category"
  | "program"
  | "goal"
  | "level"
  | "summary"
  | "editor";

export type ProgramCategory =
  | "benjamim"
  | "iniciado"
  | "cadete"
  | "juvenil"
  | "junior"
  | "senior";

export type ProgramType =
  | "short"
  | "free";

export type ProgramGoal =
  | "maximum"
  | "balanced"
  | "safe"
  | "manual";

export type AthleteLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "elite";

export interface AssistantState {
  step: AssistantStep;

  category?: ProgramCategory;

  program?: ProgramType;

  goal?: ProgramGoal;

  level?: AthleteLevel;

  useAI: boolean;

  completedSteps: AssistantStep[];
}