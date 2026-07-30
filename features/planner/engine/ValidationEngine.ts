
import type { ProgramElement } from "../../../types/element";
import { findCategory } from "../rules/categories";
import { findDisciplineByName } from "../rules/disciplines";
import { findProgramTypeByName } from "../rules/programTypes";
import { ProgramRules } from "../rules/ProgramRules";

export interface ValidationMessage {
  type: "warning" | "error";
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  messages: ValidationMessage[];
}

export interface ValidationContext {
  category?: string;
  discipline?: string;
  programType?: string;
}

export class ValidationEngine {
  static validate(
    elements: ProgramElement[],
    context: ValidationContext = {}
  ): ValidationResult {
    const messages: ValidationMessage[] = [];
    const category = context.category
      ? findCategory(context.category)
      : undefined;
    const discipline = context.discipline
      ? findDisciplineByName(context.discipline)
      : undefined;
    const programType = context.programType
      ? findProgramTypeByName(context.programType)
      : undefined;
    const rules = category && discipline && programType
      ? ProgramRules.getRules({
          category: category.id,
          discipline: discipline.id,
          programType: programType.id,
        })
      : null;
    const categoryRules = rules?.category ?? category;

    messages.push(...this.validateRepeatedElements(elements));

    if (categoryRules) {
      messages.push(...this.validateMaximumElements(elements, categoryRules.maxElements));
      messages.push(...this.validateMaximumJumps(elements, categoryRules.maxJumps));
      messages.push(...this.validateMaximumSpins(elements, categoryRules.maxSpins));
      messages.push(...this.validateMaximumSequences(elements, categoryRules.maxSequences));
    }

    return {
      valid: !messages.some((message) => message.type === "error"),
      messages,
    };
  }

  private static validateRepeatedElements(
    elements: ProgramElement[]
  ): ValidationMessage[] {
    const counts = new Map<string, number>();

    elements.forEach((element) => {
      counts.set(
        element.code,
        (counts.get(element.code) ?? 0) + 1
      );
    });

    return Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([code]) => ({
        type: "warning" as const,
        message: `O elemento ${code} foi repetido no esquema.`,
      }));
  }

  private static validateMaximumElements(
    elements: ProgramElement[],
    maxElements: number
  ): ValidationMessage[] {
    if (elements.length <= maxElements) {
      return [];
    }

    return [
      {
        type: "error",
        message: `O esquema excede o máximo de ${maxElements} elementos.`,
      },
    ];
  }

  private static validateMaximumJumps(
    elements: ProgramElement[],
    maxJumps: number
  ): ValidationMessage[] {
    const jumps = elements.filter(
      (element) => element.category === "jump"
    );

    if (jumps.length <= maxJumps) {
      return [];
    }

    return [
      {
        type: "error",
        message: `O esquema excede o máximo de ${maxJumps} saltos.`,
      },
    ];
  }

  private static validateMaximumSpins(
    elements: ProgramElement[],
    maxSpins: number
  ): ValidationMessage[] {
    const spins = elements.filter(
      (element) => element.category === "spin"
    );

    if (spins.length <= maxSpins) {
      return [];
    }

    return [
      {
        type: "error",
        message: `O esquema excede o máximo de ${maxSpins} piruetas.`,
      },
    ];
  }

  private static validateMaximumSequences(
    elements: ProgramElement[],
    maxSequences: number
  ): ValidationMessage[] {
    const sequences = elements.filter(
      (element) => element.category === "sequence"
    );

    if (sequences.length <= maxSequences) {
      return [];
    }

    return [
      {
        type: "error",
        message: `O esquema excede o máximo de ${maxSequences} sequências.`,
      },
    ];
  }
}
