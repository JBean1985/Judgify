import { FPP_2026_RULE_PACK } from "./fpp/2026";
import { LEGACY_RULE_PACK } from "./legacy";
import { RulePack, RuleProfile } from "./types";
import { WORLD_SKATE_2026_RULE_PACK } from "./world-skate/2026";

export * from "./types";
export * from "./legacy";
export * from "./fpp/2026";
export * from "./world-skate/2026";

const rulePackRegistry: Record<string, RulePack> = {
  "fpp:2026": FPP_2026_RULE_PACK,
  "world-skate:2026": WORLD_SKATE_2026_RULE_PACK,
};

function toRegistryKey(profile: RuleProfile): string {
  return `${profile.federation}:${profile.season}`;
}

export function resolveRulePack(profile?: RuleProfile): RulePack {
  if (!profile || profile.federation === "legacy") {
    return LEGACY_RULE_PACK;
  }

  const selectedPack = rulePackRegistry[toRegistryKey(profile)];

  if (!selectedPack) {
    return LEGACY_RULE_PACK;
  }

  // TODO: Keep legacy effective until official packs are confirmed by source.
  if (
    selectedPack.metadata.status === "draft" ||
    !selectedPack.metadata.sourceConfirmed
  ) {
    return LEGACY_RULE_PACK;
  }

  return selectedPack;
}

export function getDefaultRulePack() {
  return LEGACY_RULE_PACK;
}
