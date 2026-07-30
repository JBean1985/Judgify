"use client";

import { useTranslation } from "@/shared/i18n";

export default function LivePage() {
  const { t } = useTranslation();

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold">
        {t("navigation.sidebar.live")}
      </h1>

      <p className="mt-4 text-slate-600">
        {t("common.placeholders.inDevelopment")}
      </p>

    </div>
  );
}