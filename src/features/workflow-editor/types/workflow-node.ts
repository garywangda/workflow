import type { Node } from "@xyflow/react";

export type WorkflowNodeType = "start" | "task" | "approval" | "decision" | "end";

export type WorkflowNodeData = {
  label: string;
};

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;
