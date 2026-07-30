"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ContextEngine } from "@/features/core/context";
import type { GlobalContext } from "@/features/core/context/types";
import {
  consumeVideoPlannerTransfer,
  listPendingVideoPlannerTransfers,
  type TransferElementType,
  videoPlannerTransferQueueConfig,
} from "@/features/core/context/videoPlannerTransferQueue";
import {
  WorkspaceHeader as ShellHeader,
  WorkspacePanel,
  WorkspaceShell,
  WorkspaceSidebar,
} from "@/shared/components/workspace";
import { useTranslation } from "@/shared/i18n";
import { useWorkspace, WorkspaceProvider } from "../../context";
import { jumps } from "../../data/jumps";
import { sequences } from "../../data/sequences";
import { spins } from "../../data/spins";
import { TechnicalEngine } from "../../engine/TechnicalEngine";

import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceAssistant from "./WorkspaceAssistant";
import WorkspaceLibrary from "./WorkspaceLibrary";
import TechnicalPanel from "./TechnicalPanel";
import CoachPanel from "./CoachPanel";
import TechnicalSheet from "./technical-sheet/TechnicalSheet";
import FloatingActionButton from "./mobile/FloatingActionButton";

function createPlannerElementId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mapTransferTypeToPlannerType(type: TransferElementType): "jump" | "spin" | "sequence" | "choreo" {
  if (type === "jump") {
    return "jump";
  }

  if (type === "spin") {
    return "spin";
  }

  if (type === "sequence") {
    return "sequence";
  }

  return "choreo";
}

function VideoPlannerTransferConsumer() {
  const { addElement } = useWorkspace();

  function resolveCatalogueBaseValue(code: string): {
    foundCatalogueCode: boolean;
    baseValue: number;
  } {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return {
        foundCatalogueCode: false,
        baseValue: 0,
      };
    }

    const jump = jumps.find((item) => item.code.trim().toUpperCase() === normalizedCode);

    if (jump) {
      return {
        foundCatalogueCode: true,
        baseValue: jump.baseValue,
      };
    }

    const spin = spins.find((item) => item.code.trim().toUpperCase() === normalizedCode);

    if (spin) {
      return {
        foundCatalogueCode: true,
        baseValue: spin.baseValue,
      };
    }

    const sequence = sequences.find(
      (item) => item.code.trim().toUpperCase() === normalizedCode,
    );

    if (sequence) {
      return {
        foundCatalogueCode: true,
        baseValue: sequence.baseValue,
      };
    }

    return {
      foundCatalogueCode: false,
      baseValue: 0,
    };
  }

  useEffect(() => {
    const consumePendingTransfers = () => {
      const pending = listPendingVideoPlannerTransfers();

      if (pending.length === 0) {
        return;
      }

      for (const transfer of pending) {
        const plannerElementId = createPlannerElementId(transfer.technicalCall.code || "video");
        const plannerType = mapTransferTypeToPlannerType(transfer.technicalCall.elementType);
        const { foundCatalogueCode, baseValue } = resolveCatalogueBaseValue(
          transfer.technicalCall.code,
        );
        const safeGoeGrade = Number.isFinite(transfer.technicalCall.goeGrade)
          ? Math.max(-3, Math.min(3, Math.trunc(transfer.technicalCall.goeGrade as number)))
          : 0;

        addElement({
          id: plannerElementId,
          code: transfer.technicalCall.code,
          name: transfer.technicalCall.displayName,
          type: plannerType,
          category: plannerType,
          baseValue,
          goeGrade: safeGoeGrade,
          goeValue: TechnicalEngine.getGoeValue(transfer.technicalCall.code, safeGoeGrade),
          notes: transfer.technicalCall.notes ?? "",
          status: foundCatalogueCode ? "valid" : "warning",
        });

        consumeVideoPlannerTransfer(
          transfer.transferId,
          plannerElementId,
          foundCatalogueCode,
        );
      }
    };

    consumePendingTransfers();

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key !== null &&
        event.key !== videoPlannerTransferQueueConfig.storageKey
      ) {
        return;
      }

      consumePendingTransfers();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [addElement]);

  return null;
}

