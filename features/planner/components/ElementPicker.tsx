"use client";

import { Card } from "@/shared/components";

export default function ElementPicker() {
  return (
    <Card>

      <h2 className="text-xl font-bold">
        Adicionar Elemento
      </h2>

      <p className="mt-2 text-slate-500">
        Escolha o tipo de elemento.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <PickerButton
          title="Saltos"
        />

        <PickerButton
          title="Piruetas"
        />

        <PickerButton
          title="Sequências"
        />

        <PickerButton
          title="Coreografia"
        />

      </div>

    </Card>
  );
}

interface PickerButtonProps {
  title: string;
}

function PickerButton({
  title,
}: PickerButtonProps) {
  return (
    <button
      className="
        rounded-xl
        border
        border-slate-300
        p-6
        text-left
        transition
        hover:border-blue-600
        hover:bg-blue-50
      "
    >
      <span className="font-semibold">
        {title}
      </span>
    </button>
  );
}