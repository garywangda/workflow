import { EDITOR_TOOLS, TOOL_GROUP_LABELS, TOOL_GROUP_ORDER } from "../../config/editor-tools";
import type { EditorToolGroup as EditorToolGroupId, EditorToolId } from "../../types/editor-tool";
import { EditorToolButton } from "./EditorToolButton";
import { EditorToolGroup } from "./EditorToolGroup";
import { EditorToolSeparator } from "./EditorToolSeparator";

interface EditorToolBoxProps {
  activeTool: EditorToolId;
  onToolChange: (tool: EditorToolId) => void;
}

const TOOLS_BY_GROUP = TOOL_GROUP_ORDER.reduce(
  (groups, group) => ({
    ...groups,
    [group]: EDITOR_TOOLS.filter((tool) => tool.group === group),
  }),
  {} as Record<EditorToolGroupId, typeof EDITOR_TOOLS>,
);

export function EditorToolBox({ activeTool, onToolChange }: EditorToolBoxProps) {
  return (
    <div className="editor-toolbox nodrag nopan nowheel" role="toolbar" aria-label="Workflow editor tools">
      {TOOL_GROUP_ORDER.map((group, index) => (
        <EditorToolGroup key={group} ariaLabel={TOOL_GROUP_LABELS[group]}>
          {TOOLS_BY_GROUP[group].map((tool) => (
            <EditorToolButton
              key={tool.id}
              tool={tool}
              active={tool.id === activeTool}
              onSelect={() => {
                onToolChange(tool.id);
              }}
            />
          ))}
          {index < TOOL_GROUP_ORDER.length - 1 ? <EditorToolSeparator /> : null}
        </EditorToolGroup>
      ))}
    </div>
  );
}
