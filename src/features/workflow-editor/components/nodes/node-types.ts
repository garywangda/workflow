import type { NodeOrigin, NodeTypes } from "@xyflow/react";
import { DiagramNodeComponent } from "./DiagramNode";
import { WorkflowNodeComponent } from "./WorkflowNode";

export const WORKFLOW_NODE_ORIGIN: NodeOrigin = [0.5, 0.5];

export const workflowNodeTypes = {
  trigger: WorkflowNodeComponent,
  task: WorkflowNodeComponent,
  approval: WorkflowNodeComponent,
  form: WorkflowNodeComponent,
  condition: WorkflowNodeComponent,
  parallel: WorkflowNodeComponent,
  merge: WorkflowNodeComponent,
  wait: WorkflowNodeComponent,
  action: WorkflowNodeComponent,
  end: WorkflowNodeComponent,
  "diagram:rectangle": DiagramNodeComponent,
  "diagram:circle": DiagramNodeComponent,
  "diagram:diamond": DiagramNodeComponent,
  "diagram:text": DiagramNodeComponent,
  "diagram:note": DiagramNodeComponent,
} satisfies NodeTypes;
