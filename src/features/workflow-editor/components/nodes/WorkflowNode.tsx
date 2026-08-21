import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { WORKFLOW_NODE_DEFINITIONS } from "../../config/workflow-node-definitions";
import type { WorkflowNode as WorkflowNodeModel } from "../../types/workflow-node";
import { BaseWorkflowNode } from "./BaseWorkflowNode";

export const WorkflowNodeComponent = memo(function WorkflowNodeComponent({
  data,
  type,
  selected,
  dragging,
}: NodeProps<WorkflowNodeModel>) {
  const definition = WORKFLOW_NODE_DEFINITIONS[type];

  return (
    <BaseWorkflowNode
      type={type}
      label={data.label}
      icon={definition.icon}
      selected={selected}
      dragging={dragging}
    />
  );
});
