import { GlobalContext } from "./types";

const STORAGE_KEY = "judgify-global-context";

function readStoredContext(): GlobalContext {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return {};
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {};
  }

  try {
    const parsed = JSON.parse(stored) as GlobalContext;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
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

  static clear(): void {
    this.context = {};
    removeStoredContext();
  }

  static hasContext(): boolean {
    return Object.keys(this.context).length > 0;
  }
}