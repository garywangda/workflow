import { EDITOR_TOOLS } from "../../config/editor-tools";
import type { EditorTool } from "../../types/editor-tool";

// 画布工具栏只负责呈现工具和触发切换，快捷键由 useEditorToolShortcuts 处理。
export function EditorTools({ activeEditorTool, onEditorToolChange }: { activeEditorTool: EditorTool; onEditorToolChange: (tool: EditorTool) => void }) {
  return (
    <div className="inline-flex gap-1 rounded-[9px] border border-border bg-panel p-1 shadow-panel" role="toolbar" aria-label="Editor tools">
      {EDITOR_TOOLS.map((tool) => {
        const Icon = tool.icon;
        return <button key={tool.id} className="inline-grid size-8 cursor-pointer place-items-center rounded-control border border-transparent bg-transparent text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-[active=true]:border-[#bfd3ff] data-[active=true]:bg-primary-soft data-[active=true]:text-primary-hover" type="button" aria-label={tool.ariaLabel} aria-pressed={activeEditorTool === tool.id} data-active={activeEditorTool === tool.id ? "true" : "false"} title={`${tool.label} (${tool.shortcut})`} onClick={() => onEditorToolChange(tool.id)}><Icon size={17} strokeWidth={1.9} /></button>;
      })}
    </div>
  );
}
