import { GlobalContext } from "./types";
import { GLOBAL_CONTEXT_STORAGE_KEY } from "@/shared/constants/storage";
import { findCategory } from "@/features/planner/rules/categories";
import { findDisciplineByName } from "@/features/planner/rules/disciplines";
import { findProgramTypeByName } from "@/features/planner/rules/programTypes";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseStoredContext(value: string): GlobalContext | null {
  try {
    const parsed: unknown = JSON.parse(value);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !isNonEmptyString(Reflect.get(parsed, "athlete")) ||
      !isNonEmptyString(Reflect.get(parsed, "category")) ||
      !isNonEmptyString(Reflect.get(parsed, "discipline")) ||
      !isNonEmptyString(Reflect.get(parsed, "programType"))
    ) {
      return null;
    }

    const category = findCategory(Reflect.get(parsed, "category"));
    const discipline = findDisciplineByName(Reflect.get(parsed, "discipline"));
    const programType = findProgramTypeByName(Reflect.get(parsed, "programType"));

    if (!category || !discipline || !programType) {
      return null;
    }

    const context: GlobalContext = {
      athlete: Reflect.get(parsed, "athlete"),
      category: category.id,
      discipline: discipline.id,
      programType: programType.id,
    };

    const competition = Reflect.get(parsed, "competition");
    const currentModule = Reflect.get(parsed, "currentModule");

    if (isNonEmptyString(competition)) {
      context.competition = competition;
    }

    if (isNonEmptyString(currentModule)) {
      context.currentModule = currentModule;
    }

    return context;
  } catch {
    return null;
  }
}

function writeStoredContext(context: GlobalContext): void {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return;
  }

  window.localStorage.setItem(GLOBAL_CONTEXT_STORAGE_KEY, JSON.stringify(context));
}

function removeStoredContext(): void {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return;
  }

  window.localStorage.removeItem(GLOBAL_CONTEXT_STORAGE_KEY);
}

export class ContextEngine {
  private static context: GlobalContext = {};

  static get(): GlobalContext {
    return this.context;
  }

  static set(data: Partial<GlobalContext>): void {
    const nextContext = {
      ...this.context,
      ...data,
    };

    writeStoredContext(nextContext);
    this.context = nextContext;
  }

  static restore(): GlobalContext | null {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      return null;
    }

    let stored: string | null;

    try {
      stored = window.localStorage.getItem(GLOBAL_CONTEXT_STORAGE_KEY);
    } catch {
      this.context = {};
      return null;
    }

    if (!stored) {
      this.context = {};
      return null;
    }

    const context = parseStoredContext(stored);

    if (!context) {
      this.context = {};
      return null;
    }

    this.context = context;
    return this.context;
  }

  static clear(): void {
    this.context = {};
    removeStoredContext();
  }

  static hasContext(): boolean {
    return Object.keys(this.context).length > 0;
  }
}
