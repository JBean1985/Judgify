/**
 * Judgify
 * Modelo de Pontuação
 */

export interface Score {
  /** Technical Element Score */
  tes: number;

  /** Program Component Score */
  pcs: number;

  /** Deduções */
  deductions: number;

  /** GOE total aplicado aos elementos */
  goe: number;

  /** Valor Base Total */
  baseValue: number;

  /** Pontuação Final */
  total: number;
}

export interface ScoreBreakdown {
  technical: ScoreSection;
  artistic: ScoreSection;
  deductions: Deduction[];
}

export interface ScoreSection {
  title: string;
  value: number;
}

export interface Deduction {
  id: string;
  description: string;
  value: number;
}