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
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  I18N_STORAGE_KEY,
  LEGACY_I18N_STORAGE_KEY,
  Locale,
  SUPPORTED_LOCALES,
} from "./locales";
import { translations } from "./translations";
import type { TranslationKey, TranslationValues } from "./types";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
  formatDateTime: (value: Date | string | number) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

function normalizeLocale(value: string): Locale | null {
  if (isLocale(value)) {
    return value;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "pt" || normalized.startsWith("pt-")) {
    return "pt-PT";
  }

  if (normalized.startsWith("en")) {
    return "en";
  }

  if (normalized.startsWith("es")) {
    return "es";
  }

  if (normalized.startsWith("fr")) {
    return "fr";
  }

  if (normalized.startsWith("it")) {
    return "it";
  }

  return null;
}

function getNestedValue(source: unknown, path: string): string | undefined {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  const segments = path.split(".");
  let current: unknown = source;

  for (const segment of segments) {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, values?: TranslationValues): string {
  if (!values) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, rawKey: string) => {
    const value = values[rawKey];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedLocale =
      window.localStorage.getItem(I18N_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_I18N_STORAGE_KEY);

    const normalizedStoredLocale = storedLocale
      ? normalizeLocale(storedLocale)
      : null;

    if (normalizedStoredLocale) {
      setLocaleState(normalizedStoredLocale);
      return;
    }

    setLocaleState(DEFAULT_LOCALE);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(I18N_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    if (!isLocale(nextLocale)) {
      return;
    }

    setLocaleState(nextLocale);
  }, []);

  const t = useCallback(
    (key: TranslationKey, values?: TranslationValues) => {
      const candidateLocales: Locale[] = [];

      if (!candidateLocales.includes(locale)) {
        candidateLocales.push(locale);
      }

      if (!candidateLocales.includes(FALLBACK_LOCALE)) {
        candidateLocales.push(FALLBACK_LOCALE);
      }

      if (!candidateLocales.includes(DEFAULT_LOCALE)) {
        candidateLocales.push(DEFAULT_LOCALE);
      }

      for (const candidateLocale of candidateLocales) {
        const message = getNestedValue(translations[candidateLocale], key);

        if (typeof message === "string") {
          return interpolate(message, values);
        }
      }

      if (process.env.NODE_ENV !== "production") {
        console.warn(`[i18n] Missing translation key: ${key}`);
      }

      return key;
    },
    [locale],
  );

  const formatDateTime = useCallback(
    (value: Date | string | number) => {
      const date = value instanceof Date ? value : new Date(value);

      if (!Number.isFinite(date.getTime())) {
        return "";
      }

      return new Intl.DateTimeFormat(locale, {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
    },
    [locale],
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      if (!Number.isFinite(value)) {
        return "";
      }

      return new Intl.NumberFormat(locale, options).format(value);
    },
    [locale],
  );

  const contextValue = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      formatDateTime,
      formatNumber,
    }),
    [formatDateTime, formatNumber, locale, setLocale, t],
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18nContext must be used within I18nProvider.");
  }

  return context;
}