export default function PlannerWorkspace() {
  const { t } = useTranslation();
  const [showLibrary, setShowLibrary] = useState(false);
  const [context, setContext] = useState<GlobalContext>({});

  const hasSchemaContext =
    context.athlete &&
    context.category &&
    context.discipline;

  const activeFederation =
    context.ruleProfile?.federation ?? "legacy";
  const activeSeason =
    context.ruleProfile?.season ?? "legacy";

  const activeRuleProfileLabel =
    activeFederation === "legacy" || activeSeason === "legacy"
      ? t("planner.ruleProfile.legacy")
      : activeFederation === "fpp" && activeSeason === "2026"
        ? `FPP 2026 · ${t("planner.ruleProfile.draft")}`
        : activeFederation === "fpp"
          ? `FPP ${activeSeason}`
          : activeFederation === "world-skate"
            ? `World Skate ${activeSeason}`
            : t("planner.ruleProfile.legacy");

  useEffect(() => {
    setContext(ContextEngine.get());
  }, []);

  if (!hasSchemaContext) {
    return (
      <WorkspaceShell
        header={<ShellHeader title={t("planner.shellTitle")} />}
        sidebar={<WorkspaceSidebar items={[]} collapsed />}
        sidebarWidth={0}
        className="h-auto min-h-screen overflow-visible [&>div]:h-auto [&>div]:min-h-screen [&>div>header]:border-b-0 [&>div>footer]:border-t-0 [&>div>div>aside]:border-r-0"
      >
        <div className="min-h-screen max-w-full overflow-x-hidden">
          <div className="flex min-w-0 flex-col gap-3 px-4 py-4">
            <WorkspaceHeader title={t("planner.workspaceTitle")} />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                {t("planner.emptyState.title")}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {t("planner.emptyState.description")}
              </p>

              <Link
                href="/"
                className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm text-white transition hover:bg-blue-700"
              >
                {t("planner.emptyState.backHome")}
              </Link>
            </div>
          </div>
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceProvider>
      <VideoPlannerTransferConsumer />
      <WorkspaceShell
        header={<ShellHeader title={t("planner.shellTitle")} />}
        sidebar={<WorkspaceSidebar items={[]} collapsed />}
        sidebarWidth={0}
        className="h-auto min-h-screen overflow-visible [&>div]:h-auto [&>div]:min-h-screen [&>div>header]:border-b-0 [&>div>footer]:border-t-0 [&>div>div>aside]:border-r-0"
      >
        <div className="min-h-screen max-w-full overflow-x-hidden">
          <div className="flex min-w-0 flex-col gap-0 px-3 py-1">
            <div className="[&>header]:mb-2 [&>header]:pb-2">
              <WorkspaceHeader title={t("planner.workspaceTitle")} />
            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-2 py-1 shadow-sm">
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="rounded-md bg-slate-50 px-2 py-0.5">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    {t("planner.context.athlete")}
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {context.athlete}
                  </p>
                </div>

                <div className="rounded-md bg-slate-50 px-2 py-0.5">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    {t("planner.context.category")}
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {context.category}
                  </p>
                </div>

                <div className="rounded-md bg-slate-50 px-2 py-0.5">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    {t("planner.context.discipline")}
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {context.discipline}
                  </p>
                </div>

                <div className="rounded-md bg-slate-50 px-2 py-0.5">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    {t("planner.context.program")}
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {context.programType === "short"
                      ? t("planner.programType.short")
                      : context.programType === "long"
                        ? t("planner.programType.long")
                        : t("planner.programType.unknown")}
                  </p>
                </div>

                  <div className="rounded-md bg-slate-50 px-2 py-0.5">
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                      {t("planner.context.rules")}
                    </p>
                    <p
                      className={
                        activeFederation === "fpp" &&
                        activeSeason === "2026"
                          ? "text-xs font-semibold text-amber-700"
                          : "text-xs font-semibold text-slate-900"
                      }
                    >
                      {activeRuleProfileLabel}
                    </p>
                  </div>

              </div>
            </div>

            <div className="hidden min-w-0 w-full max-w-full overflow-x-hidden lg:mt-0.5 lg:grid lg:grid-cols-[minmax(250px,1fr)_minmax(0,3fr)_minmax(280px,1fr)] lg:gap-1">
              <div className="min-h-0 min-w-0 overflow-hidden">
                <WorkspacePanel
                  scrollable={false}
                  className="!border-0 !bg-transparent !shadow-none"
                  contentClassName="!p-0"
                >
                  <div className="h-full min-h-0 overflow-hidden [&>section]:h-full [&>section>div:last-child]:h-full [&>section>div:last-child]:max-h-none">
                    <WorkspaceLibrary />
                  </div>
                </WorkspacePanel>
              </div>

              <div className="min-w-0">
                <WorkspacePanel
                  scrollable={false}
                  className="!border-0 !bg-transparent !shadow-none"
                  contentClassName="!p-0"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="min-h-[60vh] overflow-auto">
                      <TechnicalSheet />
                    </div>

                    <div className="mt-2 min-h-[240px] min-w-0 overflow-auto">
                      <WorkspaceAssistant />
                    </div>
                  </div>
                </WorkspacePanel>
              </div>

              <div className="min-h-0 min-w-0 overflow-hidden">
                <WorkspacePanel
                  scrollable={false}
                  className="!border-0 !bg-transparent !shadow-none"
                  contentClassName="!p-0"
                >
                  <TechnicalPanel />
                </WorkspacePanel>
              </div>
            </div>

            <div className="lg:hidden">
              <WorkspaceAssistant />
            </div>

            <div className="space-y-3 lg:hidden">
              <TechnicalSheet />

              <TechnicalPanel />

              <CoachPanel />
            </div>

            {showLibrary && (
              <div className="fixed inset-0 z-40 flex items-end bg-black/40 lg:hidden">
                <div className="max-h-[80vh] w-full overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{t("planner.library.title")}</h2>

                    <button
                      onClick={() => setShowLibrary(false)}
                      className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
                    >
                      {t("common.actions.close")}
                    </button>
                  </div>

                  <WorkspaceLibrary />
                </div>
              </div>
            )}

            <FloatingActionButton onClick={() => setShowLibrary(true)} />
          </div>
        </div>
      </WorkspaceShell>
    </WorkspaceProvider>
  );
}