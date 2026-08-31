import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

export type ConditionBranchNode = Node<{ label: string }, "condition-branch">;

const CONTINUATION_HANDLES = [
  { id: "left", position: Position.Left },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
] as const;

export function ConditionBranchNodeComponent({ data, selected, dragging }: NodeProps<ConditionBranchNode>) {
  return (
    <div
      className="condition-branch-node"
      data-selected={selected ? "true" : "false"}
      data-dragging={dragging ? "true" : "false"}
      role="group"
      aria-label={`${data.label} condition branch`}
    >
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="condition-branch-target-handle"
        isConnectableStart={false}
        isConnectableEnd
        aria-label="Condition branch input"
      />
      <div className="condition-branch-node__connection-handles" aria-label="Branch continuation points">
        {CONTINUATION_HANDLES.map((handle) => (
          <Handle
            key={handle.id}
            id={handle.id}
            type="source"
            position={handle.position}
            className="workflow-connection-handle"
            isConnectableStart
            isConnectableEnd={false}
            aria-label={`${handle.id} branch connection point`}
          />
        ))}
      </div>
      <div className="condition-branch-node__shape">
        <span className="condition-branch-node__label">{data.label}</span>
      </div>
    </div>
  );
}
