export const APPEARANCE_OPTIONS = ["system", "light", "dark"] as const;

export type Appearance = (typeof APPEARANCE_OPTIONS)[number];

export interface VideoPreferences {
  restoreLastVideoOnOpening: boolean;
  confirmBeforeDeletingMarkers: boolean;
  showKeyboardShortcutHints: boolean;
}

export interface UserSettingsState {
  appearance: Appearance;
  videoPreferences: VideoPreferences;
}

export const DEFAULT_VIDEO_PREFERENCES: VideoPreferences = {
  // Current behavior already restores the last local video when available.
  restoreLastVideoOnOpening: true,
  // Current behavior deletes markers immediately.
  confirmBeforeDeletingMarkers: false,
  // Current behavior shows keyboard shortcut hints in the status bar.
  showKeyboardShortcutHints: true,
};

export const DEFAULT_APPEARANCE: Appearance = "system";
