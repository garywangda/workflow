import type { LucideIcon } from "lucide-react";

export type EditorTool = "select" | "hand";

export interface EditorToolDefinition {
  id: EditorTool;
  label: string;
  icon: LucideIcon;
  shortcut: string;
  ariaLabel: string;
}
