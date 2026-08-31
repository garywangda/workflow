import type { NodeOrigin, NodeTypes } from "@xyflow/react";
import { DiagramNodeComponent } from "./DiagramNode";
import { ConditionBranchNodeComponent } from "./ConditionBranchNode";
import { WorkflowNodeComponent } from "./WorkflowNode";

export const WORKFLOW_NODE_ORIGIN: NodeOrigin = [0.5, 0.5];

// React Flow 的 nodeTypes 注册表。多个语义节点复用 WorkflowNodeComponent，图形元素复用 DiagramNodeComponent。
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
  "condition-branch": ConditionBranchNodeComponent,
  "diagram:rectangle": DiagramNodeComponent,
  "diagram:circle": DiagramNodeComponent,
  "diagram:diamond": DiagramNodeComponent,
  "diagram:text": DiagramNodeComponent,
  "diagram:note": DiagramNodeComponent,
} satisfies NodeTypes;
