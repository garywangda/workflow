import {
  Hand,
  MousePointer2,
  StickyNote,
  Type,
} from "lucide-react";
import type { EditorToolDefinition, EditorToolGroup } from "../types/editor-tool";
import { WORKFLOW_NODE_DEFINITIONS } from "./workflow-node-definitions";

export const TOOL_GROUP_ORDER: EditorToolGroup[] = ["navigation", "workflow", "annotation"];

export const TOOL_GROUP_LABELS: Record<EditorToolGroup, string> = {
  navigation: "Navigation tools",
  workflow: "Workflow tools",
  annotation: "Annotation tools",
};

export const EDITOR_TOOLS = [
  {
    id: "select",
    label: "Select",
    icon: MousePointer2,
    group: "navigation",
    shortcut: "V",
    ariaLabel: "Select tool",
  },
  {
    id: "hand",
    label: "Hand",
    icon: Hand,
    group: "navigation",
    shortcut: "H",
    ariaLabel: "Hand tool",
  },
  {
    id: "start",
    label: WORKFLOW_NODE_DEFINITIONS.start.label,
    icon: WORKFLOW_NODE_DEFINITIONS.start.icon,
    group: "workflow",
    shortcut: "S",
    ariaLabel: "Start tool",
  },
  {
    id: "task",
    label: WORKFLOW_NODE_DEFINITIONS.task.label,
    icon: WORKFLOW_NODE_DEFINITIONS.task.icon,
    group: "workflow",
    shortcut: "T",
    ariaLabel: "Task tool",
  },
  {
    id: "approval",
    label: WORKFLOW_NODE_DEFINITIONS.approval.label,
    icon: WORKFLOW_NODE_DEFINITIONS.approval.icon,
    group: "workflow",
    shortcut: "A",
    ariaLabel: "Approval tool",
  },
  {
    id: "decision",
    label: WORKFLOW_NODE_DEFINITIONS.decision.label,
    icon: WORKFLOW_NODE_DEFINITIONS.decision.icon,
    group: "workflow",
    shortcut: "D",
    ariaLabel: "Decision tool",
  },
  {
    id: "end",
    label: WORKFLOW_NODE_DEFINITIONS.end.label,
    icon: WORKFLOW_NODE_DEFINITIONS.end.icon,
    group: "workflow",
    shortcut: "E",
    ariaLabel: "End tool",
  },
  {
    id: "text",
    label: "Text",
    icon: Type,
    group: "annotation",
    shortcut: "X",
    ariaLabel: "Text tool",
  },
  {
    id: "note",
    label: "Note",
    icon: StickyNote,
    group: "annotation",
    shortcut: "N",
    ariaLabel: "Note tool",
  },
] satisfies EditorToolDefinition[];
