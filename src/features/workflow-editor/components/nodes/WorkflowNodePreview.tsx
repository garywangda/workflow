import type { XYPosition } from "@xyflow/react";
import { WORKFLOW_NODE_DEFINITIONS } from "../../config/workflow-node-definitions";
import type { WorkflowNodeType } from "../../types/workflow-node";
import { BaseWorkflowNode } from "./BaseWorkflowNode";

interface WorkflowNodePreviewProps {
  type: WorkflowNodeType;
  position: XYPosition;
}

export function WorkflowNodePreview({ type, position }: WorkflowNodePreviewProps) {
  const definition = WORKFLOW_NODE_DEFINITIONS[type];

  return (
    <div
      className="workflow-node-preview"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
      }}
      aria-hidden="true"
    >
      <BaseWorkflowNode type={type} label={definition.label} icon={definition.icon} preview />
    </div>
  );
}
