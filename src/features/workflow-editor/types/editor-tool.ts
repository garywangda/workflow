import type { LucideIcon } from "lucide-react";

export type EditorToolId =
  | "select"
  | "hand"
  | "start"
  | "task"
  | "approval"
  | "decision"
  | "end"
  | "text"
  | "note";

export type EditorToolGroup = "navigation" | "workflow" | "annotation";

export interface EditorToolDefinition {
  id: EditorToolId;
  label: string;
  icon: LucideIcon;
  group: EditorToolGroup;
  shortcut?: string;
  disabled?: boolean;
  ariaLabel: string;
}
