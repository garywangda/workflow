import {
  getSmoothStepPath,
  type ConnectionLineComponentProps,
} from "@xyflow/react";

/**
 * React Flow 在连接拖动期间调用的自定义预览线。
 * React Flow 提供坐标和连接状态；本组件只负责把它们绘制成带箭头的平滑折线。
 */
export function WorkflowConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  connectionStatus,
}: ConnectionLineComponentProps) {
  // 使用 React Flow 官方路径工具，保证预览线与最终 smoothstep Edge 的走向一致。
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
        {/* 预览线的 SVG 箭头；完成后的 Edge 使用 React Flow 的 MarkerType。 */}
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
