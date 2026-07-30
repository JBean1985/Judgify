"use client";

import { Settings, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { SUPPORTED_LOCALES, useTranslation } from "@/shared/i18n";

import { APPEARANCE_OPTIONS, Appearance } from "./types";
import { useUserSettings } from "./useUserSettings";

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const candidates = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );

  return Array.from(candidates).filter(
    (element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"),
  );
}

export default function SettingsEntryPoint() {
  const dialogTitleId = useId();
  const { locale, setLocale, t } = useTranslation();
  const {
    appearance,
    setAppearance,
    videoPreferences,
    updateVideoPreferences,
  } = useUserSettings();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const appearanceOptions = useMemo(
    () =>
      APPEARANCE_OPTIONS.map((option) => ({
        value: option,
        label: t(`common.settings.appearanceOptions.${option}`),
      })),
    [t],
  );

  const openPanel = () => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      const target = previousFocusRef.current ?? triggerRef.current;
      target?.focus();
      return;
    }

    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const focusableElements = getFocusableElements(panel);
    const firstFocusable = focusableElements[0];

    firstFocusable?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const currentFocusableElements = getFocusableElements(panel);

      if (currentFocusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = currentFocusableElements[0];
      const lastElement = currentFocusableElements[currentFocusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPanel}
        className="focus-ring app-border app-surface app-text-primary inline-flex h-8 items-center gap-2 rounded-md border px-2.5 text-xs font-medium transition hover:opacity-90"
        aria-label={t("common.settings.openAriaLabel")}
        title={t("common.settings.openTooltip")}
      >
        <Settings size={14} aria-hidden="true" />
        <span className="hidden sm:inline">{t("common.settings.title")}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="presentation"
        >
          <button
            type="button"
            className="h-full flex-1 cursor-default bg-black/35"
            aria-label={t("common.settings.closeAriaLabel")}
            onClick={closePanel}
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="app-surface app-text-primary app-border flex h-full w-full max-w-md flex-col border-l shadow-2xl"
          >
            <header className="app-border flex items-center justify-between border-b px-4 py-3">
              <h2 id={dialogTitleId} className="text-base font-semibold">
                {t("common.settings.title")}
              </h2>

              <button
                type="button"
                onClick={closePanel}
                className="focus-ring app-border app-surface-muted app-text-primary rounded-md border p-1.5 transition hover:opacity-90"
                aria-label={t("common.settings.closeAriaLabel")}
                title={t("common.settings.closeTooltip")}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-6 overflow-y-auto px-4 py-4">
              <section aria-labelledby={`${dialogTitleId}-language`}>
                <h3 id={`${dialogTitleId}-language`} className="text-sm font-semibold">
                  {t("common.settings.sections.language")}
                </h3>
                <p className="app-text-muted mt-1 text-xs">
                  {t("common.settings.languageDescription")}
                </p>

                <fieldset className="mt-3 space-y-2" aria-label={t("common.settings.sections.language")}>
                  {SUPPORTED_LOCALES.map((supportedLocale) => (
                    <label
                      key={supportedLocale}
                      className="app-border app-surface-muted flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="judgify-locale"
                        checked={locale === supportedLocale}
                        onChange={() => setLocale(supportedLocale)}
                        className="focus-ring"
                      />
                      <span>{t(`common.languages.${supportedLocale}`)}</span>
                    </label>
                  ))}
                </fieldset>
              </section>

              <section aria-labelledby={`${dialogTitleId}-appearance`}>
                <h3 id={`${dialogTitleId}-appearance`} className="text-sm font-semibold">
                  {t("common.settings.sections.appearance")}
                </h3>

                <fieldset className="mt-3 space-y-2" aria-label={t("common.settings.sections.appearance")}>
                  {appearanceOptions.map((option) => (
                    <label
                      key={option.value}
                      className="app-border app-surface-muted flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="judgify-appearance"
                        checked={appearance === option.value}
                        onChange={() => setAppearance(option.value as Appearance)}
                        className="focus-ring"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </fieldset>
              </section>

              <section aria-labelledby={`${dialogTitleId}-video`}>
                <h3 id={`${dialogTitleId}-video`} className="text-sm font-semibold">
                  {t("common.settings.sections.video")}
                </h3>

                <fieldset className="mt-3 space-y-2" aria-label={t("common.settings.sections.video")}>
                  <label className="app-border app-surface-muted flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={videoPreferences.restoreLastVideoOnOpening}
                      onChange={(event) =>
                        updateVideoPreferences({
                          restoreLastVideoOnOpening: event.target.checked,
                        })
                      }
                      className="focus-ring mt-0.5"
                    />
                    <span>{t("common.settings.video.restoreLastVideo")}</span>
                  </label>

                  <label className="app-border app-surface-muted flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={videoPreferences.confirmBeforeDeletingMarkers}
                      onChange={(event) =>
                        updateVideoPreferences({
                          confirmBeforeDeletingMarkers: event.target.checked,
                        })
                      }
                      className="focus-ring mt-0.5"
                    />
                    <span>{t("common.settings.video.confirmDeleteMarkers")}</span>
                  </label>

                  <label className="app-border app-surface-muted flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={videoPreferences.showKeyboardShortcutHints}
                      onChange={(event) =>
                        updateVideoPreferences({
                          showKeyboardShortcutHints: event.target.checked,
                        })
                      }
                      className="focus-ring mt-0.5"
                    />
                    <span>{t("common.settings.video.showKeyboardShortcutHints")}</span>
                  </label>
                </fieldset>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
