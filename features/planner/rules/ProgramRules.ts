import { CategoryId, CategoryRules, findCategory } from "./categories";
import type { DisciplineId } from "./disciplines";
import type { ProgramTypeId } from "./programTypes";

export interface ProgramRuleSet {
  category: CategoryRules;
  discipline: DisciplineId;
  programType: ProgramTypeId;
}

export class ProgramRules {
  static findCategory(categoryName: string): CategoryRules | undefined {
    return findCategory(categoryName);
  }

  static getRules(params: {
    category: CategoryId;
    discipline: DisciplineId;
    programType: ProgramTypeId;
  }): ProgramRuleSet | null {
    const category = this.findCategory(params.category);

    if (!category) {
      return null;
    }

    return {
      category,
      discipline: params.discipline,
      programType: params.programType,
    };
  }
}
