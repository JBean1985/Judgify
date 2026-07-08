import { ProgramElement } from "../context";

export interface CoachSuggestion {
  type: "info" | "warning" | "tip";
  message: string;
}

export class CoachEngine {
  static analyse(elements: ProgramElement[]): CoachSuggestion[] {
    const suggestions: CoachSuggestion[] = [];

    if (elements.length === 0) {
      suggestions.push({
        type: "info",
        message: "Comece por adicionar elementos ao esquema.",
      });

      return suggestions;
    }

    const jumps = elements.filter(
      (element) => element.category === "jump"
    );

    const spins = elements.filter(
      (element) => element.category === "spin"
    );

    const sequences = elements.filter(
      (element) => element.category === "sequence"
    );

    if (jumps.length === 0) {
      suggestions.push({
        type: "warning",
        message: "O esquema não possui saltos.",
      });
    }

    if (spins.length === 0) {
      suggestions.push({
        type: "warning",
        message: "O esquema não possui piruetas.",
      });
    }

    if (sequences.length === 0) {
      suggestions.push({
        type: "warning",
        message: "O esquema não possui sequências.",
      });
    }

    const averageGoe =
      elements.reduce(
        (total, element) => total + element.goeGrade,
        0
      ) / elements.length;

    if (averageGoe < 0) {
      suggestions.push({
        type: "tip",
        message:
          "O GOE médio é negativo. Reveja os elementos com menor qualidade.",
      });
    }

    const averageBase =
      elements.reduce(
        (total, element) => total + element.baseValue,
        0
      ) / elements.length;

    if (averageBase < 2) {
      suggestions.push({
        type: "tip",
        message:
          "O Valor Base médio é baixo. Considere aumentar a dificuldade do programa.",
      });
    }

    return suggestions;
  }
}