import type { Locale } from "../locales";
import type { TranslationSchema } from "../types";
import { enDashboard } from "./en/dashboard";
import { enCommon } from "./en/common";
import { enNavigation } from "./en/navigation";
import { enPlanner } from "./en/planner";
import { enVideo } from "./en/video";
import { esCommon } from "./es/common";
import { esVideo } from "./es/video";
import { frCommon } from "./fr/common";
import { frVideo } from "./fr/video";
import { itCommon } from "./it/common";
import { itVideo } from "./it/video";
import { ptDashboard } from "./pt/dashboard";
import { ptCommon } from "./pt/common";
import { ptNavigation } from "./pt/navigation";
import { ptPlanner } from "./pt/planner";
import { ptVideo } from "./pt/video";

export const translations: Record<Locale, TranslationSchema> = {
  "pt-PT": {
    common: ptCommon,
    navigation: ptNavigation,
    dashboard: ptDashboard,
    planner: ptPlanner,
    video: ptVideo,
  },
  en: {
    common: enCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    planner: enPlanner,
    video: enVideo,
  },
  es: {
    common: esCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    planner: enPlanner,
    video: esVideo,
  },
  fr: {
    common: frCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    planner: enPlanner,
    video: frVideo,
  },
  it: {
    common: itCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    planner: enPlanner,
    video: itVideo,
  },
};
