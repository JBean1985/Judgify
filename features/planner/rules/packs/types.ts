import { CategoryRules } from "../categories";
import { ProgramTypeId, ProgramTypeValidationOverrides } from "../programTypes";

export type FederationId =
  | "legacy"
  | "fpp"
  | "world-skate";

export interface RulePackKey {
  federation: FederationId;
  season: string;
}

export interface RuleProfile {
  federation: FederationId;
  season: string;
}

export interface OfficialSourceReference {
  sourceId: string;
  document: string;
  update: string;
}

export type JumpConfidence =
  | "confirmed"
  | "requires clarification"
  | "requires RollArt source";

export type JumpImplementationTarget =
  | "Validation Engine"
  | "Smart Builder"
  | "Element Catalogue"
  | "Technical Calling"
  | "Scoring / RollArt dependency";

export interface JumpRuleTraceability {
  ruleId: string;
  sourceId: string;
  printedPage: string;
  pdfPage: string;
  section: string;
  categories: string[];
  programTypes: string[];
  summary: string;
  implementationTargets: JumpImplementationTarget[];
  confidence: JumpConfidence;
  notes: string;
}

export interface JumpProgramRule extends JumpRuleTraceability {}

export interface JumpCombinationRule extends JumpRuleTraceability {}

export interface JumpRepetitionRule extends JumpRuleTraceability {}

export interface JumpRotationCallRule extends JumpRuleTraceability {}

export interface JumpBonusRule extends JumpRuleTraceability {}

export interface WorldSkateJumpRules {
  definitions: JumpProgramRule[];
  shortProgram: JumpProgramRule[];
  longProgram: JumpProgramRule[];
  combinations: JumpCombinationRule[];
  repetitions: JumpRepetitionRule[];
  rotationCalls: JumpRotationCallRule[];
  bonuses: JumpBonusRule[];
}

export type SpinConfidence =
  | "confirmed"
  | "requires clarification"
  | "requires RollArt source";

export type SpinImplementationTarget =
  | "Validation Engine"
  | "Smart Builder"
  | "Element Catalogue"
  | "Technical Calling"
  | "Scoring / RollArt dependency";

export interface SpinRuleTraceability {
  ruleId: string;
  sourceId: string;
  printedPage: string;
  pdfPage: string;
  section: string;
  categories: string[];
  programTypes: string[];
  summary: string;
  implementationTargets: SpinImplementationTarget[];
  confidence: SpinConfidence;
  notes: string;
}

export interface SpinProgramRule extends SpinRuleTraceability {}

export interface SpinDefinitionRule extends SpinRuleTraceability {}

export interface SpinConfirmationRule extends SpinRuleTraceability {}

export interface SpinCombinationRule extends SpinRuleTraceability {}

export interface SpinRestrictionRule extends SpinRuleTraceability {}

export interface DifficultPositionRule extends SpinRuleTraceability {}

export interface WorldSkateSpinRules {
  programRules: SpinProgramRule[];
  definitions: SpinDefinitionRule[];
  confirmations: SpinConfirmationRule[];
  combinations: SpinCombinationRule[];
  restrictions: SpinRestrictionRule[];
  difficultPositions: DifficultPositionRule[];
}

export type SequenceConfidence =
  | "confirmed"
  | "requires clarification"
  | "requires RollArt source";

export type SequenceImplementationTarget =
  | "Validation Engine"
  | "Smart Builder"
  | "Element Catalogue"
  | "Technical Calling"
  | "Scoring / RollArt dependency";

export interface SequenceRuleTraceability {
  ruleId: string;
  sourceId: string;
  printedPage: string;
  pdfPage: string;
  section: string;
  categories: string[];
  programTypes: string[];
  summary: string;
  implementationTargets: SequenceImplementationTarget[];
  confidence: SequenceConfidence;
  notes: string;
}

export interface StepSequenceProgramRule extends SequenceRuleTraceability {}

export interface StepSequenceDefinitionRule extends SequenceRuleTraceability {}

export interface StepSequenceLevelRule extends SequenceRuleTraceability {}

export interface ChoreographicSequenceRule extends SequenceRuleTraceability {}

export interface SequenceConfirmationRule extends SequenceRuleTraceability {}

export interface SequenceRestrictionRule extends SequenceRuleTraceability {}

export interface WorldSkateSequenceRules {
  stepProgramRules: StepSequenceProgramRule[];
  stepDefinitions: StepSequenceDefinitionRule[];
  stepLevels: StepSequenceLevelRule[];
  choreographicRules: ChoreographicSequenceRule[];
  confirmations: SequenceConfirmationRule[];
  restrictions: SequenceRestrictionRule[];
}

export type PenaltyConfidence =
  | "confirmed"
  | "requires clarification"
  | "requires RollArt source";

export type PenaltyApplicationMode = "manual" | "automatic" | "technical-call";

export type PenaltyAuthority =
  | "Referee"
  | "Technical Panel"
  | "Technical Specialist"
  | "Automatic Scoring System";

export type PenaltyAffectedScore =
  | "sum: technical content + artistic impression"
  | "technical content element value"
  | "program timing control";

export type PenaltyImplementationTarget =
  | "Validation Engine"
  | "Deduction Engine"
  | "Technical Calling"
  | "Scoring"
  | "UI / Referee controls";

