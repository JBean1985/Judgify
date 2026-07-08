
import type { ProgramElement } from "../../../types/element";
import { ProgramRules } from "../rules/ProgramRules";

export interface ValidationMessage {
  type: "warning" | "error";
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  messages: ValidationMessage[];
}

export class ValidationEngine {
  static validate(
    elements: ProgramElement[],
    categoryName = "Juvenis"
  ): ValidationResult {
    const messages: ValidationMessage[] = [];

    const rules = ProgramRules.getRules({
      categoryName,
      discipline: "free",
      programType: "long",
    });

    messages.push(...this.validateRepeatedElements(elements));
    messages.push(...this.validateMaximumElements(elements, rules?.category.maxElements ?? 10));
    messages.push(...this.validateMaximumJumps(elements, rules?.category.maxJumps ?? 7));
    messages.push(...this.validateMaximumSpins(elements, rules?.category.maxSpins ?? 3));
    messages.push(...this.validateMaximumSequences(elements, rules?.category.maxSequences ?? 1));

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