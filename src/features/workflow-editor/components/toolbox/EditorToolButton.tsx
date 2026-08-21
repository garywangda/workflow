import { useId } from "react";
import type { EditorToolDefinition } from "../../types/editor-tool";

interface EditorToolButtonProps {
  tool: EditorToolDefinition;
  active: boolean;
  onSelect: () => void;
}

export function EditorToolButton({ tool, active, onSelect }: EditorToolButtonProps) {
  const tooltipId = useId();
  const Icon = tool.icon;

  return (
    <div className="editor-toolbox__item">
      <button
        className="editor-toolbox__button"
        type="button"
        aria-label={tool.ariaLabel}
        aria-describedby={tooltipId}
        aria-pressed={active}
        disabled={tool.disabled}
        data-active={active ? "true" : "false"}
        onClick={onSelect}
      >
        <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
      </button>
      <span className="editor-toolbox__tooltip" id={tooltipId} role="tooltip">
        <span className="editor-toolbox__tooltip-label">{tool.label}</span>
        {tool.shortcut ? <kbd className="editor-toolbox__shortcut">{tool.shortcut}</kbd> : null}
      </span>
    </div>
  );
}
