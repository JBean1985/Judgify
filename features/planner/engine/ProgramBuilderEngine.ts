import type { ProgramElement } from "../../../types/element";

import { jumps, sequences, spins } from "../data";
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

export type BuilderObjective =
  | "seguro"
  | "competitivo"
  | "elite";

export interface ProgramBuilderInput {
  category?: string;
  discipline?: string;
  programType?: string;
  ruleProfile?: RuleProfile;
  objective: BuilderObjective;
  existingElements?: ProgramElement[];
}

export interface SuggestedProgramElement {
  code: string;
  name: string;
  type: "jump" | "spin" | "sequence";
  category: "jump" | "spin" | "sequence";
  family: string;
  rotations?: number;
  baseValue: number;
}

export interface ProgramBuilderResult {
  elements: SuggestedProgramElement[];
  maxElements: number;
  remainingSlots: number;
  requestedCount: number;
  addedCount: number;
  stopReason:
    | "none"
    | "category-limits-reached"
    | "no-legal-elements-left";
  remainingByType: {
    elements: number;
    jumps: number;
    spins: number;
    sequences: number;
  };
}

export class ProgramBuilderEngine {
  private static readonly DEFAULT_MAX_ELEMENTS = 10;

  // Training helper only. This generator does NOT claim FPP/World Skate compliance.
  static buildSuggestion(
    input: ProgramBuilderInput
  ): ProgramBuilderResult {
    const existingElements = input.existingElements ?? [];

    const disciplineId = this.resolveDisciplineId(input.discipline);
    const programTypeId = this.resolveProgramTypeId(input.programType);

    const rules = ProgramRules.getRules({
      categoryName: input.category ?? "Juvenis",
      discipline: disciplineId,
      programType: programTypeId,
      ruleProfile: input.ruleProfile,
    });

    const resolvedLimits = rules
      ? ProgramRules.resolveValidationLimits(rules)
      : {
          maxElements: this.DEFAULT_MAX_ELEMENTS,
          maxJumps: 7,
          maxSpins: 3,
          maxSequences: 1,
          allowRepeatedJump: false,
        };

    const existingJumpCount = existingElements.filter(
      (element) => element.category === "jump"
    ).length;

    const existingSpinCount = existingElements.filter(
      (element) => element.category === "spin"
    ).length;

    const existingSequenceCount = existingElements.filter(
      (element) => element.category === "sequence"
    ).length;

    let remainingJumps = Math.max(
      0,
      resolvedLimits.maxJumps - existingJumpCount
    );

    let remainingSpins = Math.max(
      0,
      resolvedLimits.maxSpins - existingSpinCount
    );

    let remainingSequences = Math.max(
      0,
      resolvedLimits.maxSequences - existingSequenceCount
    );

    const maxElements = resolvedLimits.maxElements;

    const remainingSlots = Math.max(
      0,
      maxElements - existingElements.length
    );

    if (remainingSlots === 0) {
      return {
        elements: [],
        maxElements,
        remainingSlots,
        requestedCount: 0,
        addedCount: 0,
        stopReason: "category-limits-reached",
        remainingByType: {
          elements: remainingSlots,
          jumps: remainingJumps,
          spins: remainingSpins,
          sequences: remainingSequences,
        },
      };
    }

    const targetCount = Math.min(
      remainingSlots,
      this.getTargetCount(input.objective, maxElements)
    );

    const selected: SuggestedProgramElement[] = [];

    const usedJumpCodes = new Set(
      existingElements
        .filter((element) => element.category === "jump")
        .map((element) => element.code)
    );

    const jumpUsageCount = new Map<string, number>();
    const spinUsageCount = new Map<string, number>();
    const sequenceUsageCount = new Map<string, number>();

    existingElements
      .filter((element) => element.category === "jump")
      .forEach((element) => {
        jumpUsageCount.set(
          element.code,
          (jumpUsageCount.get(element.code) ?? 0) + 1
        );
      });

    existingElements
      .filter((element) => element.category === "spin")
      .forEach((element) => {
        spinUsageCount.set(
          element.code,
          (spinUsageCount.get(element.code) ?? 0) + 1
        );
      });

    existingElements
      .filter((element) => element.category === "sequence")
      .forEach((element) => {
        sequenceUsageCount.set(
          element.code,
          (sequenceUsageCount.get(element.code) ?? 0) + 1
        );
      });

    const orderedJumps = this.orderJumpsByObjective(input.objective);
    const orderedSpins = this.orderSimpleByObjective(spins, input.objective);
    const orderedSequences = this.orderSimpleByObjective(
      sequences,
      input.objective
    );

    if (
      targetCount > 0 &&
      orderedSpins.length > 0 &&
      remainingSpins > 0
    ) {
      const spin = this.pickLeastUsedSimpleElement(
        orderedSpins,
        spinUsageCount
      );

      if (spin) {
        this.addSimpleElementToSelection(
          selected,
          {
            code: spin.code,
            name: spin.name,
            type: "spin",
            category: "spin",
            family: spin.name,
            baseValue: spin.baseValue,
          },
          spinUsageCount
        );

        remainingSpins -= 1;
      }
    }

    if (
      selected.length < targetCount &&
      orderedSequences.length > 0 &&
      remainingSequences > 0
    ) {
      const sequence = this.pickLeastUsedSimpleElement(
        orderedSequences,
        sequenceUsageCount
      );

      if (sequence) {
        this.addSimpleElementToSelection(
          selected,
          {
            code: sequence.code,
            name: sequence.name,
            type: "sequence",
            category: "sequence",
            family: sequence.name,
            baseValue: sequence.baseValue,
          },
          sequenceUsageCount
        );

        remainingSequences -= 1;
      }
    }

    while (selected.length < targetCount) {
      let added = false;

      if (remainingJumps > 0) {
        const jump =
          this.pickUnusedJump(orderedJumps, usedJumpCodes) ??
          this.pickLeastUsedJump(orderedJumps, jumpUsageCount);

        if (jump) {
          this.addJumpToSelection(
            selected,
            jump,
            usedJumpCodes,
            jumpUsageCount
          );

          remainingJumps -= 1;
          added = true;
        }
      }

      if (!added && remainingSpins > 0) {
        const spin = this.pickLeastUsedSimpleElement(
          orderedSpins,
          spinUsageCount
        );

        if (spin) {
          this.addSimpleElementToSelection(
            selected,
            {
              code: spin.code,
              name: spin.name,
              type: "spin",
              category: "spin",
              family: spin.name,
              baseValue: spin.baseValue,
            },
            spinUsageCount
          );

          remainingSpins -= 1;
          added = true;
        }
      }

      if (!added && remainingSequences > 0) {
        const sequence = this.pickLeastUsedSimpleElement(
          orderedSequences,
          sequenceUsageCount
        );

        if (sequence) {
          this.addSimpleElementToSelection(
            selected,
            {
              code: sequence.code,
              name: sequence.name,
              type: "sequence",
              category: "sequence",
              family: sequence.name,
              baseValue: sequence.baseValue,
            },
            sequenceUsageCount
          );

          remainingSequences -= 1;
          added = true;
        }
      }

      if (!added) {
        break;
      }
    }

    const addedCount = selected.length;
    const remainingElementSlots = Math.max(
      0,
      remainingSlots - addedCount
    );

    const hasTypeCapacityRemaining =
      remainingJumps > 0 ||
      remainingSpins > 0 ||
      remainingSequences > 0;

    const stopReason: ProgramBuilderResult["stopReason"] =
      addedCount >= targetCount
        ? "none"
        : hasTypeCapacityRemaining
          ? "no-legal-elements-left"
          : "category-limits-reached";

    return {
      elements: selected,
      maxElements,
      remainingSlots,
      requestedCount: targetCount,
      addedCount,
      stopReason,
      remainingByType: {
        elements: remainingElementSlots,
        jumps: remainingJumps,
        spins: remainingSpins,
        sequences: remainingSequences,
      },
    };
  }

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

