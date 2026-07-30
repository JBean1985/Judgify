"use client";

import {
  ChangeEvent,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  WorkspaceHeader,
  WorkspacePanel,
  WorkspaceShell,
  WorkspaceSidebar,
  WorkspaceStatusBar,
} from "@/shared/components/workspace";
import {
  useTranslation,
} from "@/shared/i18n";
import { useUserSettings } from "@/shared/settings";
import {
  buildLocalVideoIdentity,
  clearActiveVideo,
  clearMarkersForVideo,
  getActiveVideo,
  getMarkersForVideo,
  isQuotaExceededError,
  saveActiveVideo,
  saveMarkersForVideo,
  StoredTimelineMarker,
} from "@/features/video/localVideoStorage";
import {
  enqueueVideoPlannerTransfer,
  TransferElementType,
} from "@/features/core/context/videoPlannerTransferQueue";
import { jumps } from "@/features/planner/data/jumps";
import { sequences } from "@/features/planner/data/sequences";
import { spins } from "@/features/planner/data/spins";

const DEFAULT_FRAME_RATE = 30;
// Frame stepping currently uses a fixed approximation.
// We can use exact frame metadata from the source video in a future sprint.
const FRAME_STEP_SECONDS = 1 / DEFAULT_FRAME_RATE;

const PLAYBACK_SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2] as const;

type MarkerType = "jump" | "spin" | "sequence" | "fall" | "note";
type TechnicalElementType =
  | "jump"
  | "spin"
  | "sequence"
  | "choreographic"
  | "fall"
  | "note";
type TechnicalCallStatus = "pending" | "confirmed" | "invalid";

interface MarkerTechnicalCall {
  code: string;
  displayName: string;
  elementType: TechnicalElementType;
  status: TechnicalCallStatus;
  goeGrade?: number;
  notes?: string;
}

type MarkerTransferStatus = "sent" | "sent_warning";

interface MarkerTechnicalTransfer {
  status: MarkerTransferStatus;
  transferredAt: string;
  transferId: string;
  plannerElementId?: string;
}

interface TechnicalCallPreset {
  id: string;
  code: string;
  displayName: string;
  elementType: TechnicalElementType;
}

interface TimelineMarker {
  id: string;
  time: number;
  label: string;
  type: MarkerType;
  technicalCall?: MarkerTechnicalCall;
  technicalTransfer?: MarkerTechnicalTransfer;
}

const MARKER_ACTIVE_TOLERANCE_SECONDS = 0.5;

const ACCEPTED_VIDEO_EXTENSIONS = [
  ".mp4",
  ".mov",
  ".m4v",
  ".webm",
  ".ogg",
  ".ogv",
  ".mkv",
] as const;

const SUPPORTED_MARKER_TYPES: MarkerType[] = [
  "jump",
  "spin",
  "sequence",
  "fall",
  "note",
];
const SUPPORTED_TECHNICAL_ELEMENT_TYPES: TechnicalElementType[] = [
  "jump",
  "spin",
  "sequence",
  "choreographic",
  "fall",
  "note",
];
const SUPPORTED_TECHNICAL_STATUSES: TechnicalCallStatus[] = [
  "pending",
  "confirmed",
  "invalid",
];
const SUPPORTED_TRANSFERABLE_ELEMENT_TYPES: TransferElementType[] = [
  "jump",
  "spin",
  "sequence",
  "choreographic",
];
const MARKER_PERSIST_DEBOUNCE_MS = 250;
const MIN_TIMELINE_ZOOM = 1;
const MAX_TIMELINE_ZOOM = 10;
const DEFAULT_TIMELINE_ZOOM = 1;
const TIMELINE_ZOOM_STEP = 0.5;
const TIMELINE_ZOOM_STORAGE_KEY = "judgify-video-timeline-zoom-v1";

const TIMELINE_TICK_STEPS_SECONDS = [
  0.5,
  1,
  2,
  5,
  10,
  15,
  30,
  60,
  120,
  300,
  600,
] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const rounded = Math.floor(seconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const secs = rounded % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

function clampTime(time: number, duration: number): number {
  if (!Number.isFinite(time) || time < 0) {
    return 0;
  }

  if (!Number.isFinite(duration) || duration <= 0) {
    return time;
  }

  return Math.max(0, Math.min(time, duration));
}

function clampTimelineZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) {
    return DEFAULT_TIMELINE_ZOOM;
  }

  return Math.max(MIN_TIMELINE_ZOOM, Math.min(zoom, MAX_TIMELINE_ZOOM));
}

function getTimelineTickStep(durationSeconds: number, pixelsPerSecond: number): number {
  if (
    !Number.isFinite(durationSeconds) ||
    durationSeconds <= 0 ||
    !Number.isFinite(pixelsPerSecond) ||
    pixelsPerSecond <= 0
  ) {
    return 1;
  }

  for (const step of TIMELINE_TICK_STEPS_SECONDS) {
    if (step * pixelsPerSecond >= 40) {
      return step;
    }
  }

  return TIMELINE_TICK_STEPS_SECONDS[TIMELINE_TICK_STEPS_SECONDS.length - 1];
}

function createMarkerId(existingIds: Set<string>): string {
  const randomId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `m-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  if (!existingIds.has(randomId)) {
    return randomId;
  }

  let candidate = randomId;

  while (existingIds.has(candidate)) {
    candidate = `m-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  return candidate;
}

function markerTypeToTechnicalElementType(markerType: MarkerType): TechnicalElementType {
  if (markerType === "jump" || markerType === "spin" || markerType === "sequence") {
    return markerType;
  }

  if (markerType === "fall") {
    return "fall";
  }

  return "note";
}

function sanitizeGoeGrade(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || Number.isNaN(value)) {
    return undefined;
  }

  const rounded = Math.trunc(value);

  if (rounded < -3 || rounded > 3) {
    return undefined;
  }

  return rounded;
}

function sanitizeTechnicalCall(callRaw: unknown): MarkerTechnicalCall | undefined {
  if (!callRaw || typeof callRaw !== "object") {
    return undefined;
  }

  const call = callRaw as Partial<MarkerTechnicalCall>;
  const elementTypeRaw = call.elementType;
  const statusRaw = call.status;

  if (!SUPPORTED_TECHNICAL_ELEMENT_TYPES.includes(elementTypeRaw as TechnicalElementType)) {
    return undefined;
  }

  if (!SUPPORTED_TECHNICAL_STATUSES.includes(statusRaw as TechnicalCallStatus)) {
    return undefined;
  }

  const code = typeof call.code === "string" ? call.code.trim().slice(0, 24) : "";
  const displayName =
    typeof call.displayName === "string" ? call.displayName.trim().slice(0, 80) : "";
  const notesRaw = typeof call.notes === "string" ? call.notes.trim() : "";
  const goeGrade = sanitizeGoeGrade(call.goeGrade);

  return {
    code,
    displayName,
    elementType: elementTypeRaw as TechnicalElementType,
    status: statusRaw as TechnicalCallStatus,
    goeGrade,
    notes: notesRaw ? notesRaw.slice(0, 240) : undefined,
  };
}

function sanitizeIsoTimestamp(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

function sanitizeTechnicalTransfer(value: unknown): MarkerTechnicalTransfer | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const transfer = value as Partial<MarkerTechnicalTransfer>;
  const status = transfer.status;
  const transferredAt = sanitizeIsoTimestamp(transfer.transferredAt);
  const transferId =
    typeof transfer.transferId === "string" ? transfer.transferId.trim().slice(0, 120) : "";

  if ((status !== "sent" && status !== "sent_warning") || !transferredAt || !transferId) {
    return undefined;
  }

  const plannerElementId =
    typeof transfer.plannerElementId === "string"
      ? transfer.plannerElementId.trim().slice(0, 120)
      : "";

  return {
    status,
    transferredAt,
    transferId,
    plannerElementId: plannerElementId || undefined,
  };
}

function isTransferableTechnicalCall(call: MarkerTechnicalCall | undefined): call is MarkerTechnicalCall {
  if (!call) {
    return false;
  }

  if (call.status !== "confirmed") {
    return false;
  }

  if (!SUPPORTED_TRANSFERABLE_ELEMENT_TYPES.includes(call.elementType as TransferElementType)) {
    return false;
  }

  return call.code.trim().length > 0 && call.displayName.trim().length > 0;
}

