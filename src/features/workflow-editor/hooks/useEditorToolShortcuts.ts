import { useEffect } from "react";
import type { EditorTool } from "../types/editor-tool";

const TOOL_SHORTCUTS: Readonly<Record<string, EditorTool>> = { v: "select", h: "hand" };

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
}

export function useEditorToolShortcuts(onToolChange: (tool: EditorTool) => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) return;
      if (event.key === "Escape") {
        onToolChange("select");
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const tool = TOOL_SHORTCUTS[event.key.toLowerCase()];
      if (tool) onToolChange(tool);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToolChange]);
}
