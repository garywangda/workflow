import { useMemo } from "react";
import { useNodes } from "@xyflow/react";
import { DIAGRAM_ELEMENT_DEFINITIONS } from "../../config/diagram-element-definitions";
import { INSPECTOR_BLOCK_DEFINITIONS } from "../../config/inspector-block-definitions";
import { WORKFLOW_NODE_DEFINITIONS } from "../../config/workflow-node-definitions";
import type { DiagramNode } from "../../types/diagram-element";
import type { WorkflowNode } from "../../types/workflow-node";

type EditorSelection = WorkflowNode | DiagramNode;

// Inspector 当前是能力驱动的展示壳；真实选中节点状态接入后可在此处连接配置表单。
export function NodeInspector() {
  const nodes = useNodes<EditorSelection>();
  const selectedNode = useMemo(() => nodes.find((node) => node.selected), [nodes]);

  if (!selectedNode) return null;
  if (selectedNode.type.startsWith("diagram:")) return <DiagramInspector node={selectedNode as DiagramNode} />;

  const node = selectedNode as WorkflowNode;
  const definition = WORKFLOW_NODE_DEFINITIONS[node.type];
  const blocks = [...node.data.capabilities].sort((a, b) => INSPECTOR_BLOCK_DEFINITIONS[a].order - INSPECTOR_BLOCK_DEFINITIONS[b].order);

  return (
    <aside className="w-[286px] shrink-0 overflow-y-auto overscroll-contain border-l border-border bg-panel" aria-label="Workflow inspector">
      <InspectorHeader eyebrow={definition.label.toUpperCase()} title={node.data.name} />
      <div className="px-[18px] pb-6 pt-2">
        {blocks.map((capability) => {
          const block = INSPECTOR_BLOCK_DEFINITIONS[capability];
          const Block = block.render;
          return <section className="border-b border-[#edf0f3] py-3.5" key={capability}><h2 className="mb-2 text-xs font-bold text-[#344054]">{block.label}</h2><Block node={node} capability={capability} /></section>;
        })}
      </div>
    </aside>
  );
}

function DiagramInspector({ node }: { node: DiagramNode }) {
  const definition = DIAGRAM_ELEMENT_DEFINITIONS[node.data.elementType];
  return <aside className="w-[286px] shrink-0 overflow-y-auto overscroll-contain border-l border-border bg-panel" aria-label="Diagram inspector"><InspectorHeader eyebrow="DIAGRAM" title={definition.label} /><div className="grid gap-2 p-[18px] text-xs leading-6 text-muted-foreground">Diagram properties placeholder.<small className="text-[11px] text-[#98a2b3]">Appearance, text, and size will be configured here.</small></div></aside>;
}

function InspectorHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <header className="border-b border-[#edf0f3] px-[18px] pb-4 pt-5"><span className="text-[10px] font-bold tracking-[.1em] text-subtle-foreground">{eyebrow}</span><h1 className="mt-1.5 text-lg font-bold text-[#172033]">{title}</h1></header>;
}
