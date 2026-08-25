import type { Node } from "@xyflow/react";

export type DiagramElementType = "rectangle" | "circle" | "diamond" | "text" | "note";
export type DiagramNodeType = `diagram:${DiagramElementType}`;

export interface DiagramNodeData {
  [key: string]: unknown;
  name: string;
  elementType: DiagramElementType;
}

export type DiagramNode = Node<DiagramNodeData, DiagramNodeType>;
