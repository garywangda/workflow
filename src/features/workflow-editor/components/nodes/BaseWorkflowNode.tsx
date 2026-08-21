import type { LucideIcon } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import type { WorkflowNodeType } from "../../types/workflow-node";

// 四个连接方向使用固定 id，后续如果需要区分输入/输出端口，可以在此处扩展 Handle 配置。
const CONNECTION_HANDLES = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
] as const;

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
      {!preview ? (
        <div className="workflow-node__connection-handles" aria-label="Node connection points">
          {/* Handle 负责连接命中和吸附；圆点、加号和动画由 workflow-canvas.css 绘制。 */}
          {CONNECTION_HANDLES.map((handle) => (
            <Handle
              key={handle.id}
              id={handle.id}
              type="source"
              position={handle.position}
              className="workflow-connection-handle"
              isConnectableStart
              isConnectableEnd
              aria-label={`${handle.id} connection point`}
            />
          ))}
        </div>
      ) : null}
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
