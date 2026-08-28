import { Circle, Diamond, RectangleHorizontal, StickyNote, Type, type LucideIcon } from "lucide-react";
import type { DiagramElementType } from "../types/diagram-element";

export interface DiagramElementDefinition {
  type: DiagramElementType;
  label: string;
  description: string;
  icon: LucideIcon;
  keywords: readonly string[];
}

export const DIAGRAM_ELEMENT_DEFINITIONS = {
  rectangle: { type: "rectangle", label: "Rectangle", description: "A visual diagram shape.", icon: RectangleHorizontal, keywords: ["shape", "box"] },
  circle: { type: "circle", label: "Circle", description: "A visual diagram shape.", icon: Circle, keywords: ["shape", "round"] },
  diamond: { type: "diamond", label: "Diamond", description: "A visual diagram shape.", icon: Diamond, keywords: ["shape", "branch"] },
  text: { type: "text", label: "Text", description: "A visual text annotation.", icon: Type, keywords: ["annotation", "label"] },
  note: { type: "note", label: "Note", description: "A visual note annotation.", icon: StickyNote, keywords: ["annotation", "comment"] },
} satisfies Record<DiagramElementType, DiagramElementDefinition>;

export const DIAGRAM_ELEMENT_LIBRARY_ORDER: readonly DiagramElementType[] = ["rectangle", "circle", "diamond", "text", "note"];
