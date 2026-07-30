import type { ProgramElement } from "../../../types/element";
import { jumpGoeRules } from "../rules/goe/jumps";
import { ScoringEngine } from "./ScoringEngine";

export interface TechnicalResult {
  elementsCount: number;
  baseValue: number;
  goe: number;
  pcs: number;
  deductions: number;
  total: number;
}

export class TechnicalEngine {
  static getGoeValue(code: string, grade: number): number {
    const rule = jumpGoeRules.find((item) => item.code === code);

    if (!rule) {
      return grade;
    }

    const key = String(grade) as keyof typeof rule.values;

    return rule.values[key] ?? 0;
  }

  static calculate(elements: ProgramElement[]): TechnicalResult {
    const tes = ScoringEngine.calculateTES(elements);
    const baseValue = tes.baseValue;
    const goe = tes.goe;

    const pcs = 0;
    const deductions = 0;

    return {
      elementsCount: elements.length,
      baseValue,
      goe,
      pcs,
      deductions,
      total: baseValue + goe + pcs - deductions,
    };
  }
}