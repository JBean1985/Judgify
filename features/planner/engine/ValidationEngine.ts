
import type { ProgramElement } from "../../../types/element";
import { ProgramRules } from "../rules/ProgramRules";
import type { RuleProfile } from "../rules/packs";
import {
  type DisciplineId,
  findDisciplineByName,
} from "../rules/disciplines";
import {
  type ProgramTypeId,
  findProgramTypeByName,
} from "../rules/programTypes";

export interface ValidationMessage {
  type: "warning" | "error";
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  messages: ValidationMessage[];
}

export class ValidationEngine {
  private static resolveDisciplineId(
    discipline?: string
  ): DisciplineId {
    if (!discipline) {
      return "free";
    }

    const normalized = discipline.toLowerCase();

    if (
      normalized === "free" ||
      normalized === "solo-dance" ||
      normalized === "pairs" ||
      normalized === "precision"
    ) {
      return normalized;
    }

    return findDisciplineByName(discipline)?.id ?? "free";
  }

  private static resolveProgramTypeId(
    programType?: string
  ): ProgramTypeId {
    if (!programType) {
      return "long";
    }

    const normalized = programType.toLowerCase();

    if (normalized === "short" || normalized === "long") {
      return normalized;
    }

    return findProgramTypeByName(programType)?.id ?? "long";
  }

  static validate(
    elements: ProgramElement[],
    categoryName = "Juvenis",
    discipline?: string,
    programType?: string,
    ruleProfile?: RuleProfile
  ): ValidationResult {
    const messages: ValidationMessage[] = [];

    const disciplineId = this.resolveDisciplineId(discipline);
    const programTypeId = this.resolveProgramTypeId(programType);

    const rules = ProgramRules.getRules({
      categoryName,
      discipline: disciplineId,
      programType: programTypeId,
      ruleProfile,
    });

    const resolvedLimits = rules
      ? ProgramRules.resolveValidationLimits(rules)
      : {
          maxElements: 10,
          maxJumps: 7,
          maxSpins: 3,
          maxSequences: 1,
          allowRepeatedJump: false,
        };

    const allowRepeatedJump =
      resolvedLimits.allowRepeatedJump;

    messages.push(
      ...this.validateRepeatedElements(
        elements,
        allowRepeatedJump
      )
    );
    messages.push(
      ...this.validateMaximumElements(
        elements,
        resolvedLimits.maxElements
      )
    );
    messages.push(
      ...this.validateMaximumJumps(elements, resolvedLimits.maxJumps)
    );
    messages.push(
      ...this.validateMaximumSpins(elements, resolvedLimits.maxSpins)
    );
    messages.push(
      ...this.validateMaximumSequences(
        elements,
        resolvedLimits.maxSequences
      )
    );

    return {
      valid: !messages.some((message) => message.type === "error"),
      messages,
    };
  }

  private static validateRepeatedElements(
    elements: ProgramElement[],
    allowRepeatedJump: boolean
  ): ValidationMessage[] {
    const nonJumpCounts = new Map<string, number>();
    const jumpCounts = new Map<string, number>();

    elements.forEach((element) => {
      if (element.category === "jump") {
        jumpCounts.set(
          element.code,
          (jumpCounts.get(element.code) ?? 0) + 1
        );

        return;
      }

      nonJumpCounts.set(
        element.code,
        (nonJumpCounts.get(element.code) ?? 0) + 1
      );
    });

    const repeatedNonJumpMessages = Array.from(
      nonJumpCounts.entries()
    )
      .filter(([, count]) => count > 1)
      .map(([code]) => ({
        type: "warning" as const,
        message: `O elemento ${code} foi repetido no esquema.`,
      }));

    if (allowRepeatedJump) {
      return repeatedNonJumpMessages;
    }

    const repeatedJumpMessages = Array.from(jumpCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([code]) => ({
        type: "error" as const,
        message: `O salto ${code} foi repetido e não é permitido para esta categoria.`,
      }));

    return [
      ...repeatedNonJumpMessages,
      ...repeatedJumpMessages,
    ];
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
        message: `O esquema excede o máximo de ${maxSpins} piões.`,
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