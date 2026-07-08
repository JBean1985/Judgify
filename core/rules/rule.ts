/**
 * Judgify
 * Modelo base de uma regra de validação.
 */

export interface RuleResult {
  valid: boolean;
  message?: string;
}

export interface RuleContext {
  category: string;

  programType: string;

  elementCount: number;

  repeatedElements: string[];

  elements: string[];
}

export interface Rule {
  id: string;

  name: string;

  description: string;

  validate(
    context: RuleContext
  ): RuleResult;
}