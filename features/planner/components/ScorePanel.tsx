import { Card } from "@/shared/components";

export default function ScorePanel() {
  return (
    <Card>

      <h2 className="text-xl font-bold">
        Resumo
      </h2>

      <div className="mt-6 space-y-4">

        <Row
          label="Valor Base"
          value="0.00"
        />

        <Row
          label="GOE"
          value="0.00"
        />

        <Row
          label="TES"
          value="0.00"
        />

        <Row
          label="PCS"
          value="0.00"
        />

        <Row
          label="Deduções"
          value="0.00"
        />

      </div>

      <div className="mt-8 border-t pt-4">

        <Row
          label="Pontuação Prevista"
          value="0.00"
          bold
        />

      </div>

    </Card>
  );
}

interface RowProps {
  label: string;
  value: string;
  bold?: boolean;
}

function Row({
  label,
  value,
  bold = false,
}: RowProps) {
  return (
    <div className="flex justify-between">

      <span
        className={
          bold
            ? "font-bold"
            : "text-slate-600"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "font-bold"
            : "font-medium"
        }
      >
        {value}
      </span>

    </div>
  );
}