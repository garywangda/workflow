import type { XYPosition } from "@xyflow/react";
import { WORKFLOW_NODE_DEFINITIONS } from "../../config/workflow-node-definitions";
import type { WorkflowNodeType } from "../../types/workflow-node";
import { BaseWorkflowNode } from "./BaseWorkflowNode";

interface WorkflowNodePreviewProps {
  type: WorkflowNodeType;
  position: XYPosition;
}

// 放置模式下跟随鼠标的预览节点，不注册为真实 Node，也不显示可连接 Handle。
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
      <BaseWorkflowNode type={type} semanticLabel={definition.label} name={definition.defaultName} preview />
    </div>
  );
}
