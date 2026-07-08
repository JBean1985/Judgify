import { getElement } from "../data/elementRepository";

export function calculateBaseValue(
  code: string
): number {

  const element = getElement(code);

  if (!element) {
    return 0;
  }

  return element.baseValue;
}