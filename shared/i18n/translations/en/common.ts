import type { CommonTranslations } from "../../types";

export const enCommon: CommonTranslations = {
  language: "Language",
  localeSelectorAriaLabel: "Select language",
  languages: {
    "pt-PT": "Portuguese (Portugal)",
    en: "English",
    es: "Spanish",
    fr: "French",
    it: "Italian",
  },
  actions: {
    continue: "Continue",
    close: "Close",
  },
  placeholders: {
    inDevelopment: "In development...",
  },
  status: {
    alpha: "Alpha 0.1",
  },
  settings: {
    title: "Settings",
    openAriaLabel: "Open settings",
    openTooltip: "Open settings",
    closeAriaLabel: "Close settings",
    closeTooltip: "Close settings",
    sections: {
      language: "Language",
      appearance: "Appearance",
      video: "Video preferences",
    },
    languageDescription: "Language changes are applied immediately.",
    appearanceOptions: {
      system: "System",
      light: "Light",
      dark: "Dark",
    },
    video: {
      restoreLastVideo: "Restore last video on opening",
      confirmDeleteMarkers: "Confirm before deleting markers",
      showKeyboardShortcutHints: "Show keyboard shortcut hints",
      confirmDeleteSingleMarker: "Delete this marker?",
      confirmDeleteAllMarkers: "Delete all markers?",
    },
  },
};
