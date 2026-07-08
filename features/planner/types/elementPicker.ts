export type ElementFamily =
  | "jump"
  | "spin"
  | "step"
  | "choreo";

export interface PickerStep {
  family?: ElementFamily;

  name?: string;

  rotations?: number;
}