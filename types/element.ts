export type ElementType =
  | "jump"
  | "spin"
  | "sequence"
  | "step"
  | "choreo";

export type ElementStatus = "valid" | "warning" | "invalid";

export interface ProgramElement {
  id: string;
  elementId?: string;
  code: string;
  name: string;
  type: ElementType;
  category: ElementType;
  family?: string;
  rotations?: number;
  baseValue: number;
  maxGoe?: number;
  active?: boolean;
  order?: number;
  notes?: string;
  status?: ElementStatus;
  goe?: number;
  goeGrade?: number;
  goeValue?: number;
}