import { useCallback, useState } from "react";
import { useEditorToolShortcuts } from "../hooks/useEditorToolShortcuts";
import type { EditorTool } from "../types/editor-tool";
import type { PlacementItem } from "../types/placement";
import { NodeLibrary } from "./library/NodeLibrary";
import { NodeInspector } from "./inspector/NodeInspector";
import { WorkflowCanvas } from "./WorkflowCanvas";

export function WorkflowEditorWorkspace() {
  // Workspace 只管理左右面板与画布之间共享的编辑上下文，不直接操作 React Flow 节点。
  const [activeEditorTool, setActiveEditorTool] = useState<EditorTool>("select");
  const [placementItem, setPlacementItem] = useState<PlacementItem | null>(null);

  const handleEditorToolChange = useCallback((tool: EditorTool) => {
    // 切换选择/手型工具时，取消尚未放置的节点，避免两种模式同时生效。
    setActiveEditorTool(tool);
    setPlacementItem(null);
  }, []);

  const handlePlacementItemChange = useCallback((item: PlacementItem | null) => {
    // placementItem 非空表示进入“点击画布放置”模式。
    setPlacementItem(item);
    if (item) setActiveEditorTool("select");
  }, []);

  useEditorToolShortcuts(handleEditorToolChange);

  return (
    <section className="flex min-h-0 flex-1 overflow-hidden" aria-label="Editor workspace">
      <NodeLibrary placementItem={placementItem} onPlacementItemChange={handlePlacementItemChange} />
      <WorkflowCanvas activeEditorTool={activeEditorTool} placementItem={placementItem} onEditorToolChange={handleEditorToolChange} onPlacementItemChange={handlePlacementItemChange} />
      <NodeInspector />
    </section>
  );
}
