import type { ComponentType } from "react";
import type { NodeCapabilityId, WorkflowNode } from "./workflow-node";

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
