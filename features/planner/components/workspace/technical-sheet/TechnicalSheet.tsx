"use client";

import { useMemo, useState } from "react";

import { ContextEngine } from "@/features/core/context";
import { DEFAULT_LOCALE } from "@/shared/i18n/locales";

import { useWorkspace } from "../../../context";
import { ScoreEngine } from "../../../engine/ScoreEngine";
import { TechnicalEngine } from "../../../engine/TechnicalEngine";
import { ValidationEngine } from "../../../engine/ValidationEngine";

import TechnicalElementCard from "./TechnicalElementCard";

const goeGradeOptions = [-3, -2, -1, 0, 1, 2, 3];
const statusOptions = [
  { value: "valid", label: "Válido" },
  { value: "warning", label: "Atenção" },
  { value: "invalid", label: "Inválido" },
] as const;

export default function TechnicalSheet() {
  const {
    elements,
    deductions,
    pcs,
    clearProgram,
    updateElement,
    moveElementUp,
    moveElementDown,
    removeElement,
    duplicateElement,
  } = useWorkspace();
  const [expandedElementId, setExpandedElementId] = useState<
    string | null
  >(null);

  const technical = useMemo(() => {
    return TechnicalEngine.calculate(elements);
  }, [elements]);

  const score = useMemo(() => {
    return ScoreEngine.calculate(elements, deductions, pcs);
  }, [elements, deductions, pcs]);

  const context = ContextEngine.get();

  const validation = useMemo(() => {
    return ValidationEngine.validate(
      elements,
      context.category,
      context.discipline,
      context.programType
    );
  }, [
    elements,
    context.category,
    context.discipline,
    context.programType,
  ]);

  function getStatusLabel(status?: string) {
    if (status === "invalid") return "Inválido";
    if (status === "warning") return "Atenção";
    return "Válido";
  }

  function getStatusClasses(status?: string) {
    if (status === "invalid") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (status === "warning") {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    return "bg-green-50 text-green-700 border-green-200";
  }

  function toggleExpandedElement(elementId: string) {
    setExpandedElementId((current) =>
      current === elementId ? null : elementId
    );
  }

  function handleInlineGoeChange(
    elementId: string,
    code: string,
    grade: number
  ) {
    const goeValue = TechnicalEngine.getGoeValue(code, grade);

    updateElement(elementId, {
      goeGrade: grade,
      goeValue,
    });
  }

  function handleInlineBaseValueChange(
    elementId: string,
    rawValue: string
  ) {
    const parsedValue = Number(rawValue);

    updateElement(elementId, {
      baseValue: Number.isFinite(parsedValue) ? parsedValue : 0,
    });
  }

  function getProgramTypeLabel(programType?: string): string {
    if (programType === "short") return "Curto";
    if (programType === "long") return "Longo";
    return "-";
  }

  function getRuleProfileLabel(): string {
    const federation = context.ruleProfile?.federation ?? "legacy";
    const season = context.ruleProfile?.season ?? "legacy";

    if (federation === "legacy" || season === "legacy") {
      return "Legacy";
    }

    if (federation === "fpp" && season === "2026") {
      return "FPP 2026 - Draft";
    }

    if (federation === "fpp") {
      return `FPP ${season}`;
    }

    if (federation === "world-skate") {
      return `World Skate ${season}`;
    }

    return "Legacy";
  }

  function formatNumber(value: number): string {
    const numericValue = Number(value);
    return (Number.isFinite(numericValue) ? numericValue : 0).toFixed(2);
  }

  function getPcsRows() {
    const { pcsBreakdown } = score;

    return [
      ["Skating Skills", pcsBreakdown.skatingSkills],
      ["Transitions", pcsBreakdown.transitions],
      ["Performance", pcsBreakdown.performance],
      ["Composition", pcsBreakdown.composition],
    ] as const;
  }

  function escapeHtml(value: string): string {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function handleExportSummary() {
    const ruleProfileLabel = getRuleProfileLabel();
    const pcsRows = getPcsRows();
    const hasPcs = score.pcs > 0;

    const headerLines = [
      "JUDGIFY - RESUMO DO ESQUEMA",
      "",
      `Atleta: ${context.athlete ?? "-"}`,
      `Categoria: ${context.category ?? "-"}`,
      `Disciplina: ${context.discipline ?? "-"}`,
      `Tipo de Programa: ${getProgramTypeLabel(
        context.programType
      )}`,
      `Perfil de Regras: ${ruleProfileLabel}`,
      "",
      "ELEMENTOS",
      "Ordem | Codigo | Nome | BV | GOE Grade | GOE Valor | Total | Estado | Notas",
    ];

    const elementLines = elements.map((element, index) => {
      const baseValue = Number.isFinite(element.baseValue)
        ? element.baseValue
        : 0;
      const goeValueNumber = Number.isFinite(element.goeValue)
        ? element.goeValue
        : 0;
      const elementTotal = baseValue + goeValueNumber;
      const goeGrade = Number.isFinite(element.goeGrade)
        ? element.goeGrade
        : 0;

      return [
        index + 1,
        element.code,
        element.name,
        formatNumber(baseValue),
        goeGrade > 0 ? `+${goeGrade}` : String(goeGrade),
        goeValueNumber > 0
          ? `+${formatNumber(goeValueNumber)}`
          : formatNumber(goeValueNumber),
        formatNumber(elementTotal),
        getStatusLabel(element.status),
        (element.notes ?? "").replaceAll("\n", " "),
      ].join(" | ");
    });

    const totalsLines = [
      "",
      "TECHNICAL SCORE",
      `Base Value      : ${formatNumber(score.baseValue)}`,
      `${score.goe > 0 ? "GOE             : +" : "GOE             : "}${formatNumber(score.goe)}`,
      `TES             : ${formatNumber(score.tes)}`,
      "",
      "PROGRAM COMPONENTS",
      ...pcsRows.map(
        ([label, value]) =>
          `${label.padEnd(15, " ")}: ${formatNumber(value)}`
      ),
      `PCS Total       : ${formatNumber(score.pcs)}`,
      ...(hasPcs ? [] : ["PCS ainda não preenchido"]),
      "",
      "DEDUCTIONS",
      ...(score.deductionItems.length === 0
        ? ["Sem deduções"]
        : score.deductionItems.map(
            (item, index) =>
              `${String(index + 1).padStart(2, "0")}. ${item.label}: ${formatNumber(item.value)}`
          )),
      `Deductions Total: ${formatNumber(score.deductions)}`,
      "",
      "FINAL SCORE",
      `Final Score     : ${formatNumber(score.finalScore)}`,
      "Formula         : TES + PCS - Deductions",
      "",
      "VALIDACAO",
    ];

    const validationLines =
      validation.messages.length === 0
        ? ["Sem mensagens de validacao."]
        : validation.messages.map(
            (message) =>
              `[${message.type.toUpperCase()}] ${message.message}`
          );

    const content = [
      ...headerLines,
      ...(elementLines.length > 0
        ? elementLines
        : ["Sem elementos no esquema."]),
      ...totalsLines,
      ...validationLines,
      "",
    ].join("\n");

    const file = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

    link.href = url;
    link.download = `judgify-resumo-${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handlePrintSummary() {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      window.alert(
        "Nao foi possivel abrir a janela de impressao. Verifique se o bloqueador de pop-ups esta ativo."
      );
      return;
    }

    const ruleProfileLabel = getRuleProfileLabel();
    const pcsRows = getPcsRows();
    const hasPcs = score.pcs > 0;

    const elementsRows =
      elements.length === 0
        ? '<tr><td colspan="9" class="empty">Sem elementos no esquema.</td></tr>'
        : elements
            .map((element, index) => {
              const baseValue = Number.isFinite(element.baseValue)
                ? element.baseValue
                : 0;
              const goeValueNumber = Number.isFinite(element.goeValue)
                ? element.goeValue
                : 0;
              const elementTotal = baseValue + goeValueNumber;
              const goeGradeNumber = Number.isFinite(element.goeGrade)
                ? element.goeGrade
                : 0;

              const goeGrade =
                goeGradeNumber > 0
                  ? `+${goeGradeNumber}`
                  : String(goeGradeNumber);

              const goeValue =
                goeValueNumber > 0
                  ? `+${formatNumber(goeValueNumber)}`
                  : formatNumber(goeValueNumber);

              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${escapeHtml(element.code)}</td>
                  <td>${escapeHtml(element.name)}</td>
                  <td class="num">${formatNumber(baseValue)}</td>
                  <td class="num">${goeGrade}</td>
                  <td class="num">${goeValue}</td>
                  <td class="num">${formatNumber(elementTotal)}</td>
                  <td>${escapeHtml(getStatusLabel(element.status))}</td>
                  <td>${escapeHtml((element.notes ?? "").replaceAll("\n", " "))}</td>
                </tr>
              `;
            })
            .join("");

    const pcsRowsHtml = pcsRows
      .map(
        ([label, value]) => `
          <tr>
            <td>${escapeHtml(label)}</td>
            <td class="num">${formatNumber(value)}</td>
          </tr>
        `
      )
      .join("");

    const deductionRowsHtml =
      score.deductionItems.length === 0
        ? '<tr><td colspan="2" class="empty">Sem deduções</td></tr>'
        : score.deductionItems
            .map(
              (item) => `
              <tr>
                <td>${escapeHtml(item.label)}</td>
                <td class="num">${formatNumber(item.value)}</td>
              </tr>
            `
            )
            .join("");

    const validationItems =
      validation.messages.length === 0
        ? "<li>Sem mensagens de validacao.</li>"
        : validation.messages
            .map(
              (message) =>
                `<li><strong>[${escapeHtml(
                  message.type.toUpperCase()
                )}]</strong> ${escapeHtml(message.message)}</li>`
            )
            .join("");

    const html = `
      <!doctype html>
      <html lang="${DEFAULT_LOCALE}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Judgify - Resumo do Esquema</title>
        <style>
          :root {
            color-scheme: light;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 24px;
            font-family: "Segoe UI", Tahoma, sans-serif;
            color: #0f172a;
            background: #ffffff;
          }

          h1 {
            margin: 0 0 6px;
            font-size: 22px;
          }

          .subtitle {
            margin: 0 0 18px;
            color: #475569;
            font-size: 13px;
          }

          .meta {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px 14px;
            margin-bottom: 18px;
          }

          .meta-item {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 8px 10px;
          }

          .meta-label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .meta-value {
            margin-top: 2px;
            font-size: 13px;
            font-weight: 600;
          }

          h2 {
            margin: 16px 0 8px;
            font-size: 15px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          thead th {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 7px 6px;
            text-align: left;
          }

          tbody td {
            border: 1px solid #e2e8f0;
            padding: 6px;
            vertical-align: top;
          }

          .num {
            text-align: right;
            font-variant-numeric: tabular-nums;
          }

          .empty {
            text-align: center;
            color: #64748b;
          }

          .totals {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 8px;
            margin-top: 10px;
          }

          .total-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 8px 10px;
          }

          .total-label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .total-value {
            margin-top: 2px;
            font-size: 14px;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
          }

          .final-score-box {
            margin-top: 10px;
            border: 2px solid #0f172a;
            border-radius: 10px;
            padding: 10px 12px;
            background: #f8fafc;
          }

          .final-score-label {
            font-size: 11px;
            color: #334155;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 700;
          }

          .final-score-value {
            margin-top: 4px;
            font-size: 22px;
            font-weight: 800;
            font-variant-numeric: tabular-nums;
            color: #0f172a;
          }

          .formula-label {
            margin-top: 4px;
            font-size: 11px;
            color: #475569;
          }

          ul {
            margin: 8px 0 0;
            padding-left: 18px;
            font-size: 12px;
          }

          li {
            margin: 4px 0;
          }

          @media print {
            body {
              padding: 10mm;
            }

            .meta {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .totals {
              grid-template-columns: repeat(4, minmax(0, 1fr));
            }
          }
        </style>
      </head>
      <body>
        <h1>Judgify - Resumo do Esquema</h1>
        <p class="subtitle">Relatorio tecnico para impressao / PDF</p>

        <section class="meta">
          <div class="meta-item">
            <div class="meta-label">Atleta</div>
            <div class="meta-value">${escapeHtml(
              context.athlete ?? "-"
            )}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Categoria</div>
            <div class="meta-value">${escapeHtml(
              context.category ?? "-"
            )}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Disciplina</div>
            <div class="meta-value">${escapeHtml(
              context.discipline ?? "-"
            )}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Tipo de Programa</div>
            <div class="meta-value">${escapeHtml(
              getProgramTypeLabel(context.programType)
            )}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Perfil de Regras</div>
            <div class="meta-value">${escapeHtml(ruleProfileLabel)}</div>
          </div>
        </section>

        <h2>Elementos</h2>
        <table>
          <thead>
            <tr>
              <th>Ordem</th>
              <th>Codigo</th>
              <th>Nome</th>
              <th class="num">BV</th>
              <th class="num">GOE</th>
              <th class="num">GOE Valor</th>
              <th class="num">Total</th>
              <th>Estado</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            ${elementsRows}
          </tbody>
        </table>

        <h2>Technical Score</h2>
        <table>
          <thead>
            <tr>
              <th>Métrica</th>
              <th class="num">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Base Value</td>
              <td class="num">${formatNumber(score.baseValue)}</td>
            </tr>
            <tr>
              <td>GOE</td>
              <td class="num">${score.goe > 0 ? "+" : ""}${formatNumber(score.goe)}</td>
            </tr>
            <tr>
              <td><strong>TES</strong></td>
              <td class="num"><strong>${formatNumber(score.tes)}</strong></td>
            </tr>
          </tbody>
        </table>

        <h2>Program Components</h2>
        <table>
          <thead>
            <tr>
              <th>Componente</th>
              <th class="num">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${pcsRowsHtml}
            <tr>
              <td><strong>PCS Total</strong></td>
              <td class="num"><strong>${formatNumber(score.pcs)}</strong></td>
            </tr>
          </tbody>
        </table>
        ${
          hasPcs
            ? ""
            : '<p class="subtitle" style="margin-top:8px; margin-bottom:0;">PCS ainda não preenchido</p>'
        }

        <h2>Deduções</h2>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th class="num">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${deductionRowsHtml}
            <tr>
              <td><strong>Total deduções</strong></td>
              <td class="num"><strong>${formatNumber(score.deductions)}</strong></td>
            </tr>
          </tbody>
        </table>

        <h2>Final Score</h2>
        <div class="final-score-box">
          <div class="final-score-label">Final Score</div>
          <div class="final-score-value">${formatNumber(score.finalScore)}</div>
          <div class="formula-label">TES + PCS - Deductions</div>
        </div>

        <h2>Validacao</h2>
        <ul>
          ${validationItems}
        </ul>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    window.setTimeout(() => {
      if (printWindow.closed) {
        return;
      }

      printWindow.focus();
      printWindow.print();
    }, 250);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-3">
        <div>
          <h2 className="text-base font-semibold">Folha Técnica</h2>

          <p className="mt-1 text-xs text-slate-500">
            Programa em construção
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">
            {elements.length} elemento{elements.length !== 1 ? "s" : ""}
          </span>

          <button
            onClick={handleExportSummary}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100"
          >
            Exportar resumo
          </button>

          <button
            onClick={handlePrintSummary}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100"
          >
            Imprimir / PDF
          </button>

          {elements.length > 0 && (
            <button
              onClick={clearProgram}
              className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 transition hover:bg-red-50"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="p-3">
        {elements.length === 0 ? (
          <div className="flex min-h-[260px] items-center justify-center rounded-xl border-2 border-dashed border-slate-200">
            <div className="text-center">
              <h3 className="text-sm font-medium text-slate-500">
                A Folha Técnica está vazia
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Adicione elementos através da Biblioteca para começar.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200">
            <div className="grid grid-cols-[48px_minmax(160px,1fr)_96px_84px_84px_minmax(140px,1fr)_112px_88px] items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <span>Ordem</span>
              <span>Elemento</span>
              <span className="text-right">Base Value</span>
              <span className="text-right">GOE</span>
              <span className="text-right">Total</span>
              <span>Notas</span>
              <span className="text-center">Ações</span>
              <span className="text-center">Status</span>
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {elements.map((element, index) => {
                const elementTotal =
                  element.baseValue + element.goeValue;

                const isExpanded =
                  expandedElementId === element.id;

                return (
                  <div
                    key={element.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleExpandedElement(element.id)}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          toggleExpandedElement(element.id);
                        }
                      }}
                      className="grid w-full grid-cols-[48px_minmax(160px,1fr)_96px_84px_84px_minmax(140px,1fr)_112px_88px] items-center gap-2 px-3 py-2 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                    >
                      <span className="text-xs text-slate-500">
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs font-semibold text-slate-800">
                          {element.code}
                        </p>

                        <input
                          value={element.name}
                          aria-label={`Nome do elemento ${index + 1}`}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) =>
                            event.stopPropagation()
                          }
                          onChange={(event) =>
                            updateElement(element.id, {
                              name: event.target.value,
                            })
                          }
                          className="mt-0.5 w-full rounded border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-700 outline-none focus:border-blue-500"
                        />
                      </div>

                      <span>
                        <input
                          type="number"
                          step="0.01"
                          value={element.baseValue}
                          aria-label={`Valor base do elemento ${index + 1}`}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) =>
                            event.stopPropagation()
                          }
                          onChange={(event) =>
                            handleInlineBaseValueChange(
                              element.id,
                              event.target.value
                            )
                          }
                          className="w-full rounded border border-slate-200 bg-white px-1.5 py-1 text-right text-xs tabular-nums text-slate-700 outline-none transition focus:border-blue-500"
                        />
                      </span>

                      <span className="text-right text-xs tabular-nums text-slate-700">
                        <select
                          value={element.goeGrade}
                          aria-label={`GOE do elemento ${index + 1}`}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) =>
                            event.stopPropagation()
                          }
                          onChange={(event) => {
                            const grade = Number(event.target.value);

                            handleInlineGoeChange(
                              element.id,
                              element.code,
                              grade
                            );
                          }}
                          className="w-full rounded-md border border-slate-200 bg-white px-1.5 py-1 text-right text-xs tabular-nums text-slate-700 outline-none transition focus:border-blue-500"
                        >
                          {goeGradeOptions.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade > 0 ? `+${grade}` : grade}
                            </option>
                          ))}
                        </select>
                      </span>

                      <span className="text-right text-xs font-semibold tabular-nums text-blue-600">
                        {elementTotal.toFixed(2)}
                      </span>

                      <span>
                        <input
                          value={element.notes ?? ""}
                          aria-label={`Notas do elemento ${index + 1}`}
                          placeholder="Notas..."
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) =>
                            event.stopPropagation()
                          }
                          onChange={(event) =>
                            updateElement(element.id, {
                              notes: event.target.value,
                            })
                          }
                          className="w-full rounded border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-700 outline-none transition focus:border-blue-500"
                        />
                      </span>

                      <span className="flex justify-center gap-1">
                        <button
                          type="button"
                          aria-label={`Mover elemento ${index + 1} para cima`}
                          disabled={index === 0}
                          onClick={(event) => {
                            event.stopPropagation();
                            moveElementUp(element.id);
                          }}
                          onKeyDown={(event) =>
                            event.stopPropagation()
                          }
                          className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Up
                        </button>

                        <button
                          type="button"
                          aria-label={`Mover elemento ${index + 1} para baixo`}
                          disabled={index === elements.length - 1}
                          onClick={(event) => {
                            event.stopPropagation();
                            moveElementDown(element.id);
                          }}
                          onKeyDown={(event) =>
                            event.stopPropagation()
                          }
                          className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Dn
                        </button>

                        <button
                          type="button"
                          aria-label={`Apagar elemento ${index + 1}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeElement(element.id);
                          }}
                          onKeyDown={(event) =>
                            event.stopPropagation()
                          }
                          className="rounded border border-red-200 px-1.5 py-0.5 text-[10px] text-red-600 transition hover:bg-red-50"
                        >
                          Del
                        </button>

                        <button
                          type="button"
                          aria-label={`Duplicar elemento ${index + 1}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            duplicateElement(element.id);
                          }}
                          onKeyDown={(event) =>
                            event.stopPropagation()
                          }
                          className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 transition hover:bg-slate-100"
                        >
                          Dup
                        </button>
                      </span>

                      <span className="flex justify-center">
                        <select
                          value={element.status}
                          aria-label={`Estado do elemento ${index + 1}`}
                          onClick={(event) => event.stopPropagation()}
                          onKeyDown={(event) =>
                            event.stopPropagation()
                          }
                          onChange={(event) =>
                            updateElement(element.id, {
                              status: event.target
                                .value as
                                | "valid"
                                | "warning"
                                | "invalid",
                            })
                          }
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium outline-none transition focus:ring-1 focus:ring-blue-500 ${getStatusClasses(
                            element.status
                          )}`}
                        >
                          {statusOptions.map((statusOption) => (
                            <option
                              key={statusOption.value}
                              value={statusOption.value}
                            >
                              {statusOption.label}
                            </option>
                          ))}
                        </select>
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-2">
                        <TechnicalElementCard
                          element={element}
                          index={index}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-[repeat(5,minmax(0,1fr))] gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                  Elements
                </p>
                <p className="font-semibold tabular-nums text-slate-800">
                  {technical.elementsCount}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                  Base Value
                </p>
                <p className="font-semibold tabular-nums text-slate-800">
                    {formatNumber(score.baseValue)}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                  GOE
                </p>
                <p className="font-semibold tabular-nums text-slate-800">
                    {score.goe > 0 ? "+" : ""}
                    {formatNumber(score.goe)}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                  Deductions
                </p>
                <p className="font-semibold tabular-nums text-slate-800">
                    {formatNumber(score.deductions)}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                  Total
                </p>
                <p className="font-semibold tabular-nums text-blue-600">
                    {formatNumber(score.finalScore)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}