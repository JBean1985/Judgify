import { CategoryRules, categories } from "./categories";
import { DisciplineId } from "./disciplines";
import { ProgramTypeId } from "./programTypes";

export interface ProgramRuleSet {
  category: CategoryRules;
  discipline: DisciplineId;
  programType: ProgramTypeId;
}

export class ProgramRules {
  static findCategory(categoryName: string): CategoryRules | undefined {
    return categories.find(
      (category) =>
        category.name.toLowerCase() === categoryName.toLowerCase()
    );
  }

  static getRules(params: {
    categoryName: string;
    discipline: DisciplineId;
    programType: ProgramTypeId;
  }): ProgramRuleSet | null {
    const category = this.findCategory(params.categoryName);

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