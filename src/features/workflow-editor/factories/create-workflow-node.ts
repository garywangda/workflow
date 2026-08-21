import type { XYPosition } from "@xyflow/react";
import { WORKFLOW_NODE_DEFINITIONS } from "../config/workflow-node-definitions";
import type { WorkflowNode, WorkflowNodeType } from "../types/workflow-node";

interface CreateWorkflowNodeInput {
  type: WorkflowNodeType;
  position: XYPosition;
}

function createNodeId() {
  return `workflow-node-${globalThis.crypto.randomUUID()}`;
}

export function createWorkflowNode({ type, position }: CreateWorkflowNodeInput): WorkflowNode {
  const definition = WORKFLOW_NODE_DEFINITIONS[type];

  return {
    id: createNodeId(),
    type,
    position,
    data: {
      label: definition.label,
    },
    selected: true,
    ariaLabel: `${definition.label} workflow node`,
  };
}
