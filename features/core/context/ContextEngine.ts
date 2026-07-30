import { GlobalContext } from "./types";

const STORAGE_KEY = "judgify-global-context";

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
      !isNonEmptyString(Reflect.get(parsed, "discipline"))
    ) {
      return null;
    }

    const context: GlobalContext = {
      athlete: Reflect.get(parsed, "athlete"),
      category: Reflect.get(parsed, "category"),
      discipline: Reflect.get(parsed, "discipline"),
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

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
}

function removeStoredContext(): void {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export class ContextEngine {
  private static context: GlobalContext = {};

  static get(): GlobalContext {
    return this.context;
  }

  static set(data: Partial<GlobalContext>): void {
    this.context = {
      ...this.context,
      ...data,
    };

    writeStoredContext(this.context);
  }

  static restore(): GlobalContext | null {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      return null;
    }

    let stored: string | null;

    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
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
