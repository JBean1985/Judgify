export type DisciplineId =
  | "free"
  | "solo-dance"
  | "pairs"
  | "precision";

export interface Discipline {
  id: DisciplineId;
  name: string;
}

export const disciplines: Discipline[] = [
  {
    id: "free",
    name: "Livre",
  },
  {
    id: "solo-dance",
    name: "Solo Dance",
  },
  {
    id: "pairs",
    name: "Pares",
  },
  {
    id: "precision",
    name: "Precisão",
  },
];

export function findDisciplineByName(
  name: string
): Discipline | undefined {
  return disciplines.find(
    (discipline) =>
      discipline.name.toLowerCase() === name.toLowerCase()
  );
}