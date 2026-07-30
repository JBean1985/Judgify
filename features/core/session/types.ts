export type ActiveModule = "planner" | "video" | "live" | "competition" | "assistant";

export type RuleProfileFederation =
  | "legacy"
  | "fpp"
  | "world-skate";

export interface RuleProfileSelection {
  federation: RuleProfileFederation;
  season: string;
}

export interface JudgifySession {
  id: string;
  activeModule: ActiveModule;
  createdAt: string;
  updatedAt: string;
  schema?: {
    athlete?: string;
    category?: string;
    discipline?: string;
    programType?: string;
    ruleProfile?: RuleProfileSelection;
  };
  ui?: {
    lastVisitedRoute?: string;
    lastAction?: string;
  };
  modules?: {
    planner?: { lastOpenedAt?: string };
    video?: { lastOpenedAt?: string };
    live?: { lastOpenedAt?: string };
    competition?: { lastOpenedAt?: string };
    assistant?: { lastOpenedAt?: string };
  };
}
