import {
  getSmoothStepPath,
  type ConnectionLineComponentProps,
} from "@xyflow/react";

export function WorkflowConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  connectionStatus,
}: ConnectionLineComponentProps) {
  const [path] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g className={`workflow-connection-line workflow-connection-line--${connectionStatus ?? "pending"}`}>
      <defs>
        <marker
          id="workflow-connection-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
        </marker>
      </defs>
      <path className="workflow-connection-line__path" d={path} markerEnd="url(#workflow-connection-arrow)" />
    </g>
  );
}
