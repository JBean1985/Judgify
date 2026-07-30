export const SUPPORTED_LOCALES = ["pt-PT", "en", "es", "fr", "it"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-PT";
export const FALLBACK_LOCALE: Locale = "en";
export const I18N_STORAGE_KEY = "judgify.locale";
export const LEGACY_I18N_STORAGE_KEY = "judgify-locale";
