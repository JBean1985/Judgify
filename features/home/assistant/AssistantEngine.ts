import { intents } from "./intents";

export interface AssistantResult {
  found: boolean;
    module?: string;
      intent?: string;
      }

      export class AssistantEngine {
        static detect(text: string): AssistantResult {
            const query = text.toLowerCase().trim();

                for (const intent of intents) {
                      const match = intent.keywords.find((keyword) =>
                              query.includes(keyword.toLowerCase())
                                    );

                                          if (match) {
                                                  return {
                                                            found: true,
                                                                      module: intent.module,
                                                                                intent: intent.id,
                                                                                        };
                                                                                              }
                                                                                                  }

                                                                                                      return {
                                                                                                            found: false,
                                                                                                                };
                                                                                                                  }
                                                                                                                  }