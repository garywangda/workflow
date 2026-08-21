import type { XYPosition } from "@xyflow/react";
import { ACTION_PRESETS } from "../config/action-presets";
import { WORKFLOW_NODE_DEFINITIONS } from "../config/workflow-node-definitions";
import type { ActionPresetId } from "../types/action-preset";
import type { WorkflowNode, WorkflowNodeType } from "../types/workflow-node";

interface CreateWorkflowNodeInput {
  type: WorkflowNodeType;
  position: XYPosition;
  presetId?: ActionPresetId;
}

function createNodeId() {
  return `workflow-node-${globalThis.crypto.randomUUID()}`;
}

export function createWorkflowNode({ type, position, presetId }: CreateWorkflowNodeInput): WorkflowNode {
  const definition = WORKFLOW_NODE_DEFINITIONS[type];
  const preset = presetId ? ACTION_PRESETS[presetId] : undefined;

  return {
    id: createNodeId(),
    type,
    position,
    data: {
      name: preset?.label ?? definition.defaultName,
      capabilities: [...definition.capabilities],
      config: structuredClone(preset?.defaultConfig ?? definition.defaultConfig),
      inputs: [],
      outputs: [],
      appearance: { semanticRole: definition.appearance.semanticRole, density: "default" },
      metadata: { schemaVersion: 1 },
    },
    selected: true,
    ariaLabel: `${definition.label} workflow node`,
  };
}
