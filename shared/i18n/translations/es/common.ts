import type { CommonTranslations } from "../../types";

export const esCommon: CommonTranslations = {
  language: "Idioma",
  localeSelectorAriaLabel: "Seleccionar idioma",
  languages: {
    "pt-PT": "Portugues (Portugal)",
    en: "Inglés",
    es: "Español",
    fr: "Francés",
    it: "Italiano",
  },
  actions: {
    continue: "Continuar",
    close: "Cerrar",
  },
  placeholders: {
    inDevelopment: "En desarrollo...",
  },
  status: {
    alpha: "Alpha 0.1",
  },
  settings: {
    title: "Configuración",
    openAriaLabel: "Abrir configuración",
    openTooltip: "Abrir configuración",
    closeAriaLabel: "Cerrar configuración",
    closeTooltip: "Cerrar configuración",
    sections: {
      language: "Idioma",
      appearance: "Apariencia",
      video: "Preferencias de video",
    },
    languageDescription: "Los cambios de idioma se aplican de inmediato.",
    appearanceOptions: {
      system: "Sistema",
      light: "Claro",
      dark: "Oscuro",
    },
    video: {
      restoreLastVideo: "Restaurar el ultimo video al abrir",
      confirmDeleteMarkers: "Confirmar antes de eliminar marcadores",
      showKeyboardShortcutHints: "Mostrar atajos de teclado",
      confirmDeleteSingleMarker: "Eliminar este marcador?",
      confirmDeleteAllMarkers: "Eliminar todos los marcadores?",
    },
  },
};
