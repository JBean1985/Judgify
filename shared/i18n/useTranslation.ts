"use client";

import { useI18nContext } from "./I18nProvider";

export function useTranslation() {
  return useI18nContext();
}