  private static getTargetCount(
    objective: BuilderObjective,
    maxElements: number
  ): number {
    if (objective === "seguro") {
      return Math.max(3, Math.round(maxElements * 0.5));
    }

    if (objective === "competitivo") {
      return Math.max(4, Math.round(maxElements * 0.7));
    }

    return Math.max(5, Math.round(maxElements * 0.85));
  }

  private static orderJumpsByObjective(objective: BuilderObjective) {
    const activeJumps = jumps.filter((jump) => jump.active);

    if (objective === "seguro") {
      return [...activeJumps].sort((a, b) => {
        if (a.baseValue !== b.baseValue) {
          return a.baseValue - b.baseValue;
        }

        return a.rotations - b.rotations;
      });
    }

    if (objective === "elite") {
      return [...activeJumps].sort((a, b) => {
        if (a.baseValue !== b.baseValue) {
          return b.baseValue - a.baseValue;
        }

        return b.rotations - a.rotations;
      });
    }

    const ascending = [...activeJumps].sort(
      (a, b) => a.baseValue - b.baseValue
    );

    const balanced = [] as typeof ascending;
    let low = 0;
    let high = ascending.length - 1;

    while (low <= high) {
      if (low === high) {
        balanced.push(ascending[low]);
        break;
      }

      balanced.push(ascending[low]);
      balanced.push(ascending[high]);
      low += 1;
      high -= 1;
    }

    return balanced;
  }

