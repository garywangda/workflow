import { useCallback, useState } from "react";
import { useEditorToolShortcuts } from "../hooks/useEditorToolShortcuts";
import type { EditorTool } from "../types/editor-tool";
import type { PlacementItem } from "../types/placement";
import { NodeLibrary } from "./library/NodeLibrary";
import { NodeInspector } from "./inspector/NodeInspector";
import { WorkflowCanvas } from "./WorkflowCanvas";

export function WorkflowEditorWorkspace() {
  const [activeEditorTool, setActiveEditorTool] = useState<EditorTool>("select");
  const [placementItem, setPlacementItem] = useState<PlacementItem | null>(null);

  const handleEditorToolChange = useCallback((tool: EditorTool) => {
    setActiveEditorTool(tool);
    setPlacementItem(null);
  }, []);

  const handlePlacementItemChange = useCallback((item: PlacementItem | null) => {
    setPlacementItem(item);
    if (item) setActiveEditorTool("select");
  }, []);

  useEditorToolShortcuts(handleEditorToolChange);

  return (
    <section className="workflow-editor__workspace" aria-label="Editor workspace">
      <NodeLibrary placementItem={placementItem} onPlacementItemChange={handlePlacementItemChange} />
      <WorkflowCanvas activeEditorTool={activeEditorTool} placementItem={placementItem} onEditorToolChange={handleEditorToolChange} onPlacementItemChange={handlePlacementItemChange} />
      <NodeInspector />
    </section>
  );
}
