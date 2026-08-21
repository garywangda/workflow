import { useEffect } from "react";
import type { EditorToolId } from "../types/editor-tool";

const TOOL_SHORTCUTS: Readonly<Record<string, EditorToolId>> = {
  v: "select",
  h: "hand",
  s: "start",
  t: "task",
  a: "approval",
  d: "decision",
  e: "end",
};

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}

export function useEditorToolShortcuts(onToolChange: (tool: EditorToolId) => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "Escape") {
        onToolChange("select");
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const key = event.key.toLowerCase();
      const tool = TOOL_SHORTCUTS[key];

      if (tool) {
        onToolChange(tool);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onToolChange]);
}
