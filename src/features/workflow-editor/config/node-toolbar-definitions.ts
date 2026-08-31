import {
  AlarmClock,
  CirclePlay,
  CircleStop,
  ShieldCheck,
  UserRound,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

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
    icon: CirclePlay,
  },
  {
    type: "humanTask",
    label: "Human Task",
    description: "Choose work that needs a person to complete it.",
    icon: UserRound,
  },
  {
    type: "approval",
    label: WORKFLOW_NODE_DEFINITIONS.approval.label,
    description: "Choose an approval or review step.",
    icon: ShieldCheck,
  },
  {
    type: "action",
    label: WORKFLOW_NODE_DEFINITIONS.action.label,
    description: "Choose an automated action or integration.",
    icon: Zap,
  },
  {
    type: "logic",
    label: "Logic",
    description: "Choose branching, routing, or parallel logic.",
    icon: Workflow,
  },
  {
    type: "wait",
    label: WORKFLOW_NODE_DEFINITIONS.wait.label,
    description: "Choose a delay or scheduled pause.",
    icon: AlarmClock,
  },
  {
    type: "end",
    label: WORKFLOW_NODE_DEFINITIONS.end.label,
    description: "Choose how the workflow finishes.",
    icon: CircleStop,
  },
] as const;
