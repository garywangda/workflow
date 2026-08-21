import { useCallback, useState } from "react";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { useEditorToolShortcuts } from "../hooks/useEditorToolShortcuts";
import type { EditorToolId } from "../types/editor-tool";

export function WorkflowEditorWorkspace() {
  const [activeTool, setActiveTool] = useState<EditorToolId>("select");

  const handleToolChange = useCallback((tool: EditorToolId) => {
    setActiveTool(tool);
  }, []);

  useEditorToolShortcuts(handleToolChange);

  return (
    <section className="workflow-editor__workspace" aria-label="Editor workspace">
      <WorkflowCanvas activeTool={activeTool} onToolChange={handleToolChange} />
    </section>
  );
}
