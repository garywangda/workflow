import type { Node } from "@xyflow/react";

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

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;
