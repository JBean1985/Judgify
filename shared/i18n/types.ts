import type { Locale } from "./locales";

export interface CommonTranslations {
  language: string;
  localeSelectorAriaLabel: string;
  languages: Record<Locale, string>;
  actions: {
    continue: string;
    close: string;
  };
  placeholders: {
    inDevelopment: string;
  };
  status: {
    alpha: string;
  };
  settings: {
    title: string;
    openAriaLabel: string;
    openTooltip: string;
    closeAriaLabel: string;
    closeTooltip: string;
    sections: {
      language: string;
      appearance: string;
      video: string;
    };
    languageDescription: string;
    appearanceOptions: {
      system: string;
      light: string;
      dark: string;
    };
    video: {
      restoreLastVideo: string;
      confirmDeleteMarkers: string;
      showKeyboardShortcutHints: string;
      confirmDeleteSingleMarker: string;
      confirmDeleteAllMarkers: string;
    };
  };
}

export interface NavigationTranslations {
  workspaceAriaLabel: string;
  brandSubtitle: string;
  sidebar: {
    dashboard: string;
    planner: string;
    video: string;
    live: string;
    athletes: string;
    settings: string;
  };
}

export interface DashboardTranslations {
  header: {
    searchPlaceholder: string;
    notificationsPlaceholder: string;
    userAvatarPlaceholder: string;
    greeting: {
      morning: string;
      afternoon: string;
      evening: string;
    };
    greetingWithName: string;
    fallbackUserName: string;
  };
  statusBar: {
    version: string;
    mockDataMode: string;
    allSystemsOperational: string;
  };
  modules: {
    planner: string;
    video: string;
    athletes: string;
    live: string;
  };
  continueWorking: {
    title: string;
    subtitle: string;
    emptyState: string;
  };
  projects: {
    planner: {
      title: string;
      context: string;
      lastWorkedAt: string;
    };
    video: {
      title: string;
      context: string;
      lastWorkedAt: string;
    };
    athletes: {
      title: string;
      context: string;
      lastWorkedAt: string;
    };
  };
  quickActions: {
    title: string;
    subtitle: string;
    emptyState: string;
    newProgram: {
      title: string;
      description: string;
    };
    newVideoAnalysis: {
      title: string;
      description: string;
    };
    newAthlete: {
      title: string;
      description: string;
    };
    newCompetition: {
      title: string;
      description: string;
    };
  };
  recentActivity: {
    title: string;
    subtitle: string;
    emptyState: string;
    activity1: {
      title: string;
      details: string;
      happenedAt: string;
    };
    activity2: {
      title: string;
      details: string;
      happenedAt: string;
    };
    activity3: {
      title: string;
      details: string;
      happenedAt: string;
    };
    activity4: {
      title: string;
      details: string;
      happenedAt: string;
    };
  };
}

export interface PlannerTranslations {
  shellTitle: string;
  workspaceTitle: string;
  header: {
    home: string;
    saved: string;
    unsaved: string;
  };
  emptyState: {
    title: string;
    description: string;
    backHome: string;
  };
  context: {
    athlete: string;
    category: string;
    discipline: string;
    program: string;
    rules: string;
  };
  programType: {
    short: string;
    long: string;
    unknown: string;
  };
  ruleProfile: {
    legacy: string;
    draft: string;
  };
  library: {
    title: string;
  };
}

export interface VideoTranslations {
  header: {
    home: string;
    title: string;
    subtitle: string;
  };
  statusBar: {
    videoLoaded: string;
    noVideo: string;
    stateLocalOnly: string;
    shortcuts: string;
  };
  video: {
    panelTitle: string;
    panelSubtitle: string;
    loadVideo: string;
    replaceVideo: string;
    removeVideo: string;
    restoringSaved: string;
    restoringAnalysis: string;
    loadedFile: string;
    privacyNote: string;
  };
  messages: {
    invalidFile: string;
    storageQuota: string;
    restoreMarkersFailed: string;
    restoreVideoFailed: string;
    playbackBlocked: string;
    fullscreenUnavailable: string;
  };
  player: {
    title: string;
    subtitle: string;
    restoringTitle: string;
    restoringSubtitle: string;
    noVideoTitle: string;
    noVideoSubtitle: string;
    currentTime: string;
    duration: string;
  };
  controls: {
    play: string;
    pause: string;
    rewind: string;
    forward: string;
    previousFrame: string;
    nextFrame: string;
    fullscreen: string;
    volume: string;
    speed: string;
    playbackSpeed: string;
    seek: string;
  };
  markers: {
    marker: string;
    markers: string;
    addMarker: string;
    addMarkerAction: string;
    clearMarkers: string;
    shortLabelPlaceholder: string;
    labelField: string;
    typeField: string;
    localInfo: string;
    noMarkers: string;
    editor: string;
    countSingular: string;
    countPlural: string;
    go: string;
    moveToCurrentTime: string;
    remove: string;
    previousMarker: string;
    nextMarker: string;
    editMarker: string;
    deleteMarker: string;
    timestamp: string;
    reviewMode: string;
    loopMode: string;
  };
  timeline: {
    title: string;
    playhead: string;
    zoomIn: string;
    zoomOut: string;
    resetZoom: string;
    fitVideo: string;
    centerPlayhead: string;
    centerSelectedMarker: string;
    zoomHint: string;
    seekInTimeline: string;
    dragPlayhead: string;
  };
  markerType: {
    jump: string;
    spin: string;
    spinPlural: string;
    sequence: string;
    choreographic: string;
    fall: string;
    note: string;
  };
  markerTypeShort: {
    jump: string;
    spin: string;
    sequence: string;
    fall: string;
    note: string;
  };
  technical: {
    title: string;
    subtitle: string;
    editorLabel: string;
    createCall: string;
    quickPreset: string;
    selectPreset: string;
    presetGroups: {
      jumps: string;
      spins: string;
      sequences: string;
      falls: string;
      notes: string;
    };
    fields: {
      code: string;
      displayName: string;
      elementType: string;
      status: string;
      goe: string;
      notes: string;
    };
    actions: {
      clearCall: string;
      confirm: string;
      markInvalid: string;
      send: string;
      resend: string;
    };
  };
  technicalStatus: {
    pending: string;
    confirmed: string;
    invalid: string;
  };
  transfer: {
    notSent: string;
    sent: string;
    sentWithWarning: string;
    alreadySent: string;
    sentSuccess: string;
    sentWithBV0Warning: string;
    failed: string;
  };
  placeholders: {
    noCode: string;
    noName: string;
    technicalBadgeDefault: string;
  };
  aria: {
    volume: string;
    playbackSpeed: string;
    seekVideo: string;
    markerTypeSelect: string;
    markerLabelInput: string;
    seekTimeline: string;
    gotoMarker: string;
    dragPlayhead: string;
    technicalPreset: string;
    technicalCode: string;
    technicalDisplayName: string;
    technicalElementType: string;
    technicalStatus: string;
    technicalGoe: string;
    technicalNotes: string;
    markerLabelAt: string;
    markerTypeAt: string;
  };
}

export interface TranslationSchema {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  dashboard: DashboardTranslations;
  planner: PlannerTranslations;
  video: VideoTranslations;
}

type Primitive = string | number | boolean | null | undefined;

type LeafKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends Primitive
    ? `${Prefix}${K}`
    : LeafKeys<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type TranslationKey = LeafKeys<TranslationSchema>;

export type TranslationValues = Record<string, string | number>;
