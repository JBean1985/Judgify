/**
 * Base de dados de saltos
 * (Primeira versão)
 */

export interface JumpDefinition {
  code: string;

  name: string;

  rotations: number;

  baseValue: number;
}

export const jumps: JumpDefinition[] = [
  {
    code: "1T",
    name: "Toe Loop Simples",
    rotations: 1,
    baseValue: 0.4,
  },

  {
    code: "1S",
    name: "Salchow Simples",
    rotations: 1,
    baseValue: 0.4,
  },

  {
    code: "1Lo",
    name: "Loop Simples",
    rotations: 1,
    baseValue: 0.5,
  },

  {
    code: "1F",
    name: "Flip Simples",
    rotations: 1,
    baseValue: 0.5,
  },

  {
    code: "1Lz",
    name: "Lutz Simples",
    rotations: 1,
    baseValue: 0.6,
  },

  {
    code: "1A",
    name: "Axel Simples",
    rotations: 1,
    baseValue: 1.1,
  },
];