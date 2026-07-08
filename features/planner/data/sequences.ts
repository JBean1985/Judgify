export interface Sequence {
  id: string;
  code: string;
  name: string;
  baseValue: number;
}

export const sequences: Sequence[] = [
  {
    id: "StSq",
    code: "StSq",
    name: "Step Sequence",
    baseValue: 3.30,
  },
];