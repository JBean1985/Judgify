import type { JudgifySession } from "./types";

const SESSION_STORAGE_KEY = "judgify-session";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readSessionFromStorage(): JudgifySession | null {
  if (!isBrowser()) {
    return null;
  }

  const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<JudgifySession>;
    return parsed && typeof parsed === "object" ? (parsed as JudgifySession) : null;
  } catch {
    return null;
  }
}

export function writeSessionToStorage(session: JudgifySession): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSessionStorage(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}
