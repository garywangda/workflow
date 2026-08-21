import type { ActionPresetId } from "./action-preset";
import type { DiagramElementType } from "./diagram-element";
import type { WorkflowNodeType } from "./workflow-node";

// Node Library 到 Canvas 的意图消息；它描述“要放置什么”，而不是一个已创建的 Node。
export type WorkflowNodePlacement = {
  kind: "workflow-node";
  type: WorkflowNodeType;
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
