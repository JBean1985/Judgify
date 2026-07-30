"use client";

import Link from "next/link";

import { ArrowLeft, Circle } from "lucide-react";
import { useTranslation } from "@/shared/i18n";

interface WorkspaceHeaderProps {
  title: string;
  saved?: boolean;
}

export default function WorkspaceHeader({
  title,
  saved = false,
}: WorkspaceHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="mb-8 border-b border-slate-200 pb-5">
      <div className="flex items-center justify-between">

        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />

          <span>{t("planner.header.home")}</span>
        </Link>

        <h1 className="text-2xl font-semibold text-slate-900">
          {title}
        </h1>

        <div className="flex items-center gap-2 text-sm">
          <Circle
            size={10}
            className={
              saved
                ? "fill-green-500 text-green-500"
                : "fill-amber-500 text-amber-500"
            }
          />

          <span className="text-slate-500">
            {saved ? t("planner.header.saved") : t("planner.header.unsaved")}
          </span>
        </div>

      </div>
    </header>
  );
}