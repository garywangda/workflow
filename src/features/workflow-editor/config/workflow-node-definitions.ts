import { BadgeCheck, CirclePlay, CircleStop, Diamond, Square, type LucideIcon } from "lucide-react";
import type { EditorToolId } from "../types/editor-tool";
import type { WorkflowNodeType } from "../types/workflow-node";

export interface WorkflowNodeDefinition {
  type: WorkflowNodeType;
  label: string;
  icon: LucideIcon;
}

export const WORKFLOW_NODE_DEFINITIONS = {
  start: {
    type: "start",
    label: "Start",
    icon: CirclePlay,
  },
  task: {
    type: "task",
    label: "Task",
    icon: Square,
  },
  approval: {
    type: "approval",
    label: "Approval",
    icon: BadgeCheck,
  },
  decision: {
    type: "decision",
    label: "Decision",
    icon: Diamond,
  },
  end: {
    type: "end",
    label: "End",
    icon: CircleStop,
  },
} satisfies Record<WorkflowNodeType, WorkflowNodeDefinition>;

const WORKFLOW_NODE_TOOL_IDS = new Set<EditorToolId>([
  "start",
  "task",
  "approval",
  "decision",
  "end",
]);

export function isWorkflowNodeTool(tool: EditorToolId): tool is WorkflowNodeType {
  return WORKFLOW_NODE_TOOL_IDS.has(tool);
}
