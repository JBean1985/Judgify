import { jumps, JumpDefinition } from "./jumps";

export type ElementDefinition = JumpDefinition;

export function getElement(
  code: string
): ElementDefinition | undefined {
  return jumps.find(
    (element) => element.code === code
  );
}

export function getAllElements() {
  return [
    ...jumps,
  ];
}