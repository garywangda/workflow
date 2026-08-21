import { Hand, MousePointer2 } from "lucide-react";
import type { EditorToolDefinition } from "../types/editor-tool";

// 工具栏的显示配置和快捷键；工具行为仍由 Canvas 和快捷键 Hook 执行。
export const EDITOR_TOOLS = [
  { id: "select", label: "Select", icon: MousePointer2, shortcut: "V", ariaLabel: "Select tool" },
  { id: "hand", label: "Hand", icon: Hand, shortcut: "H", ariaLabel: "Hand tool" },
] satisfies readonly EditorToolDefinition[];
