import type { Node } from "@xyflow/react";

// 语义节点类型。显示名称、图标、能力和默认配置统一定义在 config/workflow-node-definitions.ts。
export type WorkflowNodeType =
  | "trigger"
  | "task"
  | "approval"
  | "form"
  | "condition"
  | "parallel"
  | "merge"
  | "wait"
  | "action"
  | "end";

export type NodeConfig = Record<string, unknown>;

// 能力是 Inspector 的驱动键；节点声明拥有哪些能力，Inspector 就可以渲染对应配置区块。
export type NodeCapabilityId =
  | "setup"
  | "assignment"
  | "form"
  | "input"
  | "output"
  | "completion"
  | "approvalPolicy"
  | "rules"
  | "branches"
  | "timing"
  | "action"
  | "notification"
  | "retry"
  | "escalation"
  | "exception"
  | "permissions"
  | "appearance";

export interface NodeInputDefinition {
  id: string;
  label: string;
  type?: string;
}

export interface NodeOutputDefinition {
  id: string;
  label: string;
  type?: string;
}

export interface NodeAppearance {
  semanticRole: string;
  density: "default";
}

export interface NodeMetadata {
  schemaVersion: number;
}

export type WorkflowNodeData = {
  name: string;
  capabilities: NodeCapabilityId[];
  config: NodeConfig;
  inputs: NodeInputDefinition[];
  outputs: NodeOutputDefinition[];
  appearance: NodeAppearance;
  metadata: NodeMetadata;
};

// 使用 React Flow 的 Node 泛型，把节点 data 和节点 type 绑定起来。
export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;
