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
        message:
          "Sugestao de treino: comece por adicionar elementos ao esquema para gerar orientacoes.",
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
        message:
          "Sugestao de treino: o esquema nao possui piões. Reveja o equilibrio tecnico.",
      });
    }

    if (sequences.length === 0) {
      suggestions.push({
        type: "warning",
        message:
          "Sugestao de treino: o esquema nao possui sequencias. Reveja a composicao.",
      });
    }

    const negativeGoeElements = elements.filter(
      (element) =>
        (element.goeGrade ?? 0) < 0 ||
        (element.goeValue ?? 0) < 0
    );

    if (negativeGoeElements.length > 0) {
      const codes = negativeGoeElements
        .slice(0, 4)
        .map((element) => element.code)
        .join(", ");

      suggestions.push({
        type: "tip",
        message:
          `Sugestao de treino: ha elementos com GOE negativo (${codes}). Priorize qualidade de execucao nestes elementos.`,
      });
    }

    const flaggedStatusElements = elements.filter(
      (element) =>
        element.status === "warning" ||
        element.status === "invalid"
    );

    if (flaggedStatusElements.length > 0) {
      const statusCodes = flaggedStatusElements
        .slice(0, 4)
        .map((element) => element.code)
        .join(", ");

      suggestions.push({
        type: "warning",
        message:
          `Sugestao de treino: existem elementos marcados como atencao/invalido (${statusCodes}). Revise entradas e qualidade tecnica.`,
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
          "Sugestao de treino: o GOE medio esta negativo. Foque consistencia e execucao limpa.",
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
          "Sugestao de treino: o Valor Base medio esta baixo. Considere elevar dificuldade gradualmente.",
      });
    }

    const totalBase = elements.reduce(
      (total, element) => total + element.baseValue,
      0
    );

    const highestBase = elements.reduce(
      (max, element) =>
        Math.max(max, element.baseValue),
      0
    );

    const highestShare =
      totalBase > 0 ? highestBase / totalBase : 0;

    if (elements.length > 1 && highestShare >= 0.35) {
      suggestions.push({
        type: "tip",
        message:
          "Sugestao de treino: o Valor Base esta muito concentrado num unico elemento. Procure distribuir melhor a dificuldade.",
      });
    }

    return suggestions;
  }
}