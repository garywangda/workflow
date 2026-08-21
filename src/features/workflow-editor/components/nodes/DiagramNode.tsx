import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { DIAGRAM_ELEMENT_DEFINITIONS } from "../../config/diagram-element-definitions";
import type { DiagramNode as DiagramNodeModel } from "../../types/diagram-element";

// Diagram Node 的轻量渲染器；它与带业务能力的 Workflow Node 分开，避免语义混淆。
export const DiagramNodeComponent = memo(function DiagramNodeComponent({ data, selected }: NodeProps<DiagramNodeModel>) {
  const definition = DIAGRAM_ELEMENT_DEFINITIONS[data.elementType];
  const Icon = definition.icon;

  return (
    <div className={`diagram-node diagram-node--${data.elementType}`} data-selected={selected ? "true" : "false"}>
      <Icon size={18} aria-hidden="true" />
      <span>{data.name}</span>
    </div>
  );
});
