import type { LucideIcon } from "lucide-react";

import { WORKFLOW_NODE_DEFINITIONS } from "@/features/workflow-editor/config/workflow-node-definitions";
import type { WorkflowNodeToolbarType } from "@/features/workflow-editor/types/node-toolbar";

export interface WorkflowNodeToolbarDefinition {
  type: WorkflowNodeToolbarType;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const WORKFLOW_NODE_TOOLBAR_DEFINITIONS: readonly WorkflowNodeToolbarDefinition[] = [
  {
    type: "trigger",
    label: WORKFLOW_NODE_DEFINITIONS.trigger.label,
    description: "Choose how the workflow starts.",
    icon: WORKFLOW_NODE_DEFINITIONS.trigger.icon,
  },
  {
    type: "humanTask",
    label: "Human Task",
    description: "Choose work that needs a person to complete it.",
    icon: WORKFLOW_NODE_DEFINITIONS.task.icon,
  },
  {
    type: "approval",
    label: WORKFLOW_NODE_DEFINITIONS.approval.label,
    description: "Choose an approval or review step.",
    icon: WORKFLOW_NODE_DEFINITIONS.approval.icon,
  },
  {
    type: "action",
    label: WORKFLOW_NODE_DEFINITIONS.action.label,
    description: "Choose an automated action or integration.",
    icon: WORKFLOW_NODE_DEFINITIONS.action.icon,
  },
  {
    type: "logic",
    label: "Logic",
    description: "Choose branching, routing, or parallel logic.",
    icon: WORKFLOW_NODE_DEFINITIONS.condition.icon,
  },
  {
    type: "wait",
    label: WORKFLOW_NODE_DEFINITIONS.wait.label,
    description: "Choose a delay or scheduled pause.",
    icon: WORKFLOW_NODE_DEFINITIONS.wait.icon,
  },
  {
    type: "end",
    label: WORKFLOW_NODE_DEFINITIONS.end.label,
    description: "Choose how the workflow finishes.",
    icon: WORKFLOW_NODE_DEFINITIONS.end.icon,
  },
] as const;
