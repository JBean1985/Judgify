import { clearSessionStorage, readSessionFromStorage, writeSessionToStorage } from "./sessionStorage";
import type { ActiveModule, JudgifySession } from "./types";

export class SessionManager {
  private static instance: SessionManager;
  private session: JudgifySession | null = null;

  private constructor() {
    this.session = readSessionFromStorage();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }

    return SessionManager.instance;
  }

  getSession(): JudgifySession | null {
    if (!this.session) {
      this.session = readSessionFromStorage();
    }

    return this.session;
  }

  createSession(initialModule: ActiveModule = "planner"): JudgifySession {
    const now = new Date().toISOString();
    const nextSession: JudgifySession = {
      id: `session-${now}`,
      activeModule: initialModule,
      createdAt: now,
      updatedAt: now,
    };

    this.session = nextSession;
    writeSessionToStorage(this.session);
    return this.session;
  }

  updateSession(partial: Partial<JudgifySession>): JudgifySession | null {
    const current = this.getSession() ?? this.createSession("planner");
    const updated: JudgifySession = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };

    this.session = updated;
    writeSessionToStorage(this.session);
    return this.session;
  }

  setActiveModule(module: ActiveModule): JudgifySession | null {
    return this.updateSession({ activeModule: module });
  }

  clearSession(): void {
    this.session = null;
    clearSessionStorage();
  }
}
