export type RuleProfileFederation =
  | "legacy"
  | "fpp"
  | "world-skate";

export interface RuleProfileSelection {
  federation: RuleProfileFederation;
  season: string;
}

export interface GlobalContext {
  athlete?: string;
  category?: string;
  discipline?: string;
  programType?: string;
  ruleProfile?: RuleProfileSelection;
  competition?: string;
  currentModule?: string;
}