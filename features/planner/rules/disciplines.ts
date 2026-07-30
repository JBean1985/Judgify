export const disciplines = [
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
] as const;

export type Discipline = (typeof disciplines)[number];
export type DisciplineId = Discipline["id"];

export function findDisciplineByName(
  name: string
): Discipline | undefined {
  const normalizedName = name.trim().toLowerCase();

  return disciplines.find(
    (discipline) =>
      discipline.id === normalizedName ||
      discipline.name.toLowerCase() === normalizedName
  );
}
