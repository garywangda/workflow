import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { WORKFLOW_NODE_DEFINITIONS } from "../../config/workflow-node-definitions";
import type { WorkflowNode as WorkflowNodeModel } from "../../types/workflow-node";
import { BaseWorkflowNode } from "./BaseWorkflowNode";

// 语义 Workflow Node 的适配层：读取定义配置，再交给通用视觉组件渲染。
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
      semanticLabel={definition.label}
      name={data.name}
      description={data.description}
      assignee={data.assignee}
      provider={data.provider}
      configStatus={data.configStatus}
      icon={definition.icon}
      selected={selected}
      dragging={dragging}
    />
  );
});
