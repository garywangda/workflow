import {
  BadgeCheck,
  CirclePlay,
  CircleStop,
  ClipboardList,
  Clock3,
  GitBranch,
  Merge,
  Split,
  Square,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { NodeCapabilityId, NodeConfig, WorkflowNodeType } from "../types/workflow-node";

export type WorkflowNodeCategory = "event" | "human" | "logic" | "automation" | "end";

export interface WorkflowNodeDefinition {
  type: WorkflowNodeType;
  category: WorkflowNodeCategory;
  label: string;
  description: string;
  icon: LucideIcon;
  defaultName: string;
  capabilities: readonly NodeCapabilityId[];
  defaultConfig: NodeConfig;
  appearance: { semanticRole: string };
  keywords: readonly string[];
}

export const WORKFLOW_NODE_DEFINITIONS = {
  trigger: { type: "trigger", category: "event", label: "Trigger", description: "Starts a workflow when an event occurs.", icon: CirclePlay, defaultName: "Trigger", capabilities: ["setup", "output"], defaultConfig: {}, appearance: { semanticRole: "event" }, keywords: ["event", "start", "when"] },
  task: { type: "task", category: "human", label: "Task", description: "Assigns a human step to someone on your team.", icon: Square, defaultName: "Task", capabilities: ["setup", "assignment", "form", "input", "output", "completion", "timing", "notification", "escalation", "permissions"], defaultConfig: {}, appearance: { semanticRole: "human-task" }, keywords: ["people", "human", "work"] },
  approval: { type: "approval", category: "human", label: "Approval", description: "Requests a decision from one or more approvers.", icon: BadgeCheck, defaultName: "Approval", capabilities: ["setup", "assignment", "approvalPolicy", "form", "input", "output", "rules", "timing", "escalation", "notification"], defaultConfig: {}, appearance: { semanticRole: "approval" }, keywords: ["people", "review", "approve"] },
  form: { type: "form", category: "human", label: "Form", description: "Collects structured information from a person.", icon: ClipboardList, defaultName: "Form", capabilities: ["setup", "form", "input", "output", "timing"], defaultConfig: {}, appearance: { semanticRole: "form" }, keywords: ["people", "collect", "fields"] },
  condition: { type: "condition", category: "logic", label: "Condition", description: "Evaluates an IF / ELSE business rule.", icon: GitBranch, defaultName: "Condition", capabilities: ["setup", "input", "rules", "branches"], defaultConfig: {}, appearance: { semanticRole: "condition" }, keywords: ["logic", "if", "else", "decision", "rule"] },
  parallel: { type: "parallel", category: "logic", label: "Parallel", description: "Prepares work to happen in parallel.", icon: Split, defaultName: "Parallel", capabilities: ["setup", "branches"], defaultConfig: {}, appearance: { semanticRole: "parallel" }, keywords: ["logic", "branch", "together"] },
  merge: { type: "merge", category: "logic", label: "Merge", description: "Prepares multiple paths to converge.", icon: Merge, defaultName: "Merge", capabilities: ["setup", "rules"], defaultConfig: {}, appearance: { semanticRole: "merge" }, keywords: ["logic", "join", "converge"] },
  wait: { type: "wait", category: "logic", label: "Wait", description: "Pauses a workflow until timing or a rule is configured.", icon: Clock3, defaultName: "Wait", capabilities: ["setup", "timing", "rules"], defaultConfig: {}, appearance: { semanticRole: "wait" }, keywords: ["logic", "pause", "delay"] },
  action: { type: "action", category: "automation", label: "Action", description: "Performs an automated business operation.", icon: Zap, defaultName: "Action", capabilities: ["setup", "action", "input", "output", "retry", "exception", "timing"], defaultConfig: {}, appearance: { semanticRole: "automation" }, keywords: ["automation", "system", "integration"] },
  end: { type: "end", category: "end", label: "End", description: "Marks the end of a workflow.", icon: CircleStop, defaultName: "End", capabilities: ["setup", "input"], defaultConfig: {}, appearance: { semanticRole: "end" }, keywords: ["finish", "complete", "structure"] },
} satisfies Record<WorkflowNodeType, WorkflowNodeDefinition>;

export const WORKFLOW_NODE_LIBRARY_ORDER: readonly WorkflowNodeType[] = ["trigger", "task", "approval", "form", "condition", "parallel", "merge", "wait", "end"];
