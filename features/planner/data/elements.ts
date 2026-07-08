export interface ElementDefinition {
  id: string;
  name: string;
  type: "jump" | "spin" | "sequence";
  baseValue: number;
}

export const elements: ElementDefinition[] = [
  {
    id: "1A",
    name: "Axel",
    type: "jump",
    baseValue: 1.10,
  },
  {
    id: "2A",
    name: "Double Axel",
    type: "jump",
    baseValue: 3.30,
  },
  {
    id: "1Lz",
    name: "Lutz",
    type: "jump",
    baseValue: 0.60,
  },
  {
    id: "2Lz",
    name: "Double Lutz",
    type: "jump",
    baseValue: 2.10,
  },
  {
    id: "CSSp",
    name: "Camel Spin",
    type: "spin",
    baseValue: 2.50,
  },
  {
    id: "StSq",
    name: "Step Sequence",
    type: "sequence",
    baseValue: 3.30,
  },
];