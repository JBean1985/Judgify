"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  APPEARANCE_OPTIONS,
  Appearance,
  DEFAULT_APPEARANCE,
  DEFAULT_VIDEO_PREFERENCES,
  VideoPreferences,
} from "./types";

const APPEARANCE_STORAGE_KEY = "judgify.appearance";
const VIDEO_PREFERENCES_STORAGE_KEY = "judgify.videoPreferences";

type ResolvedAppearance = "light" | "dark";

interface UserSettingsContextValue {
  appearance: Appearance;
  resolvedAppearance: ResolvedAppearance;
  setAppearance: (appearance: Appearance) => void;
  videoPreferences: VideoPreferences;
  updateVideoPreferences: (updates: Partial<VideoPreferences>) => void;
}

const UserSettingsContext = createContext<UserSettingsContextValue | null>(null);

function isAppearance(value: string): value is Appearance {
  return APPEARANCE_OPTIONS.includes(value as Appearance);
}

function sanitizeVideoPreferences(value: unknown): VideoPreferences {
  if (!value || typeof value !== "object") {
    return DEFAULT_VIDEO_PREFERENCES;
  }

  const candidate = value as Partial<VideoPreferences>;

  return {
    restoreLastVideoOnOpening:
      typeof candidate.restoreLastVideoOnOpening === "boolean"
        ? candidate.restoreLastVideoOnOpening
        : DEFAULT_VIDEO_PREFERENCES.restoreLastVideoOnOpening,
    confirmBeforeDeletingMarkers:
      typeof candidate.confirmBeforeDeletingMarkers === "boolean"
        ? candidate.confirmBeforeDeletingMarkers
        : DEFAULT_VIDEO_PREFERENCES.confirmBeforeDeletingMarkers,
    showKeyboardShortcutHints:
      typeof candidate.showKeyboardShortcutHints === "boolean"
        ? candidate.showKeyboardShortcutHints
        : DEFAULT_VIDEO_PREFERENCES.showKeyboardShortcutHints,
  };
}

function resolveAppearance(
  appearance: Appearance,
  prefersDark: boolean,
): ResolvedAppearance {
  if (appearance === "system") {
    return prefersDark ? "dark" : "light";
  }

  return appearance;
}

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>(DEFAULT_APPEARANCE);
  const [resolvedAppearance, setResolvedAppearance] = useState<ResolvedAppearance>("light");
  const [videoPreferences, setVideoPreferences] = useState<VideoPreferences>(
    DEFAULT_VIDEO_PREFERENCES,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedAppearance = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);

    if (storedAppearance && isAppearance(storedAppearance)) {
      setAppearanceState(storedAppearance);
    }

    const storedVideoPreferences = window.localStorage.getItem(
      VIDEO_PREFERENCES_STORAGE_KEY,
    );

    if (!storedVideoPreferences) {
      setVideoPreferences(DEFAULT_VIDEO_PREFERENCES);
      return;
    }

    try {
      const parsedPreferences = JSON.parse(storedVideoPreferences);
      setVideoPreferences(sanitizeVideoPreferences(parsedPreferences));
    } catch {
      setVideoPreferences(DEFAULT_VIDEO_PREFERENCES);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
  }, [appearance]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      VIDEO_PREFERENCES_STORAGE_KEY,
      JSON.stringify(videoPreferences),
    );
  }, [videoPreferences]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const syncResolvedAppearance = () => {
      setResolvedAppearance(resolveAppearance(appearance, mediaQuery.matches));
    };

    syncResolvedAppearance();
    mediaQuery.addEventListener("change", syncResolvedAppearance);

    return () => {
      mediaQuery.removeEventListener("change", syncResolvedAppearance);
    };
  }, [appearance]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedAppearance;
    document.documentElement.style.colorScheme = resolvedAppearance;
  }, [resolvedAppearance]);

  const setAppearance = useCallback((nextAppearance: Appearance) => {
    if (!isAppearance(nextAppearance)) {
      return;
    }

    setAppearanceState(nextAppearance);
  }, []);

  const updateVideoPreferences = useCallback(
    (updates: Partial<VideoPreferences>) => {
      setVideoPreferences((previous) =>
        sanitizeVideoPreferences({
          ...previous,
          ...updates,
        }),
      );
    },
    [],
  );

  const value = useMemo<UserSettingsContextValue>(
    () => ({
      appearance,
      resolvedAppearance,
      setAppearance,
      videoPreferences,
      updateVideoPreferences,
    }),
    [appearance, resolvedAppearance, setAppearance, videoPreferences, updateVideoPreferences],
  );

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettingsContext() {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error("useUserSettingsContext must be used within UserSettingsProvider");
  }

  return context;
}
