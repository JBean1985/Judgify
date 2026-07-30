import type { ProgramElement } from "../../../types/element";

export interface TesScoreResult {
  baseValue: number;
  goe: number;
  tes: number;
}

export class ScoringEngine {
  static calculateBaseValue(elements: ProgramElement[]): number {
    return elements.reduce((total, element) => {
      const baseValue = Number(element.baseValue);
      return total + (Number.isFinite(baseValue) ? baseValue : 0);
    }, 0);
  }

  static calculateGOETotal(elements: ProgramElement[]): number {
    return elements.reduce((total, element) => {
      const goeValue = Number(element.goeValue ?? 0);
      return total + (Number.isFinite(goeValue) ? goeValue : 0);
    }, 0);
  }

  static calculateTES(elements: ProgramElement[]): TesScoreResult {
    const baseValue = ScoringEngine.calculateBaseValue(elements);
    const goe = ScoringEngine.calculateGOETotal(elements);

    return {
      baseValue,
      goe,
      tes: baseValue + goe,
    };
  }
}
