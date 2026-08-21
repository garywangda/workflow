import { Hand, MousePointer2 } from "lucide-react";
import type { EditorToolDefinition } from "../types/editor-tool";

export const EDITOR_TOOLS = [
  { id: "select", label: "Select", icon: MousePointer2, shortcut: "V", ariaLabel: "Select tool" },
  { id: "hand", label: "Hand", icon: Hand, shortcut: "H", ariaLabel: "Hand tool" },
] satisfies readonly EditorToolDefinition[];