function sanitizeStoredMarkers(markersRaw: StoredTimelineMarker[]): {
  markers: TimelineMarker[];
  hadInvalidEntries: boolean;
} {
  const validTypes = new Set<MarkerType>(SUPPORTED_MARKER_TYPES);
  const uniqueIds = new Set<string>();
  const sanitized: TimelineMarker[] = [];
  let hadInvalidEntries = false;

  for (const marker of markersRaw) {
    const id = typeof marker?.id === "string" ? marker.id.trim() : "";
    const labelRaw = typeof marker?.label === "string" ? marker.label : "";
    const typeRaw = typeof marker?.type === "string" ? marker.type : "";
    const timeRaw = marker?.time;
    const technicalCallRaw = marker?.technicalCall;
    const technicalTransferRaw = marker?.technicalTransfer;

    if (!id || uniqueIds.has(id)) {
      hadInvalidEntries = true;
      continue;
    }

    if (typeof timeRaw !== "number" || !Number.isFinite(timeRaw) || timeRaw < 0) {
      hadInvalidEntries = true;
      continue;
    }

    if (!validTypes.has(typeRaw as MarkerType)) {
      hadInvalidEntries = true;
      continue;
    }

    uniqueIds.add(id);

    const sanitizedTechnicalCall =
      technicalCallRaw === undefined
        ? undefined
        : sanitizeTechnicalCall(technicalCallRaw);

    if (technicalCallRaw !== undefined && !sanitizedTechnicalCall) {
      hadInvalidEntries = true;
    }

    const sanitizedTechnicalTransfer =
      technicalTransferRaw === undefined
        ? undefined
        : sanitizeTechnicalTransfer(technicalTransferRaw);

    if (technicalTransferRaw !== undefined && !sanitizedTechnicalTransfer) {
      hadInvalidEntries = true;
    }

    sanitized.push({
      id,
      time: timeRaw,
      label: labelRaw.slice(0, 50),
      type: typeRaw as MarkerType,
      technicalCall: sanitizedTechnicalCall,
      technicalTransfer: sanitizedTechnicalTransfer,
    });
  }

  sanitized.sort((a, b) => a.time - b.time);

  return {
    markers: sanitized,
    hadInvalidEntries,
  };
}

