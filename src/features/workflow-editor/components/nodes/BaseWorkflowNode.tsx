import type { LucideIcon } from "lucide-react";
import type { WorkflowNodeType } from "../../types/workflow-node";

interface BaseWorkflowNodeProps {
  type: WorkflowNodeType;
  semanticLabel: string;
  name: string;
  status?: string;
  icon: LucideIcon;
  selected?: boolean;
  dragging?: boolean;
  preview?: boolean;
}

export function BaseWorkflowNode({
  type,
  semanticLabel,
  name,
  status = "Needs setup",
  icon: Icon,
  selected = false,
  dragging = false,
  preview = false,
}: BaseWorkflowNodeProps) {
  return (
    <div
      className="workflow-node"
      data-node-type={type}
      data-selected={selected ? "true" : "false"}
      data-dragging={dragging ? "true" : "false"}
      data-preview={preview ? "true" : "false"}
    >
      <span className="workflow-node__icon" aria-hidden="true">
        <Icon size={17} strokeWidth={1.9} />
      </span>
      <span className="workflow-node__content">
        <span className="workflow-node__semantic-label">{semanticLabel}</span>
        <span className="workflow-node__name">{name}</span>
        {!preview ? <span className="workflow-node__status">{status}</span> : null}
      </span>
    </div>
  );
}
