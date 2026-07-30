import { CategoryRules } from "./categories";
import { DisciplineId } from "./disciplines";
import {
  ProgramTypeId,
  ProgramTypeValidationOverrides,
} from "./programTypes";
import { resolveRulePack, RuleProfile } from "./packs";

export interface ResolvedValidationLimits {
  maxElements: number;
  maxJumps: number;
  maxSpins: number;
  maxSequences: number;
  allowRepeatedJump: boolean;
}

export interface ProgramRuleSet {
  category: CategoryRules;
  discipline: DisciplineId;
  programType: ProgramTypeId;
  programTypeOverrides: ProgramTypeValidationOverrides | null;
}

export class ProgramRules {
  static findCategory(
    categoryName: string,
    ruleProfile?: RuleProfile
  ): CategoryRules | undefined {
    const selectedPack = resolveRulePack(ruleProfile);

    return selectedPack.categories.find(
      (category) =>
        category.name.toLowerCase() === categoryName.toLowerCase()
    );
  }

  static getRules(params: {
    categoryName: string;
    discipline: DisciplineId;
    programType: ProgramTypeId;
    ruleProfile?: RuleProfile;
  }): ProgramRuleSet | null {
    const selectedPack = resolveRulePack(params.ruleProfile);

    const category = selectedPack.categories.find(
      (item) =>
        item.name.toLowerCase() ===
        params.categoryName.toLowerCase()
    );

    if (!category) {
      return null;
    }

    return {
      category,
      discipline: params.discipline,
      programType: params.programType,
      programTypeOverrides:
        selectedPack.getProgramTypeValidationOverrides(
          params.programType
        ),
    };
  }

  static resolveValidationLimits(
    rules: ProgramRuleSet
  ): ResolvedValidationLimits {
    const overrides = rules.programTypeOverrides;

    // TODO: Once official FPP / World Skate values are confirmed,
    // populate programType overrides and this resolver will apply them.
    return {
      maxElements:
        overrides?.maxElements ?? rules.category.maxElements,
      maxJumps: overrides?.maxJumps ?? rules.category.maxJumps,
      maxSpins: overrides?.maxSpins ?? rules.category.maxSpins,
      maxSequences:
        overrides?.maxSequences ?? rules.category.maxSequences,
      allowRepeatedJump:
        overrides?.allowRepeatedJump ??
        rules.category.allowRepeatedJump,
    };
  }
}