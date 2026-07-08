import { GlobalContext } from "./types";

export class ContextEngine {
  private static context: GlobalContext = {};

  static get(): GlobalContext {
    return this.context;
  }

  static set(data: Partial<GlobalContext>): void {
    this.context = {
      ...this.context,
      ...data,
    };
  }

  static clear(): void {
    this.context = {};
  }

  static hasContext(): boolean {
    return Object.keys(this.context).length > 0;
  }
}