import type { ProgramElement } from "../../../types/element";
import { DeductionEngine, type DeductionItem } from "./DeductionEngine";
import { ScoringEngine } from "./ScoringEngine";

export interface ManualPCSInput {
  skatingSkills: number;
  transitions: number;
  performance: number;
  composition: number;
}

export interface ScoreResult {
  baseValue: number;
  goe: number;
  tes: number;
  pcsBreakdown: {
    skatingSkills: number;
    transitions: number;
    performance: number;
    composition: number;
  };
  pcs: number;
  deductions: number;
  deductionItems: DeductionItem[];
  finalScore: number;
}

export class ScoreEngine {
  static calculate(
    elements: ProgramElement[],
    deductions: DeductionItem[],
    pcs: ManualPCSInput
  ): ScoreResult {
    const tesResult = ScoringEngine.calculateTES(elements);
    const deductionResult = DeductionEngine.calculateDeductions(deductions);
    const pcsBreakdown = {
      skatingSkills: ScoreEngine.sanitizePCSValue(pcs.skatingSkills),
      transitions: ScoreEngine.sanitizePCSValue(pcs.transitions),
      performance: ScoreEngine.sanitizePCSValue(pcs.performance),
      composition: ScoreEngine.sanitizePCSValue(pcs.composition),
    };
    const safePcs =
      pcsBreakdown.skatingSkills +
      pcsBreakdown.transitions +
      pcsBreakdown.performance +
      pcsBreakdown.composition;
    const safeTes = Number.isFinite(tesResult.tes) ? tesResult.tes : 0;
    const safeDeductions = Number.isFinite(deductionResult.total)
      ? deductionResult.total
      : 0;

    return {
      baseValue: tesResult.baseValue,
      goe: tesResult.goe,
      tes: tesResult.tes,
      pcsBreakdown,
      pcs: safePcs,
      deductions: safeDeductions,
      deductionItems: deductionResult.items,
      finalScore: safeTes + safePcs - safeDeductions,
    };
  }

  private static sanitizePCSValue(value: number): number {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    return Math.min(10, Math.max(0, numericValue));
  }
}
