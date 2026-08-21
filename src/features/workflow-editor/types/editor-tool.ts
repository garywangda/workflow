import type { LucideIcon } from "lucide-react";

// 当前只保留选择和手型两个画布工具，后续工具可扩展此联合类型及配置表。
export type EditorTool = "select" | "hand";

export interface EditorToolDefinition {
  id: EditorTool;
  label: string;
  icon: LucideIcon;
  shortcut: string;
  ariaLabel: string;
}
