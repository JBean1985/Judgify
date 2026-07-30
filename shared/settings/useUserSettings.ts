"use client";

import { useUserSettingsContext } from "./UserSettingsProvider";

export function useUserSettings() {
  return useUserSettingsContext();
}
