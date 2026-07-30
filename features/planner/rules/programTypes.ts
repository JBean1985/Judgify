export const programTypes = [
  {
    id: "short",
    name: "Programa Curto",
  },
  {
    id: "long",
    name: "Programa Longo",
  },
] as const;

export type ProgramType = (typeof programTypes)[number];
export type ProgramTypeId = ProgramType["id"];

export function findProgramTypeByName(
  name: string
): ProgramType | undefined {
  const normalizedName = name.trim().toLowerCase();

  return programTypes.find(
    (programType) =>
      programType.id === normalizedName ||
      programType.name.toLowerCase() === normalizedName
  );
}
