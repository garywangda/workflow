import type { ActionPresetId } from "./action-preset";
import type { DiagramElementType } from "./diagram-element";
import type { WorkflowNodeType } from "./workflow-node";

export type WorkflowNodePlacement = {
  kind: "workflow-node";
  type: WorkflowNodeType;
  presetId?: string;
  presetName?: string;
  presetConfig?: Record<string, unknown>;
};

export type DiagramElementPlacement = {
  kind: "diagram";
  type: DiagramElementType;
};

export type ActionPresetPlacement = {
  kind: "action-preset";
  presetId: ActionPresetId;
};

export type PlacementItem = WorkflowNodePlacement | DiagramElementPlacement | ActionPresetPlacement;
