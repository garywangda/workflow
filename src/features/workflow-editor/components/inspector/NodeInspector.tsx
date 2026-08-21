import { useMemo } from "react";
import { useNodes } from "@xyflow/react";
import { DIAGRAM_ELEMENT_DEFINITIONS } from "../../config/diagram-element-definitions";
import { INSPECTOR_BLOCK_DEFINITIONS } from "../../config/inspector-block-definitions";
import { WORKFLOW_NODE_DEFINITIONS } from "../../config/workflow-node-definitions";
import type { DiagramNode } from "../../types/diagram-element";
import type { WorkflowNode } from "../../types/workflow-node";

type EditorSelection = WorkflowNode | DiagramNode;

export function NodeInspector() {
  const nodes = useNodes<EditorSelection>();
  const selectedNode = useMemo(() => nodes.find((node) => node.selected), [nodes]);

  if (!selectedNode) return null;
  if (selectedNode.type.startsWith("diagram:")) return <DiagramInspector node={selectedNode as DiagramNode} />;

  const node = selectedNode as WorkflowNode;
  const definition = WORKFLOW_NODE_DEFINITIONS[node.type];
  const blocks = [...node.data.capabilities].sort((a, b) => INSPECTOR_BLOCK_DEFINITIONS[a].order - INSPECTOR_BLOCK_DEFINITIONS[b].order);

  return (
    <aside className="node-inspector" aria-label="Workflow inspector">
      <InspectorHeader eyebrow={definition.label.toUpperCase()} title={node.data.name} />
      <div className="node-inspector__blocks">
        {blocks.map((capability) => {
          const block = INSPECTOR_BLOCK_DEFINITIONS[capability];
          const Block = block.render;
          return <section className="inspector__block" key={capability}><h2>{block.label}</h2><Block node={node} capability={capability} /></section>;
        })}
      </div>
    </aside>
  );
}

function DiagramInspector({ node }: { node: DiagramNode }) {
  const definition = DIAGRAM_ELEMENT_DEFINITIONS[node.data.elementType];
  return <aside className="node-inspector" aria-label="Diagram inspector"><InspectorHeader eyebrow="DIAGRAM" title={definition.label} /><div className="diagram-inspector__empty">Diagram properties placeholder.<small>Appearance, text, and size will be configured here.</small></div></aside>;
}

function InspectorHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <header className="node-inspector__header"><span>{eyebrow}</span><h1>{title}</h1></header>;
}
