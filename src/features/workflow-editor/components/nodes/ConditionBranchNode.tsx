import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

export type ConditionBranchNode = Node<{ label: string }, "condition-branch">;

export function ConditionBranchNodeComponent({ data, selected, dragging }: NodeProps<ConditionBranchNode>) {
  return (
    <div
      className="condition-branch-node"
      data-selected={selected ? "true" : "false"}
      data-dragging={dragging ? "true" : "false"}
      role="group"
      aria-label={`${data.label} condition branch`}
    >
      <div className="condition-branch-node__handles" aria-label="Branch connection points">
        <Handle
          id="top"
          type="target"
          position={Position.Top}
          className="workflow-connection-handle"
          isConnectableStart={false}
          isConnectableEnd
          aria-label="Top branch connection point"
        />
        <Handle
          id="bottom"
          type="source"
          position={Position.Bottom}
          className="workflow-connection-handle"
          isConnectableStart
          isConnectableEnd={false}
          aria-label="Bottom branch connection point"
        />
      </div>
      <div className="condition-branch-node__shape">
        <span className="condition-branch-node__label">{data.label}</span>
      </div>
    </div>
  );
}
