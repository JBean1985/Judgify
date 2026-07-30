import { categories } from "../categories";
import {
  getProgramTypeValidationOverrides,
  ProgramTypeId,
} from "../programTypes";
import { RulePack } from "./types";

export const LEGACY_RULE_PACK: RulePack = {
  metadata: {
    federation: "legacy",
    season: "current",
    status: "legacy",
    sourceRefs: [],
    key: {
      federation: "legacy",
      season: "current",
    },
    name: "Legacy Default Rules",
    // TODO: Keep false for legacy until official federation/season sources are validated.
    sourceConfirmed: false,
  },
  categories,
  getProgramTypeValidationOverrides: (
    programTypeId: ProgramTypeId
  ) => getProgramTypeValidationOverrides(programTypeId),
};
