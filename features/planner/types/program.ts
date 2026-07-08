export interface ProgramElement {
  id: string;

  code: string;

  name: string;

  baseValue: number;
}

export interface Program {
  id: string;

  name: string;

  athleteId?: string;

  category: string;

  type: string;

  season: string;

  elements: ProgramElement[];
}