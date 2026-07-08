export type ProgramTypeId =
  | "short"
  | "long";

export interface ProgramType {
  id: ProgramTypeId;
  name: string;
}

export const programTypes: ProgramType[] = [
  {
    id: "short",
    name: "Programa Curto",
  },
  {
    id: "long",
    name: "Programa Longo",
  },
];

export function findProgramTypeByName(
  name: string
): ProgramType | undefined {
  return programTypes.find(
    (programType) =>
      programType.name.toLowerCase() ===
      name.toLowerCase()
  );
}