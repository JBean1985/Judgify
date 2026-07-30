export interface DeductionItem {
  id: string;
  label: string;
  value: number;
}

export interface DeductionResult {
  total: number;
  items: DeductionItem[];
}

export class DeductionEngine {
  static calculateDeductions(
    deductions: DeductionItem[]
  ): DeductionResult {
    const items = deductions.filter((item) => {
      const label = String(item?.label ?? "").trim();
      const value = Number(item?.value);

      return (
        typeof item?.id === "string" &&
        item.id.length > 0 &&
        label.length > 0 &&
        Number.isFinite(value) &&
        value > 0
      );
    });

    const total = items.reduce((sum, item) => {
      const value = Number(item.value);
      return sum + (Number.isFinite(value) && value > 0 ? value : 0);
    }, 0);

    return {
      total,
      items,
    };
  }
}
