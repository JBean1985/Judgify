export interface CategoryRules {
  id: string;

  name: string;

  maxElements: number;

  maxJumps: number;

  maxSpins: number;

  maxSequences: number;

  allowRepeatedJump: boolean;

  programDuration: number;
}

export const categories: CategoryRules[] = [
  {
    id: "benjamins",
    name: "Benjamins",
    maxElements: 10,
    maxJumps: 5,
    maxSpins: 2,
    maxSequences: 1,
    allowRepeatedJump: false,
    programDuration: 120,
  },

  {
    id: "iniciados",
    name: "Iniciados",
    maxElements: 10,
    maxJumps: 6,
    maxSpins: 2,
    maxSequences: 1,
    allowRepeatedJump: false,
    programDuration: 150,
  },

  {
    id: "cadetes",
    name: "Cadetes",
    maxElements: 11,
    maxJumps: 6,
    maxSpins: 3,
    maxSequences: 1,
    allowRepeatedJump: false,
    programDuration: 180,
  },

  {
    id: "juvenis",
    name: "Juvenis",
    maxElements: 12,
    maxJumps: 7,
    maxSpins: 3,
    maxSequences: 1,
    allowRepeatedJump: false,
    programDuration: 210,
  },

  {
    id: "juniores",
    name: "Juniores",
    maxElements: 12,
    maxJumps: 7,
    maxSpins: 3,
    maxSequences: 1,
    allowRepeatedJump: true,
    programDuration: 240,
  },

  {
    id: "seniores",
    name: "Seniores",
    maxElements: 13,
    maxJumps: 8,
    maxSpins: 3,
    maxSequences: 1,
    allowRepeatedJump: true,
    programDuration: 270,
  },
];