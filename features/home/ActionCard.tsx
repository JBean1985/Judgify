"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { HomeAction } from "./actions";

interface Props {
  action: HomeAction;
}

export default function ActionCard({
  action,
}: Props) {
  const Icon = action.icon;

  return (
    <Link
      href={action.href}
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        transition-all
        hover:-translate-y-1
        hover:border-blue-500
        hover:shadow-md
      "
    >
      <div className="flex items-center justify-between">

        <div className="rounded-xl bg-blue-100 p-2.5">
          <Icon
            size={22}
            className="text-blue-600"
          />
        </div>

        <ChevronRight
          size={18}
          className="
            text-slate-400
            transition
            group-hover:text-blue-600
          "
        />

      </div>

      <h2 className="mt-4 text-lg font-semibold">
        {action.title}
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        {action.description}
      </p>

    </Link>
  );
}