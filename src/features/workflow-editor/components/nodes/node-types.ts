import type { NodeOrigin, NodeTypes } from "@xyflow/react";
import { WorkflowNodeComponent } from "./WorkflowNode";

export const WORKFLOW_NODE_ORIGIN: NodeOrigin = [0.5, 0.5];

export const workflowNodeTypes = {
  start: WorkflowNodeComponent,
  task: WorkflowNodeComponent,
  approval: WorkflowNodeComponent,
  decision: WorkflowNodeComponent,
  end: WorkflowNodeComponent,
} satisfies NodeTypes;
