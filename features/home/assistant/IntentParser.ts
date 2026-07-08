export interface ParsedIntent {
  athlete?: string;
  category?: string;
  competition?: string;
  discipline?: string;
}

const categories = [
  "Benjamins",
  "Infantis",
  "Iniciados",
  "Cadetes",
  "Juvenis",
  "Juniores",
  "Seniores",
];

const disciplines = [
  "Livre",
  "Solo Dance",
  "Pares",
  "Precisão",
];

export class IntentParser {
  static parse(text: string): ParsedIntent {
    const result: ParsedIntent = {};

    for (const category of categories) {
      if (text.toLowerCase().includes(category.toLowerCase())) {
        result.category = category;
      }
    }

    for (const discipline of disciplines) {
      if (text.toLowerCase().includes(discipline.toLowerCase())) {
        result.discipline = discipline;
      }
    }

    return result;
  }
}