export default function VideoWorkspace() {
  const { t, formatDateTime } = useTranslation();
  const { videoPreferences } = useUserSettings();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const timelineViewportRef = useRef<HTMLDivElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  const activeVideoIdentityRef = useRef<string | null>(null);
  const persistMarkersTimeoutRef = useRef<number | null>(null);
  const timelineDragPointerIdRef = useRef<number | null>(null);
  const technicalCallCodeInputRef = useRef<HTMLInputElement | null>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [storageMessage, setStorageMessage] = useState<string>("");
  const [markerRestoreMessage, setMarkerRestoreMessage] = useState<string>("");
  const [isRestoringVideo, setIsRestoringVideo] = useState(true);
  const [isRestoringMarkers, setIsRestoringMarkers] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [markers, setMarkers] = useState<TimelineMarker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [activeVideoIdentity, setActiveVideoIdentity] = useState<string | null>(null);
  const [selectedMarkerType, setSelectedMarkerType] = useState<MarkerType>("jump");
  const [markerLabelDraft, setMarkerLabelDraft] = useState("");
  const [transferFeedbackMessage, setTransferFeedbackMessage] = useState<string>("");
  const [timelineZoom, setTimelineZoom] = useState(DEFAULT_TIMELINE_ZOOM);
  const [timelineViewportWidth, setTimelineViewportWidth] = useState(0);
  const [isDraggingTimelinePlayhead, setIsDraggingTimelinePlayhead] = useState(false);

  const hasVideo = Boolean(videoUrl);
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrentTime =
    Number.isFinite(currentTime) && currentTime >= 0
      ? Math.min(currentTime, safeDuration || currentTime)
      : 0;
  const canManageMarkers = hasVideo && safeDuration > 0;
  const timelineContentWidth = Math.max(
    timelineViewportWidth,
    timelineViewportWidth * timelineZoom,
  );
  const timelinePixelsPerSecond =
    safeDuration > 0 && timelineContentWidth > 0
      ? timelineContentWidth / safeDuration
      : 0;
  const timelineTickStep = getTimelineTickStep(safeDuration, timelinePixelsPerSecond);
  const timelineTickCount =
    safeDuration > 0 ? Math.ceil(safeDuration / timelineTickStep) + 1 : 0;

  const markerTypeOptions = useMemo(
    () => [
      {
        value: "jump" as const,
        label: t("video.markerType.jump"),
        short: t("video.markerTypeShort.jump"),
      },
      {
        value: "spin" as const,
        label: t("video.markerType.spin"),
        short: t("video.markerTypeShort.spin"),
      },
      {
        value: "sequence" as const,
        label: t("video.markerType.sequence"),
        short: t("video.markerTypeShort.sequence"),
      },
      {
        value: "fall" as const,
        label: t("video.markerType.fall"),
        short: t("video.markerTypeShort.fall"),
      },
      {
        value: "note" as const,
        label: t("video.markerType.note"),
        short: t("video.markerTypeShort.note"),
      },
    ],
    [t],
  );

  function markerTypeMeta(type: MarkerType): {
    value: MarkerType;
    label: string;
    short: string;
  } {
    return (
      markerTypeOptions.find((option) => option.value === type) ??
      markerTypeOptions[0]
    );
  }

  function getTransferStatusLabel(transfer: MarkerTechnicalTransfer | undefined): string {
    if (!transfer) {
      return t("video.transfer.notSent");
    }

    if (transfer.status === "sent_warning") {
      return t("video.transfer.sentWithWarning");
    }

    return t("video.transfer.sent");
  }

  function technicalStatusLabel(status: TechnicalCallStatus): string {
    if (status === "confirmed") {
      return t("video.technicalStatus.confirmed");
    }

    if (status === "invalid") {
      return t("video.technicalStatus.invalid");
    }

    return t("video.technicalStatus.pending");
  }

  function technicalElementTypeLabel(type: TechnicalElementType): string {
    if (type === "jump") {
      return t("video.markerType.jump");
    }

    if (type === "spin") {
      return t("video.markerType.spin");
    }

    if (type === "sequence") {
      return t("video.markerType.sequence");
    }

    if (type === "choreographic") {
      return t("video.markerType.choreographic");
    }

    if (type === "fall") {
      return t("video.markerType.fall");
    }

    return t("video.markerType.note");
  }

  const technicalCallPresets = useMemo<TechnicalCallPreset[]>(() => {
    const jumpPresets: TechnicalCallPreset[] = jumps.map((jump) => ({
      id: `jump-${jump.code}`,
      code: jump.code,
      displayName: jump.name,
      elementType: "jump",
    }));
    const spinPresets: TechnicalCallPreset[] = spins.map((spin) => ({
      id: `spin-${spin.code}`,
      code: spin.code,
      displayName: spin.name,
      elementType: "spin",
    }));
    const sequencePresets: TechnicalCallPreset[] = sequences.map((sequence) => ({
      id: `sequence-${sequence.code}`,
      code: sequence.code,
      displayName: sequence.name,
      elementType: "sequence",
    }));

    return [
      ...jumpPresets,
      ...spinPresets,
      ...sequencePresets,
      {
        id: "fall-fall",
        code: "FALL",
        displayName: t("video.markerType.fall"),
        elementType: "fall",
      },
      {
        id: "note-note",
        code: "NOTE",
        displayName: t("video.markerType.note"),
        elementType: "note",
      },
    ];
  }, [t]);

  const technicalCallPresetsByType = useMemo(
    () => ({
      jump: technicalCallPresets.filter((preset) => preset.elementType === "jump"),
      spin: technicalCallPresets.filter((preset) => preset.elementType === "spin"),
      sequence: technicalCallPresets.filter(
        (preset) => preset.elementType === "sequence",
      ),
      fall: technicalCallPresets.filter((preset) => preset.elementType === "fall"),
      note: technicalCallPresets.filter((preset) => preset.elementType === "note"),
    }),
    [technicalCallPresets],
  );

  const technicalCallPresetLookup = useMemo(
    () =>
      new Map<string, TechnicalCallPreset>(
        technicalCallPresets.map((preset) => [preset.id, preset] as const),
      ),
    [technicalCallPresets],
  );

  const activeMarkerId = useMemo(() => {
    let nearestId: string | null = null;
    let nearestDelta = Number.POSITIVE_INFINITY;

    for (const marker of markers) {
      const delta = Math.abs(marker.time - safeCurrentTime);

      if (
        delta <= MARKER_ACTIVE_TOLERANCE_SECONDS &&
        delta < nearestDelta
      ) {
        nearestDelta = delta;
        nearestId = marker.id;
      }
    }

    return nearestId;
  }, [markers, safeCurrentTime]);

  const selectedMarker = useMemo(
    () => markers.find((marker) => marker.id === selectedMarkerId) ?? null,
    [markers, selectedMarkerId],
  );

  const shortcutsLabel = useMemo(
    () =>
      videoPreferences.showKeyboardShortcutHints
        ? t("video.statusBar.shortcuts")
        : "",
    [t, videoPreferences.showKeyboardShortcutHints],
  );

  function clearObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  function resetPlaybackState() {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }

  function setVideoSource(videoBlob: Blob, name: string) {
    clearObjectUrl();

    const nextUrl = URL.createObjectURL(videoBlob);

    objectUrlRef.current = nextUrl;
    setVideoUrl(nextUrl);
    setVideoName(name);
    setErrorMessage("");
    setMarkerRestoreMessage("");
    setTransferFeedbackMessage("");
    resetPlaybackState();
    setMarkers([]);
    setSelectedMarkerId(null);
  }

  async function loadLocalVideo(file: File) {
    const isVideoMime = file.type.startsWith("video/");
    const lowerName = file.name.toLowerCase();
    const hasKnownExtension = ACCEPTED_VIDEO_EXTENSIONS.some((extension) =>
      lowerName.endsWith(extension),
    );

    if (!isVideoMime && !hasKnownExtension) {
      setErrorMessage(t("video.messages.invalidFile"));
      return;
    }

    const previousIdentity = activeVideoIdentityRef.current;
    const nextIdentity = buildLocalVideoIdentity({
      fileName: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      lastModified:
        typeof file.lastModified === "number" && Number.isFinite(file.lastModified)
          ? file.lastModified
          : null,
    });

    setVideoSource(file, file.name);
    setActiveVideoIdentity(nextIdentity);
    activeVideoIdentityRef.current = nextIdentity;
    setStorageMessage("");
    setMarkerRestoreMessage("");

    try {
      if (previousIdentity) {
        await clearMarkersForVideo(previousIdentity);
      }

      await clearMarkersForVideo(nextIdentity);
    } catch {
      // Marker cleanup failures must not block local playback.
    }

    try {
      await saveActiveVideo(file, file.name);
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }

      if (isQuotaExceededError(error)) {
        setStorageMessage(t("video.messages.storageQuota"));
      }
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    void loadLocalVideo(file);
    event.target.value = "";
  }

  function removeVideo() {
    const currentIdentity = activeVideoIdentityRef.current;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }

    clearObjectUrl();
    setVideoUrl(null);
    setVideoName("");
    setErrorMessage("");
    setStorageMessage("");
    setMarkerRestoreMessage("");
    setTransferFeedbackMessage("");
    resetPlaybackState();
    setMarkers([]);
    setSelectedMarkerId(null);
    setActiveVideoIdentity(null);
    setIsRestoringMarkers(false);
    activeVideoIdentityRef.current = null;

    if (persistMarkersTimeoutRef.current !== null) {
      window.clearTimeout(persistMarkersTimeoutRef.current);
      persistMarkersTimeoutRef.current = null;
    }

    void (async () => {
      try {
        await clearActiveVideo();

        if (currentIdentity) {
          await clearMarkersForVideo(currentIdentity);
        }
      } catch {
        // Keep the workspace usable even if IndexedDB cleanup fails.
      }
    })();
  }

  function seekToTime(nextTimeRaw: number) {
    const element = videoRef.current;

    if (!element || safeDuration <= 0) {
      return;
    }

    const nextTime = clampTime(nextTimeRaw, safeDuration);
    element.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function getTimelineLeftPx(time: number): number {
    if (safeDuration <= 0 || timelineContentWidth <= 0) {
      return 0;
    }

    return (clampTime(time, safeDuration) / safeDuration) * timelineContentWidth;
  }

  function seekFromTimelineClientX(clientX: number) {
    const viewport = timelineViewportRef.current;

    if (!viewport || safeDuration <= 0 || timelineContentWidth <= 0) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const xWithinContent =
      clientX - rect.left + viewport.scrollLeft;
    const clampedX = Math.max(0, Math.min(timelineContentWidth, xWithinContent));
    const ratio = timelineContentWidth > 0 ? clampedX / timelineContentWidth : 0;
    const nextTime = clampTime(ratio * safeDuration, safeDuration);

    seekToTime(nextTime);
  }

  function centerTimelineAtTime(time: number, smooth = true) {
    const viewport = timelineViewportRef.current;

    if (!viewport || timelineContentWidth <= viewport.clientWidth) {
      return;
    }

    const targetX = getTimelineLeftPx(time);
    const targetScrollLeft = Math.max(
      0,
      Math.min(
        timelineContentWidth - viewport.clientWidth,
        targetX - viewport.clientWidth / 2,
      ),
    );

    viewport.scrollTo({
      left: targetScrollLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  function ensureTimeVisible(time: number) {
    const viewport = timelineViewportRef.current;

    if (!viewport || timelineContentWidth <= viewport.clientWidth) {
      return;
    }

    const x = getTimelineLeftPx(time);
    const minVisible = viewport.scrollLeft + 56;
    const maxVisible = viewport.scrollLeft + viewport.clientWidth - 56;

    if (x >= minVisible && x <= maxVisible) {
      return;
    }

    const centeredScrollLeft = Math.max(
      0,
      Math.min(
        timelineContentWidth - viewport.clientWidth,
        x - viewport.clientWidth / 2,
      ),
    );

    viewport.scrollTo({ left: centeredScrollLeft, behavior: "auto" });
  }

  function updateTimelineZoom(nextZoomRaw: number, anchorClientX?: number) {
    const viewport = timelineViewportRef.current;
    const previousZoom = timelineZoom;
    const nextZoom = clampTimelineZoom(nextZoomRaw);

    if (!viewport || safeDuration <= 0 || nextZoom === previousZoom) {
      setTimelineZoom(nextZoom);
      return;
    }

    const viewportWidth = viewport.clientWidth;
    const previousContentWidth = Math.max(viewportWidth, viewportWidth * previousZoom);
    const nextContentWidth = Math.max(viewportWidth, viewportWidth * nextZoom);
    const rect = viewport.getBoundingClientRect();
    const anchorInViewport = Number.isFinite(anchorClientX)
      ? Math.max(0, Math.min(viewportWidth, (anchorClientX ?? rect.left) - rect.left))
      : viewportWidth / 2;
    const anchorX = viewport.scrollLeft + anchorInViewport;
    const anchorRatio = previousContentWidth > 0 ? anchorX / previousContentWidth : 0;
    const nextScrollLeft = Math.max(
      0,
      Math.min(nextContentWidth - viewportWidth, anchorRatio * nextContentWidth - anchorInViewport),
    );

    setTimelineZoom(nextZoom);

    window.requestAnimationFrame(() => {
      viewport.scrollLeft = nextScrollLeft;
    });
  }

  function handleTimelinePlayheadPointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    if (!hasVideo || safeDuration <= 0) {
      return;
    }

    event.preventDefault();
    timelineDragPointerIdRef.current = event.pointerId;
    setIsDraggingTimelinePlayhead(true);
    seekFromTimelineClientX(event.clientX);
  }

  function handleTimelineWheel(event: ReactWheelEvent<HTMLDivElement>) {
    if (!hasVideo || safeDuration <= 0) {
      return;
    }

    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    event.preventDefault();

    const direction = event.deltaY > 0 ? -1 : 1;
    const nextZoom = timelineZoom + direction * TIMELINE_ZOOM_STEP;

    updateTimelineZoom(nextZoom, event.clientX);
  }

  function fitTimelineToVideo() {
    updateTimelineZoom(MIN_TIMELINE_ZOOM);

    const viewport = timelineViewportRef.current;

    if (viewport) {
      viewport.scrollTo({ left: 0, behavior: "smooth" });
    }
  }

  function centerSelectedMarkerOnTimeline() {
    if (!selectedMarkerId) {
      return;
    }

    const selectedMarker = markers.find((marker) => marker.id === selectedMarkerId);

    if (!selectedMarker) {
      return;
    }

    centerTimelineAtTime(selectedMarker.time);
  }

  function centerPlayheadOnTimeline() {
    centerTimelineAtTime(safeCurrentTime);
  }

  function addMarkerAtCurrentTime() {
    const element = videoRef.current;

    if (!element || !canManageMarkers) {
      return;
    }

    if (!element.paused) {
      element.pause();
    }

    const resolvedTime = clampTime(
      Number.isFinite(element.currentTime) ? element.currentTime : safeCurrentTime,
      safeDuration,
    );
    const fallbackLabel = markerTypeMeta(selectedMarkerType).label;
    const nextLabel = markerLabelDraft.trim() || fallbackLabel;

    setMarkers((previousMarkers) => {
      const existingIds = new Set(previousMarkers.map((marker) => marker.id));
      const nextMarker: TimelineMarker = {
        id: createMarkerId(existingIds),
        time: resolvedTime,
        label: nextLabel,
        type: selectedMarkerType,
      };

      return [...previousMarkers, nextMarker].sort((a, b) => a.time - b.time);
    });

    setMarkerLabelDraft("");
    setCurrentTime(resolvedTime);
  }

  function updateMarkerLabel(markerId: string, nextLabelRaw: string) {
    setMarkers((previousMarkers) =>
      previousMarkers.map((marker) =>
        marker.id === markerId
          ? { ...marker, label: nextLabelRaw.slice(0, 50) }
          : marker,
      ),
    );
  }

  function updateMarkerType(markerId: string, nextTypeRaw: string) {
    if (!SUPPORTED_MARKER_TYPES.includes(nextTypeRaw as MarkerType)) {
      return;
    }

    setMarkers((previousMarkers) =>
      previousMarkers.map((marker) =>
        marker.id === markerId
          ? {
              ...marker,
              type: nextTypeRaw as MarkerType,
              technicalCall: marker.technicalCall
                ? {
                    ...marker.technicalCall,
                    elementType: markerTypeToTechnicalElementType(
                      nextTypeRaw as MarkerType,
                    ),
                  }
                : marker.technicalCall,
            }
          : marker,
      ),
    );
  }

  function createDefaultTechnicalCall(marker: TimelineMarker): MarkerTechnicalCall {
    return {
      code: "",
      displayName: marker.label.trim().slice(0, 80),
      elementType: markerTypeToTechnicalElementType(marker.type),
      status: "pending",
    };
  }

  function updateMarkerTechnicalCall(
    markerId: string,
    updater: (current: MarkerTechnicalCall, marker: TimelineMarker) => MarkerTechnicalCall,
  ) {
    setMarkers((previousMarkers) =>
      previousMarkers.map((marker) => {
        if (marker.id !== markerId) {
          return marker;
        }

        const currentCall = marker.technicalCall ?? createDefaultTechnicalCall(marker);
        const nextCall = sanitizeTechnicalCall(updater(currentCall, marker));

        if (!nextCall) {
          return marker;
        }

        return {
          ...marker,
          technicalCall: nextCall,
        };
      }),
    );
  }

  function clearMarkerTechnicalCall(markerId: string) {
    setMarkers((previousMarkers) =>
      previousMarkers.map((marker) =>
        marker.id === markerId
          ? { ...marker, technicalCall: undefined, technicalTransfer: undefined }
          : marker,
      ),
    );
  }

  function sendMarkerTechnicalCallToPlanner(markerId: string, forceResend = false) {
    const marker = markers.find((item) => item.id === markerId);

    if (!marker) {
      return;
    }

    if (!isTransferableTechnicalCall(marker.technicalCall)) {
      return;
    }

    if (marker.technicalTransfer && !forceResend) {
      setTransferFeedbackMessage(t("video.transfer.alreadySent"));
      return;
    }

    const normalizedCode = marker.technicalCall.code.trim();
    const normalizedDisplayName = marker.technicalCall.displayName.trim();

    try {
      const transferEntry = enqueueVideoPlannerTransfer({
        markerId: marker.id,
        markerTime: marker.time,
        videoIdentity: activeVideoIdentity ?? "local-video",
        technicalCall: {
          code: normalizedCode,
          displayName: normalizedDisplayName,
          elementType: marker.technicalCall.elementType as TransferElementType,
          goeGrade: marker.technicalCall.goeGrade,
          notes: marker.technicalCall.notes,
        },
      });

      setMarkers((previousMarkers) =>
        previousMarkers.map((currentMarker) => {
          if (currentMarker.id !== marker.id) {
            return currentMarker;
          }

          return {
            ...currentMarker,
            technicalTransfer: {
              status: "sent",
              transferredAt: transferEntry.createdAt,
              transferId: transferEntry.transferId,
            },
          };
        }),
      );

      setTransferFeedbackMessage(t("video.transfer.sentSuccess"));
    } catch {
      setTransferFeedbackMessage(t("video.transfer.failed"));
    }
  }

  function ensureMarkerTechnicalCall(markerId: string) {
    setMarkers((previousMarkers) =>
      previousMarkers.map((marker) => {
        if (marker.id !== markerId || marker.technicalCall) {
          return marker;
        }

        return {
          ...marker,
          technicalCall: createDefaultTechnicalCall(marker),
        };
      }),
    );
  }

  function focusTechnicalCallEditor() {
    if (!selectedMarkerId) {
      return;
    }

    ensureMarkerTechnicalCall(selectedMarkerId);

    window.requestAnimationFrame(() => {
      technicalCallCodeInputRef.current?.focus();
      technicalCallCodeInputRef.current?.select();
    });
  }

  function toggleSelectedMarkerTechnicalStatus() {
    if (!selectedMarkerId) {
      return;
    }

    updateMarkerTechnicalCall(selectedMarkerId, (current) => ({
      ...current,
      status:
        current.status === "pending"
          ? "confirmed"
          : current.status === "confirmed"
            ? "pending"
            : "pending",
    }));
  }

  function removeMarker(markerId: string) {
    if (
      videoPreferences.confirmBeforeDeletingMarkers &&
      !window.confirm(t("common.settings.video.confirmDeleteSingleMarker"))
    ) {
      return;
    }

    setSelectedMarkerId((previousSelected) =>
      previousSelected === markerId ? null : previousSelected,
    );
    setMarkers((previousMarkers) =>
      previousMarkers.filter((marker) => marker.id !== markerId),
    );
  }

  function clearAllMarkers() {
    if (
      videoPreferences.confirmBeforeDeletingMarkers &&
      !window.confirm(t("common.settings.video.confirmDeleteAllMarkers"))
    ) {
      return;
    }

    setMarkers([]);
    setSelectedMarkerId(null);
  }

  function moveMarkerToCurrentTime(markerId: string) {
    const element = videoRef.current;

    if (!element || !canManageMarkers) {
      return;
    }

    if (!element.paused) {
      element.pause();
    }

    const resolvedTime = clampTime(
      Number.isFinite(element.currentTime) ? element.currentTime : safeCurrentTime,
      safeDuration,
    );

    setMarkers((previousMarkers) =>
      previousMarkers
        .map((marker) =>
          marker.id === markerId ? { ...marker, time: resolvedTime } : marker,
        )
        .sort((a, b) => a.time - b.time),
    );
  }

  async function togglePlayPause() {
    const element = videoRef.current;

    if (!element) {
      return;
    }

    if (element.paused) {
      try {
        await element.play();
      } catch {
        setErrorMessage(t("video.messages.playbackBlocked"));
      }

      return;
    }

    element.pause();
  }

  function seekBy(deltaSeconds: number) {
    const element = videoRef.current;

    if (!element) {
      return;
    }

    const maxDuration = Number.isFinite(element.duration)
      ? element.duration
      : Infinity;
    const nextTime = Math.max(
      0,
      Math.min(element.currentTime + deltaSeconds, maxDuration),
    );
    element.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function stepFrame(direction: -1 | 1) {
    seekBy(direction * FRAME_STEP_SECONDS);
  }

  function handleSeekChange(nextTimeRaw: string) {
    const element = videoRef.current;

    if (!element) {
      return;
    }

    const parsed = Number(nextTimeRaw);
    const maxDuration = Number.isFinite(element.duration)
      ? element.duration
      : parsed;
    const nextTime = Number.isFinite(parsed)
      ? Math.max(0, Math.min(parsed, maxDuration))
      : 0;

    element.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleVolumeChange(nextVolumeRaw: string) {
    const element = videoRef.current;
    const parsed = Number(nextVolumeRaw);
    const nextVolume = Number.isFinite(parsed)
      ? Math.max(0, Math.min(parsed, 1))
      : 1;

    setVolume(nextVolume);

    if (element) {
      element.volume = nextVolume;
    }
  }

  function handlePlaybackRateChange(nextRateRaw: string) {
    const element = videoRef.current;
    const parsed = Number(nextRateRaw);
    const nextRate = PLAYBACK_SPEED_OPTIONS.includes(parsed as (typeof PLAYBACK_SPEED_OPTIONS)[number])
      ? parsed
      : 1;

    setPlaybackRate(nextRate);

    if (element) {
      element.playbackRate = nextRate;
    }
  }

  async function enterFullscreen() {
    const target = videoContainerRef.current;

    if (!target || typeof target.requestFullscreen !== "function") {
      return;
    }

    try {
      await target.requestFullscreen();
    } catch {
      setErrorMessage(t("video.messages.fullscreenUnavailable"));
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedZoom = window.localStorage.getItem(TIMELINE_ZOOM_STORAGE_KEY);

    if (!storedZoom) {
      return;
    }

    const parsed = Number(storedZoom);

    if (!Number.isFinite(parsed)) {
      return;
    }

    setTimelineZoom(clampTimelineZoom(parsed));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      TIMELINE_ZOOM_STORAGE_KEY,
      clampTimelineZoom(timelineZoom).toString(),
    );
  }, [timelineZoom]);

  useEffect(() => {
    const viewport = timelineViewportRef.current;

    if (!viewport) {
      return;
    }

    const updateWidth = () => {
      setTimelineViewportWidth(viewport.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isDraggingTimelinePlayhead) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const pointerId = timelineDragPointerIdRef.current;

      if (pointerId !== null && event.pointerId !== pointerId) {
        return;
      }

      seekFromTimelineClientX(event.clientX);
    };

    const handlePointerUp = (event: PointerEvent) => {
      const pointerId = timelineDragPointerIdRef.current;

      if (pointerId !== null && event.pointerId !== pointerId) {
        return;
      }

      timelineDragPointerIdRef.current = null;
      setIsDraggingTimelinePlayhead(false);
    };

    const handlePointerCancel = (event: PointerEvent) => {
      const pointerId = timelineDragPointerIdRef.current;

      if (pointerId !== null && event.pointerId !== pointerId) {
        return;
      }

      timelineDragPointerIdRef.current = null;
      setIsDraggingTimelinePlayhead(false);
    };

    document.body.classList.add("select-none");
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      document.body.classList.remove("select-none");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [isDraggingTimelinePlayhead, safeDuration, timelineContentWidth]);

  useEffect(() => {
    if (isDraggingTimelinePlayhead || safeDuration <= 0) {
      return;
    }

    if (!isPlaying) {
      return;
    }

    ensureTimeVisible(safeCurrentTime);
  }, [isDraggingTimelinePlayhead, isPlaying, safeCurrentTime, safeDuration, timelineZoom]);

  useEffect(() => {
    if (!selectedMarkerId || timelineZoom <= 1 || safeDuration <= 0) {
      return;
    }

    const selectedMarker = markers.find((marker) => marker.id === selectedMarkerId);

    if (!selectedMarker) {
      return;
    }

    centerTimelineAtTime(selectedMarker.time);
  }, [markers, safeDuration, selectedMarkerId, timelineZoom]);

  useEffect(() => {
    if (timelineZoom <= 1 || safeDuration <= 0) {
      return;
    }

    ensureTimeVisible(safeCurrentTime);
  }, [safeDuration, timelineContentWidth, timelineZoom]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      if (persistMarkersTimeoutRef.current !== null) {
        window.clearTimeout(persistMarkersTimeoutRef.current);
      }

      timelineDragPointerIdRef.current = null;
      document.body.classList.remove("select-none");

      clearObjectUrl();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const restoreStoredVideo = async () => {
      if (!videoPreferences.restoreLastVideoOnOpening) {
        setIsRestoringVideo(false);
        setIsRestoringMarkers(false);
        return;
      }

      setIsRestoringVideo(true);

      try {
        const storedVideo = await getActiveVideo();

        if (cancelled || !isMountedRef.current) {
          return;
        }

        if (!storedVideo) {
          setActiveVideoIdentity(null);
          activeVideoIdentityRef.current = null;
          setIsRestoringMarkers(false);
          setIsRestoringVideo(false);
          return;
        }

        const restoredBlob =
          storedVideo.mimeType && storedVideo.mimeType !== storedVideo.blob.type
            ? storedVideo.blob.slice(0, storedVideo.blob.size, storedVideo.mimeType)
            : storedVideo.blob;

        const restoredIdentity = buildLocalVideoIdentity({
          fileName: storedVideo.fileName,
          size: storedVideo.size,
          mimeType: storedVideo.mimeType,
          lastModified: storedVideo.lastModified,
        });

        setVideoSource(restoredBlob, storedVideo.fileName);
        setActiveVideoIdentity(restoredIdentity);
        activeVideoIdentityRef.current = restoredIdentity;
        setStorageMessage("");
        setMarkerRestoreMessage("");
        setIsRestoringMarkers(true);

        try {
          const storedMarkers = await getMarkersForVideo(restoredIdentity);

          if (cancelled || !isMountedRef.current) {
            return;
          }

          const { markers: sanitizedMarkers, hadInvalidEntries } = sanitizeStoredMarkers(
            storedMarkers,
          );

          setMarkers(sanitizedMarkers);
          setSelectedMarkerId((previousSelected) =>
            previousSelected && sanitizedMarkers.some((marker) => marker.id === previousSelected)
              ? previousSelected
              : null,
          );

          if (hadInvalidEntries) {
            void saveMarkersForVideo(restoredIdentity, sanitizedMarkers).catch(() => {
              // Ignore write failures after sanitization.
            });
          }
        } catch {
          if (cancelled || !isMountedRef.current) {
            return;
          }

          setMarkers([]);
          setSelectedMarkerId(null);
          setMarkerRestoreMessage(
            t("video.messages.restoreMarkersFailed"),
          );
        } finally {
          if (!cancelled && isMountedRef.current) {
            setIsRestoringMarkers(false);
          }
        }
      } catch {
        void clearActiveVideo();

        if (cancelled || !isMountedRef.current) {
          return;
        }

        clearObjectUrl();
        setVideoUrl(null);
        setVideoName("");
        resetPlaybackState();
        setMarkers([]);
        setSelectedMarkerId(null);
        setActiveVideoIdentity(null);
        activeVideoIdentityRef.current = null;
        setStorageMessage("");
        setMarkerRestoreMessage("");
        setErrorMessage(t("video.messages.restoreVideoFailed"));
      } finally {
        if (!cancelled && isMountedRef.current) {
          setIsRestoringVideo(false);
        }
      }
    };

    void restoreStoredVideo();

    return () => {
      cancelled = true;
    };
  }, [videoPreferences.restoreLastVideoOnOpening]);

  useEffect(() => {
    if (safeDuration <= 0) {
      return;
    }

    setMarkers((previousMarkers) =>
      previousMarkers
        .map((marker) => ({
          ...marker,
          time: clampTime(marker.time, safeDuration),
        }))
        .sort((a, b) => a.time - b.time),
    );
  }, [safeDuration]);

  useEffect(() => {
    if (!selectedMarkerId) {
      return;
    }

    if (markers.some((marker) => marker.id === selectedMarkerId)) {
      return;
    }

    setSelectedMarkerId(null);
  }, [markers, selectedMarkerId]);

  useEffect(() => {
    setTransferFeedbackMessage("");
  }, [selectedMarkerId]);

  useEffect(() => {
    if (!hasVideo || !activeVideoIdentity || isRestoringMarkers) {
      return;
    }

    if (persistMarkersTimeoutRef.current !== null) {
      window.clearTimeout(persistMarkersTimeoutRef.current);
    }

    persistMarkersTimeoutRef.current = window.setTimeout(() => {
      void saveMarkersForVideo(activeVideoIdentity, markers).catch(() => {
        // Do not block playback if marker persistence fails.
      });
      persistMarkersTimeoutRef.current = null;
    }, MARKER_PERSIST_DEBOUNCE_MS);

    return () => {
      if (persistMarkersTimeoutRef.current !== null) {
        window.clearTimeout(persistMarkersTimeoutRef.current);
      }
    };
  }, [activeVideoIdentity, hasVideo, isRestoringMarkers, markers]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      const key = event.key;
      const normalizedKey = key.length === 1 ? key.toLowerCase() : key;

      if (normalizedKey === " " || normalizedKey === "spacebar") {
        event.preventDefault();
        void togglePlayPause();
        return;
      }

      if (normalizedKey === "ArrowLeft") {
        event.preventDefault();
        seekBy(-5);
        return;
      }

      if (normalizedKey === "ArrowRight") {
        event.preventDefault();
        seekBy(5);
        return;
      }

      if (normalizedKey === ",") {
        event.preventDefault();
        stepFrame(-1);
        return;
      }

      if (normalizedKey === ".") {
        event.preventDefault();
        stepFrame(1);
        return;
      }

      if (normalizedKey === "m") {
        event.preventDefault();
        addMarkerAtCurrentTime();
        return;
      }

      if (normalizedKey === "c") {
        if (!selectedMarkerId) {
          return;
        }

        event.preventDefault();
        focusTechnicalCallEditor();
        return;
      }

      if (normalizedKey === "Enter") {
        if (!selectedMarkerId) {
          return;
        }

        event.preventDefault();
        toggleSelectedMarkerTechnicalStatus();
        return;
      }

      if (normalizedKey === "Delete" || normalizedKey === "Backspace") {
        if (!selectedMarkerId) {
          return;
        }

        // Keep keyboard deletion explicit/safe by not binding direct marker deletion.
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    canManageMarkers,
    markerLabelDraft,
    safeCurrentTime,
    safeDuration,
    selectedMarkerId,
    selectedMarkerType,
  ]);

  return (
    <WorkspaceShell
      header={
        <WorkspaceHeader
          leftSlot={
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={18} />
              <span>{t("video.header.home")}</span>
            </Link>
          }
          centerSlot={
            <div className="min-w-0">
              <h1 className="app-text-primary truncate text-sm font-semibold">
                {t("video.header.title")}
              </h1>
              <p className="app-text-muted truncate text-xs">
                {t("video.header.subtitle")}
              </p>
            </div>
          }
        />
      }
      sidebar={<WorkspaceSidebar items={[]} collapsed />}
      statusBar={
        <WorkspaceStatusBar
          leftSlot={
            <span>{hasVideo ? t("video.statusBar.videoLoaded") : t("video.statusBar.noVideo")}</span>
          }
          centerSlot={shortcutsLabel ? <span>{shortcutsLabel}</span> : undefined}
          rightSlot={<span>{t("video.statusBar.stateLocalOnly")}</span>}
        />
      }
      sidebarWidth={0}
      className="h-auto min-h-screen overflow-x-hidden overflow-y-visible [&>div]:h-auto [&>div]:min-h-screen [&>div>div>aside]:border-r-0 [&>div>div>div>main]:overflow-visible"
    >
      <div className="min-h-screen min-w-0 overflow-x-hidden px-3 py-3 sm:px-4">
        <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-3">
          <WorkspacePanel
            title={t("video.video.panelTitle")}
            subtitle={t("video.video.panelSubtitle")}
            scrollable={false}
            contentClassName="!overflow-visible"
            actions={
              <div className="flex flex-wrap items-center justify-end gap-2">
                <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">
                  <input
                    type="file"
                    accept="video/*,.mp4,.mov,.m4v,.webm,.ogg,.ogv,.mkv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {hasVideo ? t("video.video.replaceVideo") : t("video.video.loadVideo")}
                </label>

                <button
                  type="button"
                  onClick={removeVideo}
                  disabled={!hasVideo}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("video.video.removeVideo")}
                </button>
              </div>
            }
          >
            <div className="flex min-w-0 flex-col gap-2">
              {isRestoringVideo && !hasVideo && (
                <p className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                  {t("video.video.restoringSaved")}
                </p>
              )}

              {isRestoringMarkers && hasVideo && (
                <p className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                  {t("video.video.restoringAnalysis")}
                </p>
              )}

              {videoName && (
                <p className="truncate text-xs text-slate-500" title={videoName}>
                  {t("video.video.loadedFile", { name: videoName })}
                </p>
              )}

              {errorMessage && (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
                  {errorMessage}
                </p>
              )}

              {storageMessage && (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
                  {storageMessage}
                </p>
              )}

              {markerRestoreMessage && (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
                  {markerRestoreMessage}
                </p>
              )}

              <p className="text-[11px] text-slate-500">
                {t("video.video.privacyNote")}
              </p>
            </div>
          </WorkspacePanel>

          <div className="grid min-w-0 grid-cols-1 items-start gap-3 overflow-x-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
            <WorkspacePanel
              title={t("video.player.title")}
              subtitle={t("video.player.subtitle")}
              scrollable={false}
              className="min-w-0"
              contentClassName="!p-2"
            >
              <div className="flex min-w-0 flex-col gap-2">
                <div
                  ref={videoContainerRef}
                  className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-950"
                >
                  {hasVideo ? (
                    <video
                      ref={videoRef}
                      src={videoUrl ?? undefined}
                      className="block h-auto max-h-[42vh] w-full bg-slate-950 object-contain sm:max-h-[50vh] lg:max-h-[60vh]"
                      onLoadedMetadata={(event) => {
                        const nextDuration = event.currentTarget.duration;
                        setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
                        setCurrentTime(0);
                        event.currentTarget.currentTime = 0;
                        event.currentTarget.volume = volume;
                        event.currentTarget.playbackRate = playbackRate;
                      }}
                      onDurationChange={(event) => {
                        const nextDuration = event.currentTarget.duration;
                        setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
                      }}
                      onTimeUpdate={(event) => {
                        const nextCurrent = event.currentTarget.currentTime;
                        setCurrentTime(Number.isFinite(nextCurrent) ? nextCurrent : 0);
                      }}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  ) : (
                    <div className="flex h-[42vh] min-h-[260px] items-center justify-center px-4 text-center">
                      <div>
                        {isRestoringVideo ? (
                          <>
                            <p className="text-sm font-semibold text-slate-100">
                              {t("video.player.restoringTitle")}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {t("video.player.restoringSubtitle")}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-slate-100">
                              {t("video.player.noVideoTitle")}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {t("video.player.noVideoSubtitle")}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-slate-200 bg-white px-2 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void togglePlayPause()}
                      disabled={!hasVideo}
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPlaying ? t("video.controls.pause") : t("video.controls.play")}
                    </button>

                    <span className="text-xs font-medium tabular-nums text-slate-600">
                      {formatTime(safeCurrentTime)} / {formatTime(safeDuration)}
                    </span>

                    <button
                      type="button"
                      onClick={() => seekBy(-5)}
                      disabled={!hasVideo}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t("video.controls.rewind")}
                    </button>

                    <button
                      type="button"
                      onClick={() => seekBy(5)}
                      disabled={!hasVideo}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t("video.controls.forward")}
                    </button>

                    <button
                      type="button"
                      onClick={() => stepFrame(-1)}
                      disabled={!hasVideo}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t("video.controls.previousFrame")}
                    </button>

                    <button
                      type="button"
                      onClick={() => stepFrame(1)}
                      disabled={!hasVideo}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t("video.controls.nextFrame")}
                    </button>

                    <button
                      type="button"
                      onClick={() => void enterFullscreen()}
                      disabled={!hasVideo}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t("video.controls.fullscreen")}
                    </button>

                    <label className="ml-auto flex items-center gap-1 text-xs text-slate-600">
                      {t("video.controls.volume")}
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(event) => handleVolumeChange(event.target.value)}
                        disabled={!hasVideo}
                        className="w-24"
                        aria-label={t("video.aria.volume")}
                      />
                    </label>

                    <label className="flex items-center gap-1 text-xs text-slate-600">
                      {t("video.controls.speed")}
                      <select
                        value={playbackRate}
                        onChange={(event) => handlePlaybackRateChange(event.target.value)}
                        disabled={!hasVideo}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                        aria-label={t("video.aria.playbackSpeed")}
                      >
                        {PLAYBACK_SPEED_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}x
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-2">
                    <input
                      type="range"
                      min={0}
                      max={safeDuration || 0}
                      step={0.01}
                      value={safeDuration > 0 ? Math.min(safeCurrentTime, safeDuration) : 0}
                      onChange={(event) => handleSeekChange(event.target.value)}
                      disabled={!hasVideo || safeDuration <= 0}
                      className="w-full"
                      aria-label={t("video.aria.seekVideo")}
                    />
                  </div>

                  <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-slate-700">
                        {t("video.markers.addMarker")}
                      </span>

                      <select
                        value={selectedMarkerType}
                        onChange={(event) =>
                          setSelectedMarkerType(event.target.value as MarkerType)
                        }
                        disabled={!canManageMarkers}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={t("video.aria.markerTypeSelect")}
                      >
                        {markerTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={markerLabelDraft}
                        onChange={(event) => setMarkerLabelDraft(event.target.value)}
                        maxLength={50}
                        disabled={!canManageMarkers}
                        placeholder={t("video.markers.shortLabelPlaceholder")}
                        className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={t("video.aria.markerLabelInput")}
                      />

                      <button
                        type="button"
                        onClick={addMarkerAtCurrentTime}
                        disabled={!canManageMarkers}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {t("video.markers.addMarkerAction")}
                      </button>

                      <button
                        type="button"
                        onClick={clearAllMarkers}
                        disabled={markers.length === 0}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {t("video.markers.clearMarkers")}
                      </button>
                    </div>

                    <p className="mt-1 text-[11px] text-slate-500">
                      {t("video.markers.localInfo")}
                    </p>

                    <div className="mt-2 min-w-0">
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                        <span>{t("video.timeline.title")}</span>
                        <span>
                          {markers.length === 1
                            ? t("video.markers.countSingular", { count: markers.length })
                            : t("video.markers.countPlural", { count: markers.length })}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 pb-2">
                        <button
                          type="button"
                          onClick={() => updateTimelineZoom(timelineZoom - TIMELINE_ZOOM_STEP)}
                          disabled={!canManageMarkers || timelineZoom <= MIN_TIMELINE_ZOOM}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {t("video.timeline.zoomOut")}
                        </button>

                        <button
                          type="button"
                          onClick={() => updateTimelineZoom(DEFAULT_TIMELINE_ZOOM)}
                          disabled={!canManageMarkers || timelineZoom === DEFAULT_TIMELINE_ZOOM}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {t("video.timeline.resetZoom")}
                        </button>

                        <button
                          type="button"
                          onClick={() => updateTimelineZoom(timelineZoom + TIMELINE_ZOOM_STEP)}
                          disabled={!canManageMarkers || timelineZoom >= MAX_TIMELINE_ZOOM}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {t("video.timeline.zoomIn")}
                        </button>

                        <span className="ml-1 text-[11px] font-medium tabular-nums text-slate-600">
                          {timelineZoom.toFixed(1)}x
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {t("video.timeline.zoomHint")}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 pb-2">
                        <button
                          type="button"
                          onClick={fitTimelineToVideo}
                          disabled={!canManageMarkers}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {t("video.timeline.fitVideo")}
                        </button>

                        <button
                          type="button"
                          onClick={centerSelectedMarkerOnTimeline}
                          disabled={!canManageMarkers || !selectedMarkerId}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {t("video.timeline.centerSelectedMarker")}
                        </button>

                        <button
                          type="button"
                          onClick={centerPlayheadOnTimeline}
                          disabled={!canManageMarkers}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {t("video.timeline.centerPlayhead")}
                        </button>
                      </div>

                      <div
                        ref={timelineViewportRef}
                        className="w-full overflow-x-auto overflow-y-hidden rounded-md border border-slate-200 bg-white"
                        onWheel={handleTimelineWheel}
                      >
                        <div
                          className="relative h-20"
                          style={{ width: `${Math.max(1, timelineContentWidth)}px` }}
                        >
                          <button
                            type="button"
                            onClick={(event) => seekFromTimelineClientX(event.clientX)}
                            disabled={!canManageMarkers}
                            className="absolute inset-0 h-full w-full cursor-pointer bg-transparent disabled:cursor-not-allowed"
                            aria-label={t("video.aria.seekTimeline")}
                          />

                          <div className="pointer-events-none absolute inset-x-0 top-0 h-8">
                            {timelineTickCount > 0 &&
                              Array.from({ length: timelineTickCount }).map((_, index) => {
                                const tickTime = Math.min(
                                  safeDuration,
                                  index * timelineTickStep,
                                );
                                const leftPx = getTimelineLeftPx(tickTime);
                                const isMajorTick = index % 5 === 0 || tickTime === safeDuration;

                                return (
                                  <div
                                    key={`tick-${index}-${tickTime}`}
                                    className="absolute top-0"
                                    style={{ left: `${leftPx}px` }}
                                  >
                                    <div
                                      className={`w-px bg-slate-300 ${
                                        isMajorTick ? "h-4" : "h-2"
                                      }`}
                                    />
                                    {isMajorTick && (
                                      <span className="mt-0.5 block -translate-x-1/2 whitespace-nowrap text-[10px] tabular-nums text-slate-500">
                                        {formatTime(tickTime)}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                          </div>

                          <div className="pointer-events-none absolute inset-x-0 top-11 h-0.5 bg-slate-200" />

                          <div className="absolute inset-x-0 top-8 h-12">
                            {markers.map((marker) => {
                              const markerMeta = markerTypeMeta(marker.type);
                              const isActive = activeMarkerId === marker.id;
                              const leftPx = getTimelineLeftPx(marker.time);
                              const technicalCall = marker.technicalCall;
                              const technicalSummary = technicalCall
                                ? [
                                    technicalCall.code || t("video.placeholders.noCode"),
                                    technicalCall.displayName || t("video.placeholders.noName"),
                                    technicalStatusLabel(technicalCall.status),
                                    typeof technicalCall.goeGrade === "number"
                                      ? `GOE ${technicalCall.goeGrade >= 0 ? "+" : ""}${technicalCall.goeGrade}`
                                      : null,
                                    getTransferStatusLabel(marker.technicalTransfer),
                                  ]
                                    .filter(Boolean)
                                    .join(" | ")
                                : "";

                              return (
                                <div key={marker.id} className="absolute top-1/2" style={{ left: `${leftPx}px` }}>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedMarkerId(marker.id);
                                      seekToTime(marker.time);
                                    }}
                                    className={`z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] font-semibold transition ${
                                      isActive || selectedMarkerId === marker.id
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                    }`}
                                    title={`${formatTime(marker.time)} | ${markerMeta.label} | ${marker.label}${technicalSummary ? ` | ${technicalSummary}` : ""}`}
                                    aria-label={
                                      t("video.aria.gotoMarker", {
                                        time: formatTime(marker.time),
                                        type: markerMeta.label,
                                      })
                                    }
                                  >
                                    {markerMeta.short}
                                  </button>

                                  {technicalCall && (
                                    <span className="pointer-events-none absolute left-1/2 top-3 max-w-[120px] -translate-x-1/2 truncate rounded border border-slate-200 bg-white/95 px-1 py-0.5 text-[9px] text-slate-600 shadow-sm">
                                      {technicalCall.code || technicalCall.displayName || t("video.placeholders.technicalBadgeDefault")}
                                      {typeof technicalCall.goeGrade === "number"
                                        ? ` ${technicalCall.goeGrade >= 0 ? "+" : ""}${technicalCall.goeGrade}`
                                        : ""}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {safeDuration > 0 && (
                            <button
                              type="button"
                              onPointerDown={handleTimelinePlayheadPointerDown}
                              className="absolute top-8 z-20 h-12 -translate-x-1/2 cursor-ew-resize bg-transparent"
                              style={{ left: `${getTimelineLeftPx(safeCurrentTime)}px` }}
                              aria-label={t("video.aria.dragPlayhead")}
                            >
                              <span className="pointer-events-none absolute left-1/2 top-0 h-10 w-0.5 -translate-x-1/2 bg-rose-500" />
                              <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-sm bg-rose-500 px-1 py-0.5 text-[10px] font-semibold text-white tabular-nums">
                                {formatTime(safeCurrentTime)}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </WorkspacePanel>

            <WorkspacePanel
              title={t("video.technical.title")}
              subtitle={t("video.technical.subtitle")}
              scrollable
              className="min-w-0 self-start !h-auto"
            >
              {markers.length === 0 ? (
                <div className="flex h-full min-h-[200px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
                  <p className="text-xs text-slate-500">
                    {t("video.markers.noMarkers")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedMarker && (
                    <div className="rounded-md border border-slate-300 bg-slate-50 p-2">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold tabular-nums text-slate-700">
                          {formatTime(selectedMarker.time)}
                        </span>
                        <span className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {markerTypeMeta(selectedMarker.type).label}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {t("video.technical.editorLabel")}
                        </span>
                        <span className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-600">
                          {getTransferStatusLabel(selectedMarker.technicalTransfer)}
                        </span>
                        {selectedMarker.technicalTransfer?.transferredAt && (
                          <span className="text-[10px] text-slate-500">
                            {formatDateTime(selectedMarker.technicalTransfer.transferredAt)}
                          </span>
                        )}
                      </div>

                      {transferFeedbackMessage && (
                        <p className="mb-2 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700">
                          {transferFeedbackMessage}
                        </p>
                      )}

                      {!selectedMarker.technicalCall ? (
                        <button
                          type="button"
                          onClick={() => {
                            ensureMarkerTechnicalCall(selectedMarker.id);
                            window.requestAnimationFrame(() => {
                              technicalCallCodeInputRef.current?.focus();
                            });
                          }}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          {t("video.technical.createCall")}
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <label className="block text-[11px] text-slate-600">
                            {t("video.technical.quickPreset")}
                            <select
                              defaultValue=""
                              onChange={(event) => {
                                if (!selectedMarkerId) {
                                  return;
                                }

                                const preset = technicalCallPresetLookup.get(event.target.value);

                                if (!preset) {
                                  return;
                                }

                                updateMarkerTechnicalCall(selectedMarkerId, (current) => ({
                                  ...current,
                                  code: preset.code,
                                  displayName: preset.displayName,
                                  elementType: preset.elementType,
                                  status: "pending",
                                }));

                                event.currentTarget.value = "";
                              }}
                              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                              aria-label={t("video.aria.technicalPreset")}
                            >
                              <option value="">{t("video.technical.selectPreset")}</option>
                              <optgroup label={t("video.technical.presetGroups.jumps")}>
                                {technicalCallPresetsByType.jump.map((preset) => (
                                  <option key={preset.id} value={preset.id}>
                                    {preset.code} - {preset.displayName}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label={t("video.technical.presetGroups.spins")}>
                                {technicalCallPresetsByType.spin.map((preset) => (
                                  <option key={preset.id} value={preset.id}>
                                    {preset.code} - {preset.displayName}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label={t("video.technical.presetGroups.sequences")}>
                                {technicalCallPresetsByType.sequence.map((preset) => (
                                  <option key={preset.id} value={preset.id}>
                                    {preset.code} - {preset.displayName}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label={t("video.technical.presetGroups.falls")}>
                                {technicalCallPresetsByType.fall.map((preset) => (
                                  <option key={preset.id} value={preset.id}>
                                    {preset.code} - {preset.displayName}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label={t("video.technical.presetGroups.notes")}>
                                {technicalCallPresetsByType.note.map((preset) => (
                                  <option key={preset.id} value={preset.id}>
                                    {preset.code} - {preset.displayName}
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </label>

                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <label className="text-[11px] text-slate-600">
                              {t("video.technical.fields.code")}
                              <input
                                ref={technicalCallCodeInputRef}
                                type="text"
                                value={selectedMarker.technicalCall.code}
                                onChange={(event) => {
                                  updateMarkerTechnicalCall(selectedMarker.id, (current) => ({
                                    ...current,
                                    code: event.target.value.slice(0, 24),
                                  }));
                                }}
                                maxLength={24}
                                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                                aria-label={t("video.aria.technicalCode")}
                              />
                            </label>

                            <label className="text-[11px] text-slate-600">
                              {t("video.technical.fields.displayName")}
                              <input
                                type="text"
                                value={selectedMarker.technicalCall.displayName}
                                onChange={(event) => {
                                  updateMarkerTechnicalCall(selectedMarker.id, (current) => ({
                                    ...current,
                                    displayName: event.target.value.slice(0, 80),
                                  }));
                                }}
                                maxLength={80}
                                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                                aria-label={t("video.aria.technicalDisplayName")}
                              />
                            </label>
                          </div>

                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <label className="text-[11px] text-slate-600">
                              {t("video.technical.fields.elementType")}
                              <select
                                value={selectedMarker.technicalCall.elementType}
                                onChange={(event) => {
                                  const nextType = event.target.value as TechnicalElementType;

                                  if (!SUPPORTED_TECHNICAL_ELEMENT_TYPES.includes(nextType)) {
                                    return;
                                  }

                                  updateMarkerTechnicalCall(selectedMarker.id, (current) => ({
                                    ...current,
                                    elementType: nextType,
                                  }));
                                }}
                                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                                aria-label={t("video.aria.technicalElementType")}
                              >
                                {SUPPORTED_TECHNICAL_ELEMENT_TYPES.map((type) => (
                                  <option key={type} value={type}>
                                    {technicalElementTypeLabel(type)}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label className="text-[11px] text-slate-600">
                              {t("video.technical.fields.status")}
                              <select
                                value={selectedMarker.technicalCall.status}
                                onChange={(event) => {
                                  const nextStatus = event.target.value as TechnicalCallStatus;

                                  if (!SUPPORTED_TECHNICAL_STATUSES.includes(nextStatus)) {
                                    return;
                                  }

                                  updateMarkerTechnicalCall(selectedMarker.id, (current) => ({
                                    ...current,
                                    status: nextStatus,
                                  }));
                                }}
                                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                                aria-label={t("video.aria.technicalStatus")}
                              >
                                {SUPPORTED_TECHNICAL_STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {technicalStatusLabel(status)}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label className="text-[11px] text-slate-600">
                              {t("video.technical.fields.goe")}
                              <input
                                type="number"
                                min={-3}
                                max={3}
                                step={1}
                                value={selectedMarker.technicalCall.goeGrade ?? ""}
                                onChange={(event) => {
                                  const rawValue = event.target.value;

                                  if (!rawValue) {
                                    updateMarkerTechnicalCall(selectedMarker.id, (current) => ({
                                      ...current,
                                      goeGrade: undefined,
                                    }));
                                    return;
                                  }

                                  const parsed = Number(rawValue);
                                  const sanitizedGoe = sanitizeGoeGrade(parsed);

                                  updateMarkerTechnicalCall(selectedMarker.id, (current) => ({
                                    ...current,
                                    goeGrade: sanitizedGoe,
                                  }));
                                }}
                                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                                aria-label={t("video.aria.technicalGoe")}
                              />
                            </label>
                          </div>

                          <label className="block text-[11px] text-slate-600">
                            {t("video.technical.fields.notes")}
                            <textarea
                              value={selectedMarker.technicalCall.notes ?? ""}
                              onChange={(event) => {
                                updateMarkerTechnicalCall(selectedMarker.id, (current) => ({
                                  ...current,
                                  notes: event.target.value.slice(0, 240),
                                }));
                              }}
                              rows={2}
                              className="mt-1 w-full resize-y rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                              aria-label={t("video.aria.technicalNotes")}
                            />
                          </label>

                          <div className="flex flex-wrap gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                updateMarkerTechnicalCall(selectedMarker.id, (current) => ({
                                  ...current,
                                  status: "confirmed",
                                }));
                              }}
                              className="rounded-md border border-emerald-300 bg-white px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
                            >
                              {t("video.technical.actions.confirm")}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                updateMarkerTechnicalCall(selectedMarker.id, (current) => ({
                                  ...current,
                                  status: "invalid",
                                }));
                              }}
                              className="rounded-md border border-amber-300 bg-white px-2 py-1 text-xs text-amber-700 hover:bg-amber-50"
                            >
                              {t("video.technical.actions.markInvalid")}
                            </button>

                            <button
                              type="button"
                              onClick={() => clearMarkerTechnicalCall(selectedMarker.id)}
                              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                            >
                              {t("video.technical.actions.clearCall")}
                            </button>

                            <button
                              type="button"
                              onClick={() => sendMarkerTechnicalCallToPlanner(selectedMarker.id)}
                              disabled={!isTransferableTechnicalCall(selectedMarker.technicalCall)}
                              className="rounded-md border border-blue-300 bg-white px-2 py-1 text-xs font-medium text-blue-700 enabled:hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {t("video.technical.actions.send")}
                            </button>

                            {selectedMarker.technicalTransfer && (
                              <button
                                type="button"
                                onClick={() => sendMarkerTechnicalCallToPlanner(selectedMarker.id, true)}
                                disabled={!isTransferableTechnicalCall(selectedMarker.technicalCall)}
                                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {t("video.technical.actions.resend")}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {markers.map((marker) => {
                    const markerMeta = markerTypeMeta(marker.type);
                    const isActive = activeMarkerId === marker.id;
                    const technicalCall = marker.technicalCall;
                    const transferStatusLabel = getTransferStatusLabel(marker.technicalTransfer);

                    return (
                      <div
                        key={marker.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setSelectedMarkerId(marker.id);
                          seekToTime(marker.time);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedMarkerId(marker.id);
                            seekToTime(marker.time);
                          }
                        }}
                        className={`rounded-md border p-2 text-left transition ${
                          isActive || selectedMarkerId === marker.id
                            ? "border-slate-900 bg-slate-100"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="mb-2 flex items-center gap-2 text-xs">
                          <span className="font-semibold tabular-nums text-slate-700">
                            {formatTime(marker.time)}
                          </span>
                          <span className="rounded border border-slate-300 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            {markerMeta.label}
                          </span>
                          <span className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-600">
                            {transferStatusLabel}
                          </span>
                          {technicalCall && (
                            <span className="truncate text-[10px] text-slate-500" title={technicalCall.displayName || technicalCall.code}>
                              {technicalCall.code || t("video.placeholders.noCode")} • {technicalCall.displayName || t("video.placeholders.noName")} • {technicalStatusLabel(technicalCall.status)}
                              {typeof technicalCall.goeGrade === "number"
                                ? ` • GOE ${technicalCall.goeGrade >= 0 ? "+" : ""}${technicalCall.goeGrade}`
                                : ""}
                            </span>
                          )}
                        </div>

                        <input
                          type="text"
                          value={marker.label}
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) =>
                            updateMarkerLabel(marker.id, event.target.value)
                          }
                          maxLength={50}
                          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
                          aria-label={t("video.aria.markerLabelAt", { time: formatTime(marker.time) })}
                        />

                        <select
                          value={marker.type}
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) => updateMarkerType(marker.id, event.target.value)}
                          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                          aria-label={t("video.aria.markerTypeAt", { time: formatTime(marker.time) })}
                        >
                          {markerTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <div className="mt-2 flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              seekToTime(marker.time);
                            }}
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                          >
                            {t("video.markers.go")}
                          </button>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              moveMarkerToCurrentTime(marker.id);
                            }}
                            disabled={!canManageMarkers}
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {t("video.markers.moveToCurrentTime")}
                          </button>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              removeMarker(marker.id);
                            }}
                            className="rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                          >
                            {t("video.markers.remove")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </WorkspacePanel>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}