  private static orderSimpleByObjective<T extends { baseValue: number }>(
    items: T[],
    objective: BuilderObjective
  ): T[] {
    if (objective === "seguro") {
      return [...items].sort(
        (a, b) => a.baseValue - b.baseValue
      );
    }

    if (objective === "elite") {
      return [...items].sort(
        (a, b) => b.baseValue - a.baseValue
      );
    }

    return [...items].sort(
      (a, b) => a.baseValue - b.baseValue
    );
  }

  private static pickUnusedJump(
    orderedJumps: typeof jumps,
    usedJumpCodes: Set<string>
  ) {
    return (
      orderedJumps.find(
        (jump) => !usedJumpCodes.has(jump.code)
      ) ?? null
    );
  }

  private static pickLeastUsedJump(
    orderedJumps: typeof jumps,
    jumpUsageCount: Map<string, number>
  ) {
    if (orderedJumps.length === 0) {
      return null;
    }

    return [...orderedJumps].sort((a, b) => {
      const countA = jumpUsageCount.get(a.code) ?? 0;
      const countB = jumpUsageCount.get(b.code) ?? 0;

      if (countA !== countB) {
        return countA - countB;
      }

      return 0;
    })[0];
  }

  private static pickLeastUsedSimpleElement<
    T extends { code: string }
  >(orderedElements: T[], usageCount: Map<string, number>) {
    if (orderedElements.length === 0) {
      return null;
    }

    return [...orderedElements].sort((a, b) => {
      const countA = usageCount.get(a.code) ?? 0;
      const countB = usageCount.get(b.code) ?? 0;

      if (countA !== countB) {
        return countA - countB;
      }

      return 0;
    })[0];
  }

  private static addJumpToSelection(
    selected: SuggestedProgramElement[],
    jump: (typeof jumps)[number],
    usedJumpCodes: Set<string>,
    jumpUsageCount: Map<string, number>
  ) {
    selected.push({
      code: jump.code,
      name: jump.name,
      type: "jump",
      category: "jump",
      family: jump.family,
      rotations: jump.rotations,
      baseValue: jump.baseValue,
    });

    usedJumpCodes.add(jump.code);

    jumpUsageCount.set(
      jump.code,
      (jumpUsageCount.get(jump.code) ?? 0) + 1
    );
  }

  private static addSimpleElementToSelection(
    selected: SuggestedProgramElement[],
    element: SuggestedProgramElement,
    usageCount: Map<string, number>
  ) {
    selected.push(element);

    usageCount.set(
      element.code,
      (usageCount.get(element.code) ?? 0) + 1
    );
  }
}
