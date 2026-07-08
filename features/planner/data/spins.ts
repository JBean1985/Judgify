export interface Spin {
  id: string;
  code: string;
  name: string;
  baseValue: number;
}

export const spins: Spin[] = [
  {
    id: "CSSp",
    code: "CSSp",
    name: "Camel Spin",
    baseValue: 2.50,
  },
  {
    id: "SSp",
    code: "SSp",
    name: "Sit Spin",
    baseValue: 2.30,
  },
  {
    id: "LSp",
    code: "LSp",
    name: "Layback Spin",
    baseValue: 2.70,
  },
];