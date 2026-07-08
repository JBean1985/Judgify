"use client";

import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({
  onClick,
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-blue-600
        text-white
        shadow-lg
        transition
        hover:bg-blue-700
        lg:hidden
      "
      aria-label="Adicionar elemento"
    >
      <Plus size={28} />
    </button>
  );
}