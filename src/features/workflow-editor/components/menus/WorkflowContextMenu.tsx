interface WorkflowContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
}

/** 节点右键菜单；删除动作只发出待确认请求，不在这里直接修改画布数据。 */
export function WorkflowContextMenu({ x, y, onDelete }: WorkflowContextMenuProps) {
  return (
    <div
      className="workflow-context-menu"
      role="menu"
      aria-label="Node actions"
      style={{ left: x, top: y }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <button className="workflow-context-menu__item workflow-context-menu__item--danger" type="button" role="menuitem" onClick={onDelete}>
        Delete node
      </button>
    </div>
  );
}
