import type { Node } from "@xyflow/react";

// 纯图形元素类型，与 WorkflowNode 分离；React Flow type 使用 diagram: 前缀避免冲突。
export type DiagramElementType = "rectangle" | "circle" | "diamond" | "text" | "note";
export type DiagramNodeType = `diagram:${DiagramElementType}`;

export interface DiagramNodeData {
  [key: string]: unknown;
  name: string;
  elementType: DiagramElementType;
}

export type DiagramNode = Node<DiagramNodeData, DiagramNodeType>;
