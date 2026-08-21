import type { XYPosition } from "@xyflow/react";
import { DIAGRAM_ELEMENT_DEFINITIONS } from "../config/diagram-element-definitions";
import type { DiagramElementType, DiagramNode } from "../types/diagram-element";

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
