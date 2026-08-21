import { EDITOR_TOOLS } from "../../config/editor-tools";
import type { EditorTool } from "../../types/editor-tool";

// 画布工具栏只负责呈现工具和触发切换，快捷键由 useEditorToolShortcuts 处理。
export function EditorTools({ activeEditorTool, onEditorToolChange }: { activeEditorTool: EditorTool; onEditorToolChange: (tool: EditorTool) => void }) {
  return (
    <div className="editor-tools" role="toolbar" aria-label="Editor tools">
      {EDITOR_TOOLS.map((tool) => {
        const Icon = tool.icon;
        return <button key={tool.id} className="editor-tools__button" type="button" aria-label={tool.ariaLabel} aria-pressed={activeEditorTool === tool.id} data-active={activeEditorTool === tool.id ? "true" : "false"} title={`${tool.label} (${tool.shortcut})`} onClick={() => onEditorToolChange(tool.id)}><Icon size={17} strokeWidth={1.9} /></button>;
      })}
    </div>
  );
}
