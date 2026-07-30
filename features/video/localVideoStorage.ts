const DB_NAME = "judgify-video-db";
const DB_VERSION = 2;
const STORE_NAME = "videos";
const MARKERS_STORE_NAME = "video-markers";
const ACTIVE_VIDEO_KEY = "active-video";

export interface StoredLocalVideo {
  blob: Blob;
  fileName: string;
  size: number;
  mimeType: string;
  lastModified: number | null;
}

export interface StoredTimelineMarker {
  id: string;
  time: number;
  label: string;
  type: string;
  technicalCall?: {
    code: string;
    displayName: string;
    elementType: string;
    status: string;
    goeGrade?: number;
    notes?: string;
  };
  technicalTransfer?: {
    status: string;
    transferredAt?: string;
    plannerElementId?: string;
    transferId?: string;
  };
}

interface StoredLocalVideoRecord extends StoredLocalVideo {
  id: string;
}

interface StoredMarkersRecord {
  id: string;
  markers: StoredTimelineMarker[];
}

export interface LocalVideoIdentityParts {
  fileName: string;
  size: number;
  mimeType: string;
  lastModified: number | null;
}

export function buildLocalVideoIdentity(parts: LocalVideoIdentityParts): string {
  const normalizedName = parts.fileName.trim().toLowerCase();
  const normalizedMimeType = parts.mimeType.trim().toLowerCase();
  const normalizedSize = Number.isFinite(parts.size) && parts.size >= 0 ? parts.size : 0;
  const normalizedLastModified =
    typeof parts.lastModified === "number" && Number.isFinite(parts.lastModified)
      ? parts.lastModified
      : -1;

  return [
    encodeURIComponent(normalizedName),
    normalizedSize,
    encodeURIComponent(normalizedMimeType),
    normalizedLastModified,
  ].join("|");
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains(MARKERS_STORE_NAME)) {
        database.createObjectStore(MARKERS_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open IndexedDB."));
    };
  });
}

function runRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      reject(request.error ?? new Error("IndexedDB request failed."));
    };
  });
}

export async function saveActiveVideo(file: File | Blob, fileName?: string): Promise<void> {
  const database = await openDatabase();

  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const maybeFile = file as File;
    const resolvedName =
      fileName ?? (typeof maybeFile.name === "string" ? maybeFile.name : "video-local");
    const resolvedMimeType =
      typeof maybeFile.type === "string" && maybeFile.type.length > 0
        ? maybeFile.type
        : file.type || "application/octet-stream";
    const resolvedLastModified =
      typeof maybeFile.lastModified === "number" && Number.isFinite(maybeFile.lastModified)
        ? maybeFile.lastModified
        : null;

    const record: StoredLocalVideoRecord = {
      id: ACTIVE_VIDEO_KEY,
      blob: file,
      fileName: resolvedName,
      size: file.size,
      mimeType: resolvedMimeType,
      lastModified: resolvedLastModified,
    };

    await runRequest(store.put(record));
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => {
        reject(transaction.error ?? new Error("IndexedDB transaction failed."));
      };
      transaction.onabort = () => {
        reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
      };
    });
  } finally {
    database.close();
  }
}

export async function getActiveVideo(): Promise<StoredLocalVideo | null> {
  const database = await openDatabase();

  try {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const result = await runRequest(store.get(ACTIVE_VIDEO_KEY));

    if (!result || typeof result !== "object") {
      return null;
    }

    const record = result as Partial<StoredLocalVideoRecord>;

    if (!(record.blob instanceof Blob) || typeof record.fileName !== "string") {
      throw new Error("Stored video record is invalid.");
    }

    return {
      blob: record.blob,
      fileName: record.fileName,
      size:
        typeof record.size === "number" && Number.isFinite(record.size) && record.size >= 0
          ? record.size
          : record.blob.size,
      mimeType: typeof record.mimeType === "string" ? record.mimeType : record.blob.type,
      lastModified:
        typeof record.lastModified === "number" && Number.isFinite(record.lastModified)
          ? record.lastModified
          : null,
    };
  } finally {
    database.close();
  }
}

export async function clearActiveVideo(): Promise<void> {
  const database = await openDatabase();

  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await runRequest(store.delete(ACTIVE_VIDEO_KEY));
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => {
        reject(transaction.error ?? new Error("IndexedDB transaction failed."));
      };
      transaction.onabort = () => {
        reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
      };
    });
  } finally {
    database.close();
  }
}

export async function saveMarkersForVideo(
  videoIdentity: string,
  markers: StoredTimelineMarker[],
): Promise<void> {
  const normalizedIdentity = videoIdentity.trim();

  if (!normalizedIdentity) {
    return;
  }

  const database = await openDatabase();

  try {
    const transaction = database.transaction(MARKERS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(MARKERS_STORE_NAME);
    const record: StoredMarkersRecord = {
      id: normalizedIdentity,
      markers,
    };

    await runRequest(store.put(record));
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => {
        reject(transaction.error ?? new Error("IndexedDB transaction failed."));
      };
      transaction.onabort = () => {
        reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
      };
    });
  } finally {
    database.close();
  }
}

export async function getMarkersForVideo(videoIdentity: string): Promise<StoredTimelineMarker[]> {
  const normalizedIdentity = videoIdentity.trim();

  if (!normalizedIdentity) {
    return [];
  }

  const database = await openDatabase();

  try {
    const transaction = database.transaction(MARKERS_STORE_NAME, "readonly");
    const store = transaction.objectStore(MARKERS_STORE_NAME);
    const result = await runRequest(store.get(normalizedIdentity));

    if (!result || typeof result !== "object") {
      return [];
    }

    const record = result as Partial<StoredMarkersRecord>;

    return Array.isArray(record.markers) ? record.markers : [];
  } finally {
    database.close();
  }
}

export async function clearMarkersForVideo(videoIdentity: string): Promise<void> {
  const normalizedIdentity = videoIdentity.trim();

  if (!normalizedIdentity) {
    return;
  }

  const database = await openDatabase();

  try {
    const transaction = database.transaction(MARKERS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(MARKERS_STORE_NAME);

    await runRequest(store.delete(normalizedIdentity));
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => {
        reject(transaction.error ?? new Error("IndexedDB transaction failed."));
      };
      transaction.onabort = () => {
        reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
      };
    });
  } finally {
    database.close();
  }
}

export function isQuotaExceededError(error: unknown): boolean {
  if (!(error instanceof DOMException)) {
    return false;
  }

  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error.code === 22 ||
    error.code === 1014
  );
}

export const localVideoStorageConfig = {
  databaseName: DB_NAME,
  storeName: STORE_NAME,
  markersStoreName: MARKERS_STORE_NAME,
  activeVideoKey: ACTIVE_VIDEO_KEY,
};
