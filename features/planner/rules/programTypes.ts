export type ProgramTypeId =
  | "short"
  | "long";

export interface ProgramTypeValidationOverrides {
  maxElements?: number;
  maxJumps?: number;
  maxSpins?: number;
  maxSequences?: number;
  allowRepeatedJump?: boolean;
}

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

// TODO: Fill this map with official FPP / World Skate values once validated.
// Keep empty to preserve current behavior until formal limits are approved.
const programTypeValidationOverrides: Partial<
  Record<ProgramTypeId, ProgramTypeValidationOverrides>
> = {};

export function getProgramTypeValidationOverrides(
  programTypeId: ProgramTypeId
): ProgramTypeValidationOverrides | null {
  return programTypeValidationOverrides[programTypeId] ?? null;
}