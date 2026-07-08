import type { ProgramElement } from "../../../types/element";

export interface DifficultyResult {
  totalBaseValue: number;
  averageBaseValue: number;
  averageGOE: number;
  jumps: number;
  spins: number;
  sequences: number;
  difficultyIndex: number;
  level: string;
}

export class DifficultyEngine {
  static analyse(
    elements: ProgramElement[]
  ): DifficultyResult {
    const jumps = elements.filter(
      (e) => e.category === "jump"
    );

    const spins = elements.filter(
      (e) => e.category === "spin"
    );

    const sequences = elements.filter(
      (e) => e.category === "sequence"
    );

    const totalBaseValue = elements.reduce(
      (total, element) => total + element.baseValue,
      0
    );

    const averageBaseValue =
      elements.length === 0
        ? 0
        : totalBaseValue / elements.length;

    const averageGOE =
      elements.length === 0
        ? 0
        : elements.reduce(
            (total, element) => total + (element.goeGrade ?? 0),
            0
          ) / elements.length;

    const difficultyIndex =
      totalBaseValue +
      averageGOE +
      jumps.length * 0.5 +
      spins.length * 0.25 +
      sequences.length * 0.25;

    let level = "Iniciante";

    if (difficultyIndex >= 10) {
      level = "Intermédio";
    }

    if (difficultyIndex >= 20) {
      level = "Avançado";
    }

    if (difficultyIndex >= 30) {
      level = "Elite";
    }

    return {
      totalBaseValue,
      averageBaseValue,
      averageGOE,
      jumps: jumps.length,
      spins: spins.length,
      sequences: sequences.length,
      difficultyIndex,
      level,
    };
  }
}