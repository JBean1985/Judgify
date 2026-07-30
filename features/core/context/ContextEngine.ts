import { GlobalContext } from "./types";
import {
  ActiveModule,
  SessionManager,
} from "../session";

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

function isActiveModule(value: unknown): value is ActiveModule {
  return (
    value === "planner" ||
    value === "video" ||
    value === "live" ||
    value === "competition" ||
    value === "assistant"
  );
}

function isEmptyContext(context: GlobalContext): boolean {
  return Object.keys(context).length === 0;
}

function mapSessionToContext(): GlobalContext {
  const session = SessionManager.getInstance().getSession();

  if (!session) {
    return {};
  }

  return {
    athlete: session.schema?.athlete,
    category: session.schema?.category,
    discipline: session.schema?.discipline,
    programType: session.schema?.programType,
    ruleProfile: session.schema?.ruleProfile,
    currentModule: session.activeModule,
  };
}

export class ContextEngine {
  private static context: GlobalContext = {};

  static get(): GlobalContext {
    if (isEmptyContext(this.context)) {
      const sessionContext = mapSessionToContext();

      if (!isEmptyContext(sessionContext)) {
        this.context = sessionContext;
      } else {
        this.context = readStoredContext();
      }
    }

    return this.context;
  }

  static set(data: Partial<GlobalContext>): void {
    this.context = {
      ...this.context,
      ...data,
    };

    const manager = SessionManager.getInstance();
    let session = manager.getSession();
    const nextModule = isActiveModule(this.context.currentModule)
      ? this.context.currentModule
      : undefined;

    if (!session) {
      session = manager.createSession(nextModule ?? "planner");
    }

    manager.updateSession({
      schema: {
        ...(session.schema ?? {}),
        athlete: this.context.athlete,
        category: this.context.category,
        discipline: this.context.discipline,
        programType: this.context.programType,
        ruleProfile: this.context.ruleProfile,
      },
      ...(nextModule ? { activeModule: nextModule } : {}),
    });

    writeStoredContext(this.context);
  }

  static clear(): void {
    this.context = {};
    SessionManager.getInstance().clearSession();
    removeStoredContext();
  }

  static hasContext(): boolean {
    return Object.keys(this.context).length > 0;
  }
}