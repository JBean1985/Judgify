"use client";

interface AssistantResponseProps {
  message: string;
}

export default function AssistantResponse({
  message,
}: AssistantResponseProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="
        mt-6
        rounded-2xl
        border
        border-blue-200
        bg-blue-50
        p-4
      "
    >
      <div className="flex items-start gap-3">

        <div className="text-2xl">
          🤖
        </div>

        <div>

          <h3 className="font-semibold text-slate-900">
            Judgy
          </h3>

          <p className="mt-1 text-slate-700">
            {message}
          </p>

        </div>

      </div>

    </div>
  );
}