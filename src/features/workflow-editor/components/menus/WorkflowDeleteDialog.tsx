import { useEffect } from "react";

interface WorkflowDeleteDialogProps {
  nodeCount: number;
  edgeCount: number;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

/** 删除确认窗口；Escape 只取消，不把 Enter 注册为删除快捷键。 */
export function WorkflowDeleteDialog({ nodeCount, edgeCount, onCancel, onConfirm }: WorkflowDeleteDialogProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const targetLabel = nodeCount === 1 ? "this node" : `${nodeCount} selected nodes`;
  const connectedEdgeLabel = edgeCount > 0 || nodeCount > 0 ? " Any connected edges will also be removed." : "";

  return (
    <div className="workflow-delete-dialog" role="presentation">
      <div className="workflow-delete-dialog__backdrop" aria-hidden="true" />
      <section className="workflow-delete-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="workflow-delete-dialog-title">
        <h2 id="workflow-delete-dialog-title">Delete {targetLabel}?</h2>
        <p>This action cannot be undone.{connectedEdgeLabel}</p>
        <div className="workflow-delete-dialog__actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button className="workflow-delete-dialog__confirm" type="button" onClick={onConfirm}>Delete</button>
        </div>
      </section>
    </div>
  );
}
