export type TransferElementType = "jump" | "spin" | "sequence" | "choreographic";

export interface VideoPlannerTransferCall {
  code: string;
  displayName: string;
  elementType: TransferElementType;
  goeGrade?: number;
  notes?: string;
}

export interface VideoPlannerTransferEntry {
  transferId: string;
  markerId: string;
  markerTime: number;
  videoIdentity: string;
  createdAt: string;
  technicalCall: VideoPlannerTransferCall;
  consumedAt?: string;
  plannerElementId?: string;
  consumedOutcome?: "success" | "warning";
}

interface QueueState {
  version: 1;
  entries: VideoPlannerTransferEntry[];
}

const TRANSFER_QUEUE_STORAGE_KEY = "judgify-video-planner-transfer-queue-v1";
const MAX_CODE_LENGTH = 24;
const MAX_NAME_LENGTH = 80;
const MAX_NOTES_LENGTH = 240;

function getStorage(): Storage | null {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return null;
  }

  return window.localStorage;
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function sanitizeIsoDate(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

function sanitizeNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || Number.isNaN(value)) {
    return undefined;
  }

  return value;
}

function sanitizeGoeGrade(value: unknown): number | undefined {
  const numeric = sanitizeNumber(value);

  if (numeric === undefined) {
    return undefined;
  }

  const truncated = Math.trunc(numeric);

  if (truncated < -3 || truncated > 3) {
    return undefined;
  }

  return truncated;
}

function sanitizeElementType(value: unknown): TransferElementType | undefined {
  if (
    value === "jump" ||
    value === "spin" ||
    value === "sequence" ||
    value === "choreographic"
  ) {
    return value;
  }

  return undefined;
}

function sanitizeEntry(raw: unknown): VideoPlannerTransferEntry | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const candidate = raw as Partial<VideoPlannerTransferEntry>;
  const transferId = sanitizeText(candidate.transferId, 120);
  const markerId = sanitizeText(candidate.markerId, 120);
  const videoIdentity = sanitizeText(candidate.videoIdentity, 240);
  const createdAt = sanitizeIsoDate(candidate.createdAt);
  const markerTime = sanitizeNumber(candidate.markerTime);
  const technicalCallRaw = candidate.technicalCall;

  if (
    !transferId ||
    !markerId ||
    !videoIdentity ||
    !createdAt ||
    markerTime === undefined ||
    markerTime < 0 ||
    !technicalCallRaw ||
    typeof technicalCallRaw !== "object"
  ) {
    return null;
  }

  const technicalCall = technicalCallRaw as Partial<VideoPlannerTransferCall>;
  const code = sanitizeText(technicalCall.code, MAX_CODE_LENGTH);
  const displayName = sanitizeText(technicalCall.displayName, MAX_NAME_LENGTH);
  const elementType = sanitizeElementType(technicalCall.elementType);

  if (!code || !displayName || !elementType) {
    return null;
  }

  const consumedAt = sanitizeIsoDate(candidate.consumedAt);
  const plannerElementId = sanitizeText(candidate.plannerElementId, 120);
  const consumedOutcome =
    candidate.consumedOutcome === "warning"
      ? "warning"
      : candidate.consumedOutcome === "success"
        ? "success"
        : undefined;

  return {
    transferId,
    markerId,
    markerTime,
    videoIdentity,
    createdAt,
    technicalCall: {
      code,
      displayName,
      elementType,
      goeGrade: sanitizeGoeGrade(technicalCall.goeGrade),
      notes: sanitizeText(technicalCall.notes, MAX_NOTES_LENGTH) || undefined,
    },
    consumedAt,
    plannerElementId: plannerElementId || undefined,
    consumedOutcome,
  };
}

function readQueueState(): QueueState {
  const storage = getStorage();

  if (!storage) {
    return { version: 1, entries: [] };
  }

  const raw = storage.getItem(TRANSFER_QUEUE_STORAGE_KEY);

  if (!raw) {
    return { version: 1, entries: [] };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<QueueState>;

    if (!Array.isArray(parsed.entries)) {
      return { version: 1, entries: [] };
    }

    const sanitized = parsed.entries
      .map((entry) => sanitizeEntry(entry))
      .filter((entry): entry is VideoPlannerTransferEntry => Boolean(entry));

    const sorted = [...sanitized].sort((a, b) => {
      if (a.markerTime !== b.markerTime) {
        return a.markerTime - b.markerTime;
      }

      return a.createdAt.localeCompare(b.createdAt);
    });

    if (sorted.length !== parsed.entries.length) {
      writeQueueState({ version: 1, entries: sorted });
    }

    return { version: 1, entries: sorted };
  } catch {
    return { version: 1, entries: [] };
  }
}

function writeQueueState(state: QueueState): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(TRANSFER_QUEUE_STORAGE_KEY, JSON.stringify(state));
}

function createTransferId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `transfer-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function enqueueVideoPlannerTransfer(input: {
  markerId: string;
  markerTime: number;
  videoIdentity: string;
  technicalCall: VideoPlannerTransferCall;
}): VideoPlannerTransferEntry {
  const queue = readQueueState();
  const createdAt = new Date().toISOString();

  const entry: VideoPlannerTransferEntry = {
    transferId: createTransferId(),
    markerId: input.markerId.trim(),
    markerTime: Number.isFinite(input.markerTime) && input.markerTime >= 0 ? input.markerTime : 0,
    videoIdentity: input.videoIdentity.trim(),
    createdAt,
    technicalCall: {
      code: sanitizeText(input.technicalCall.code, MAX_CODE_LENGTH),
      displayName: sanitizeText(input.technicalCall.displayName, MAX_NAME_LENGTH),
      elementType: input.technicalCall.elementType,
      goeGrade: sanitizeGoeGrade(input.technicalCall.goeGrade),
      notes: sanitizeText(input.technicalCall.notes, MAX_NOTES_LENGTH) || undefined,
    },
  };

  queue.entries.push(entry);
  queue.entries.sort((a, b) => {
    if (a.markerTime !== b.markerTime) {
      return a.markerTime - b.markerTime;
    }

    return a.createdAt.localeCompare(b.createdAt);
  });

  writeQueueState(queue);

  return entry;
}

export function listPendingVideoPlannerTransfers(): VideoPlannerTransferEntry[] {
  const queue = readQueueState();

  return queue.entries.filter((entry) => !entry.consumedAt);
}

export function consumeVideoPlannerTransfer(
  transferId: string,
  plannerElementId: string,
  foundCatalogueCode: boolean,
): { foundCatalogueCode: boolean } | null {
  const queue = readQueueState();
  const normalizedTransferId = transferId.trim();
  const normalizedPlannerElementId = plannerElementId.trim();

  if (!normalizedTransferId || !normalizedPlannerElementId) {
    return null;
  }

  const now = new Date().toISOString();
  let didUpdate = false;

  const nextEntries: VideoPlannerTransferEntry[] = queue.entries.map((entry) => {
    if (entry.transferId !== normalizedTransferId || entry.consumedAt) {
      return entry;
    }

    didUpdate = true;

    const consumedOutcome: "success" | "warning" = foundCatalogueCode
      ? "success"
      : "warning";

    return {
      ...entry,
      consumedAt: now,
      plannerElementId: normalizedPlannerElementId,
      consumedOutcome,
    };
  });

  if (!didUpdate) {
    return null;
  }

  writeQueueState({
    version: 1,
    entries: nextEntries,
  });

  return { foundCatalogueCode };
}

export const videoPlannerTransferQueueConfig = {
  storageKey: TRANSFER_QUEUE_STORAGE_KEY,
};
