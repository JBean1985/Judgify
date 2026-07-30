import { ProgramTypeId } from "../../../programTypes";
import { OfficialRulePack } from "../../types";

export const FPP_2026_RULE_PACK: OfficialRulePack = {
  metadata: {
    federation: "fpp",
    season: "2026",
    status: "draft",
    sourceRefs: [],
    version: "draft",
    key: {
      federation: "fpp",
      season: "2026",
    },
    name: "FPP 2026 (Draft)",
    // TODO: Set true only after all official FPP 2026 sources are confirmed.
    sourceConfirmed: false,
  },
  // TODO: Replace placeholder categories with official FPP 2026 values from confirmed sources.
  categories: [],
  elementCatalogue: {
    // TODO: Populate only after official FPP / World Skate confirmation.
    jumps: [],
    // TODO: Populate only after official FPP / World Skate confirmation.
    spins: [],
    // TODO: Populate only after official FPP / World Skate confirmation.
    sequences: [],
    // TODO: Populate only after official FPP / World Skate confirmation.
    choreographic: [],
  },
  // TODO: Populate official FPP / World Skate disciplines only after source confirmation.
  disciplines: [],
  // TODO: Populate official FPP / World Skate program types only after source confirmation.
  programTypes: [],
  // TODO: Populate official validation limits only after source confirmation.
  limits: {},
  // TODO: Populate official repetition rules only after source confirmation.
  repetitionRules: {},
  // TODO: Populate official required elements only after source confirmation.
  requiredElements: {},
  // TODO: Populate official deductions only after source confirmation.
  deductions: {},
  // TODO: Populate official element base values only after source confirmation.
  elementBaseValues: {},
  // TODO: Populate official GOE tables only after source confirmation.
  goeTables: {},
  // TODO: Populate official PCS rules only after source confirmation.
  pcsRules: {},
  // TODO: Populate official builder profiles only after source confirmation.
  builderProfiles: {},
  // TODO: Populate official objective profiles only after source confirmation.
  objectiveProfiles: {},
  getProgramTypeValidationOverrides: (
    _programTypeId: ProgramTypeId
  ) => {
    // TODO: Add official FPP 2026 program type overrides after source confirmation.
    return null;
  },
};
