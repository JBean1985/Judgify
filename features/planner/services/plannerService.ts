import { Program } from "../types/program";

export function createProgram(
  data: Partial<Program>
): Program {
  return {
    id: crypto.randomUUID(),

    name: data.name ?? "Novo Programa",

    athleteId: data.athleteId,

    category: data.category!,

    type: data.type!,

    season:
      data.season ??
      new Date().getFullYear().toString(),

    elements: [],
  };
}

export function addElement(
  program: Program,
  element: Program["elements"][number]
): Program {

  return {
    ...program,

    elements: [
      ...program.elements,
      element,
    ],
  };
}