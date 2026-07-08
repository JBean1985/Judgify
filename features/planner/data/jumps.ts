export interface Jump {
  id: string;

  code: string;

  family: string;

  category: "jump";

  name: string;

  rotations: number;

  baseValue: number;

  maxGoe: 3;

  active: boolean;
}

export const jumps: Jump[] = [
  {
    id: "1A",
    code: "1A",
    family: "Axel",
    category: "jump",
    name: "Axel",
    rotations: 1,
    baseValue: 1.10,
    maxGoe: 3,
    active: true,
  },

  {
    id: "2A",
    code: "2A",
    family: "Axel",
    category: "jump",
    name: "Double Axel",
    rotations: 2,
    baseValue: 3.30,
    maxGoe: 3,
    active: true,
  },

  {
    id: "3A",
    code: "3A",
    family: "Axel",
    category: "jump",
    name: "Triple Axel",
    rotations: 3,
    baseValue: 8.00,
    maxGoe: 3,
    active: true,
  },

  {
    id: "1Lz",
    code: "1Lz",
    family: "Lutz",
    category: "jump",
    name: "Lutz",
    rotations: 1,
    baseValue: 0.60,
    maxGoe: 3,
    active: true,
  },

  {
    id: "2Lz",
    code: "2Lz",
    family: "Lutz",
    category: "jump",
    name: "Double Lutz",
    rotations: 2,
    baseValue: 2.10,
    maxGoe: 3,
    active: true,
  },

  {
    id: "3Lz",
    code: "3Lz",
    family: "Lutz",
    category: "jump",
    name: "Triple Lutz",
    rotations: 3,
    baseValue: 5.90,
    maxGoe: 3,
    active: true,
  },
];