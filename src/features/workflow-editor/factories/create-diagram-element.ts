import type { XYPosition } from "@xyflow/react";
import { DIAGRAM_ELEMENT_DEFINITIONS } from "../config/diagram-element-definitions";
import type { DiagramElementType, DiagramNode } from "../types/diagram-element";

// 将图形元素定义转换成 React Flow DiagramNode，保持图形创建逻辑与组件解耦。
export function createDiagramElement({ type, position }: { type: DiagramElementType; position: XYPosition }): DiagramNode {
  const definition = DIAGRAM_ELEMENT_DEFINITIONS[type];

  return {
    id: `diagram-${globalThis.crypto.randomUUID()}`,
    type: `diagram:${type}`,
    position,
    data: { name: definition.label, elementType: type },
    selected: true,
    ariaLabel: `${definition.label} diagram element`,
  };
}
