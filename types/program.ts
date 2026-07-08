import { ProgramElement } from "./element";

export type ProgramType = "short" | "free";

export type Category =
  | "benjamim"
  | "iniciado"
  | "cadete"
  | "juvenil"
  | "junior"
  | "senior";

export interface Athlete {
  id: string;
  name: string;
}

export interface Program {
  id: string;

  name: string;

  athlete?: Athlete;

  category: Category;

  type: ProgramType;

  season: string;

  elements: ProgramElement[];
}