import type { ComponentType } from "react";
import type { NodeCapabilityId, WorkflowNode } from "./workflow-node";

// Inspector 区块通过 capability 接收节点，避免每个区块重复判断节点类型。
export interface InspectorBlockProps {
  node: WorkflowNode;
  capability: NodeCapabilityId;
}

export interface InspectorBlockDefinition {
  capability: NodeCapabilityId;
  label: string;
  order: number;
  render: ComponentType<InspectorBlockProps>;
}