export interface PenaltyRule {
  ruleId: string;
  sourceId: string;
  printedPage: string;
  pdfPage: string;
  section: string;
  categories: string[];
  programTypes: string[];
  authority: PenaltyAuthority;
  trigger: string;
  consequence: string;
  affectedScore: PenaltyAffectedScore;
  applicationMode: PenaltyApplicationMode;
  implementationTargets: PenaltyImplementationTarget[];
  confidence: PenaltyConfidence;
  notes: string;
}

export interface RefereePenaltyRule extends PenaltyRule {
  authority: "Referee";
}

export interface TechnicalPanelPenaltyRule extends PenaltyRule {
  authority: "Technical Panel";
}

export interface FallPenaltyRule extends PenaltyRule {
  authority: "Referee" | "Technical Specialist";
}

export interface MissingMandatoryElementRule extends PenaltyRule {
  authority: "Technical Panel" | "Automatic Scoring System";
}

export interface IllegalElementRule extends PenaltyRule {
  authority: "Technical Panel" | "Automatic Scoring System";
}

export interface MandatoryPositionRule extends PenaltyRule {
  authority: "Technical Panel";
}

export interface StarredElementRule extends PenaltyRule {
  authority:
    | "Technical Panel"
    | "Automatic Scoring System"
    | "Referee";
}

export interface ProgramTimeRule extends PenaltyRule {
  authority: "Referee" | "Technical Panel" | "Technical Specialist";
}

export interface WorldSkatePenaltyRules {
  refereePenalties: RefereePenaltyRule[];
  technicalPanelPenalties: TechnicalPanelPenaltyRule[];
  fallPenalties: FallPenaltyRule[];
  missingMandatoryElementRules: MissingMandatoryElementRule[];
  illegalElementRules: IllegalElementRule[];
  mandatoryPositionRules: MandatoryPositionRule[];
  starredElementRules: StarredElementRule[];
  programTimeRules: ProgramTimeRule[];
}

export type ElementCatalogueSectionId =
  | "jumps"
  | "spins"
  | "sequences"
  | "choreographic"
  | (string & {});

export interface ElementCatalogueEntry {
  code: string;
  name: string;
  discipline: string;
  category: string;
  type: string;
  family: string;
  rotations: number | null;
  baseValue: number | null;
  maxGOE: number | null;
  active: boolean;
  sourceRef: string;
  notes: string;
}

export interface ElementCatalogue {
  jumps: ElementCatalogueEntry[];
  spins: ElementCatalogueEntry[];
  sequences: ElementCatalogueEntry[];
  choreographic: ElementCatalogueEntry[];
  future?: Record<string, ElementCatalogueEntry[]>;
}

export interface RulePackMetadata {
  federation: FederationId;
  season: string;
  status: "legacy" | "draft" | "active";
  sourceRefs: OfficialSourceReference[];
  version?: string;

  // Backward-compatible identifier shape used by existing adapters.
  key: RulePackKey;
  name: string;

  // TODO: For official packs, only publish values after source confirmation.
  sourceConfirmed: boolean;
}

export interface RulePack {
  metadata: RulePackMetadata;
  categories: CategoryRules[];
  elementCatalogue?: ElementCatalogue;
  jumpRules?: WorldSkateJumpRules;
  spinRules?: WorldSkateSpinRules;
  sequenceRules?: WorldSkateSequenceRules;
  penaltyRules?: WorldSkatePenaltyRules;
  disciplines?: Record<string, unknown>[];
  programTypes?: Record<string, unknown>[];
  limits?: Record<string, unknown>;
  repetitionRules?: Record<string, unknown>;
  requiredElements?: Record<string, unknown>;
  deductions?: Record<string, unknown>;
  elementBaseValues?: Record<string, unknown>;
  goeTables?: Record<string, unknown>;
  pcsRules?: Record<string, unknown>;
  builderProfiles?: Record<string, unknown>;
  objectiveProfiles?: Record<string, unknown>;
  getProgramTypeValidationOverrides: (
    programTypeId: ProgramTypeId
  ) => ProgramTypeValidationOverrides | null;
}

export interface OfficialRulePack extends RulePack {
  metadata: RulePackMetadata & {
    version: string;
    status: "draft" | "active";
  };
  elementCatalogue: ElementCatalogue;
  jumpRules?: WorldSkateJumpRules;
  spinRules?: WorldSkateSpinRules;
  sequenceRules?: WorldSkateSequenceRules;
  penaltyRules?: WorldSkatePenaltyRules;
  disciplines: Record<string, unknown>[];
  programTypes: Record<string, unknown>[];
  limits: Record<string, unknown>;
  repetitionRules: Record<string, unknown>;
  requiredElements: Record<string, unknown>;
  deductions: Record<string, unknown>;
  elementBaseValues: Record<string, unknown>;
  goeTables: Record<string, unknown>;
  pcsRules: Record<string, unknown>;
  builderProfiles: Record<string, unknown>;
  objectiveProfiles: Record<string, unknown>;
}

export type PackSectionRecord = Record<string, unknown>;

export interface WorldSkate2026DraftRulePack extends OfficialRulePack {
  metadata: RulePackMetadata & {
    version: "2026-draft";
    status: "draft";
    sourceConfirmed: false;
  };
  jumpRules: WorldSkateJumpRules;
  spinRules?: WorldSkateSpinRules;
  sequenceRules?: WorldSkateSequenceRules;
  penaltyRules?: WorldSkatePenaltyRules;
}
