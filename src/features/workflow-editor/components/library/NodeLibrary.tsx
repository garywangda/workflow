import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ACTION_PRESETS } from "../../config/action-presets";
import { DIAGRAM_ELEMENT_DEFINITIONS, DIAGRAM_ELEMENT_LIBRARY_ORDER } from "../../config/diagram-element-definitions";
import { WORKFLOW_NODE_DEFINITIONS, WORKFLOW_NODE_LIBRARY_ORDER } from "../../config/workflow-node-definitions";
import type { ActionPresetId } from "../../types/action-preset";
import type { DiagramElementType } from "../../types/diagram-element";
import type { PlacementItem } from "../../types/placement";
import type { WorkflowNodeType } from "../../types/workflow-node";

interface NodeLibraryProps {
  placementItem: PlacementItem | null;
  onPlacementItemChange: (item: PlacementItem) => void;
}

interface LibraryButtonProps {
  label: string;
  description: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}

function LibraryButton({ label, description, icon: Icon, active, onClick }: LibraryButtonProps) {
  return (
    <button className="flex min-h-[31px] w-full cursor-pointer items-center gap-[9px] rounded-control border border-transparent bg-transparent px-2 py-1.5 text-left text-xs text-[#344054] transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus-ring data-[active=true]:border-[#bfd3ff] data-[active=true]:bg-primary-soft data-[active=true]:text-primary-hover" type="button" data-active={active ? "true" : "false"} onClick={onClick} title={description}>
      <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export function NodeLibrary({ placementItem, onPlacementItemChange }: NodeLibraryProps) {
  // Library 只产生 PlacementItem，不直接创建 React Flow Node。
  // 真正的节点实例由 WorkflowCanvas 调用 factory 创建，保证创建逻辑集中。
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const matches = (label: string, keywords: readonly string[], category: string) =>
    !normalizedQuery || [label, category, ...keywords].some((value) => value.toLowerCase().includes(normalizedQuery));

  const favorites = useMemo(() => ["task", "approval", "condition", "action"] as const, []);
  const favoriteItems = favorites.filter((type) => matches(WORKFLOW_NODE_DEFINITIONS[type].label, WORKFLOW_NODE_DEFINITIONS[type].keywords, "workflow"));
  const workflowByCategory = (category: "event" | "human" | "logic" | "end") =>
    WORKFLOW_NODE_LIBRARY_ORDER.filter((type) => WORKFLOW_NODE_DEFINITIONS[type].category === category && matches(WORKFLOW_NODE_DEFINITIONS[type].label, WORKFLOW_NODE_DEFINITIONS[type].keywords, WORKFLOW_NODE_DEFINITIONS[type].category));
  const actionItems = (Object.keys(ACTION_PRESETS) as ActionPresetId[]).filter((presetId) => {
    const preset = ACTION_PRESETS[presetId];
    return matches(preset.label, preset.keywords, "automation");
  });
  const diagramItems = DIAGRAM_ELEMENT_LIBRARY_ORDER.filter((type) => matches(DIAGRAM_ELEMENT_DEFINITIONS[type].label, DIAGRAM_ELEMENT_DEFINITIONS[type].keywords, "diagram"));

  const active = (item: PlacementItem) => JSON.stringify(placementItem) === JSON.stringify(item);

  return (
    <aside className="w-[232px] shrink-0 overflow-y-auto overscroll-contain border-r border-border bg-panel px-3 pb-6 pt-4" aria-label="Node library">
      <div className="mx-1 mb-3 flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-[#172033]">Node Library</span>
        <span className="text-[10px] text-subtle-foreground">Click to place</span>
      </div>
      <label className="mb-4 flex h-[34px] items-center gap-[7px] rounded-[7px] border border-[#d9dfe7] bg-[#f8fafc] px-[9px] text-[#7a8695] transition-[border-color,box-shadow] duration-150 focus-within:border-[#8bb1ff] focus-within:shadow-[0_0_0_2px_rgba(37,99,235,.1)]">
        <Search size={15} aria-hidden="true" />
        <input className="min-w-0 w-full border-0 bg-transparent text-xs text-[#1f2937] outline-0 placeholder:text-[#9aa4b2]" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search nodes..." aria-label="Search nodes" />
      </label>

      {favoriteItems.length > 0 ? (
        <LibrarySection title="Favorites">
          {favoriteItems.map((type) => <WorkflowLibraryButton key={type} type={type} active={active({ kind: "workflow-node", type })} onSelect={() => onPlacementItemChange({ kind: "workflow-node", type })} />)}
        </LibrarySection>
      ) : null}

      <div className="mx-1 my-3.5 h-px bg-[#edf0f3]" />
      <span className="mx-1 mb-2 mt-3 block text-[10px] font-bold uppercase tracking-[.1em] text-subtle-foreground">Workflow</span>
      <LibrarySection title="Start & Events">
        {workflowByCategory("event").map((type) => <WorkflowLibraryButton key={type} type={type} active={active({ kind: "workflow-node", type })} onSelect={() => onPlacementItemChange({ kind: "workflow-node", type })} />)}
      </LibrarySection>
      <LibrarySection title="People">
        {workflowByCategory("human").map((type) => <WorkflowLibraryButton key={type} type={type} active={active({ kind: "workflow-node", type })} onSelect={() => onPlacementItemChange({ kind: "workflow-node", type })} />)}
      </LibrarySection>
      <LibrarySection title="Logic">
        {workflowByCategory("logic").map((type) => <WorkflowLibraryButton key={type} type={type} active={active({ kind: "workflow-node", type })} onSelect={() => onPlacementItemChange({ kind: "workflow-node", type })} />)}
      </LibrarySection>
      <LibrarySection title="Automation">
        {actionItems.map((presetId) => {
          const preset = ACTION_PRESETS[presetId];
          return <LibraryButton key={presetId} label={preset.label} description={preset.description} icon={preset.icon} active={active({ kind: "action-preset", presetId })} onClick={() => onPlacementItemChange({ kind: "action-preset", presetId })} />;
        })}
      </LibrarySection>
      <LibrarySection title="Structure">
        {workflowByCategory("end").map((type) => <WorkflowLibraryButton key={type} type={type} active={active({ kind: "workflow-node", type })} onSelect={() => onPlacementItemChange({ kind: "workflow-node", type })} />)}
      </LibrarySection>

      <div className="mx-1 my-3.5 h-px bg-[#edf0f3]" />
      <span className="mx-1 mb-2 mt-3 block text-[10px] font-bold uppercase tracking-[.1em] text-subtle-foreground">Diagram</span>
      <LibrarySection title="Shapes">
        {diagramItems.filter((type) => ["rectangle", "circle", "diamond"].includes(type)).map((type) => <DiagramLibraryButton key={type} type={type} active={active({ kind: "diagram", type })} onSelect={() => onPlacementItemChange({ kind: "diagram", type })} />)}
      </LibrarySection>
      <LibrarySection title="Annotation">
        {diagramItems.filter((type) => ["text", "note"].includes(type)).map((type) => <DiagramLibraryButton key={type} type={type} active={active({ kind: "diagram", type })} onSelect={() => onPlacementItemChange({ kind: "diagram", type })} />)}
      </LibrarySection>
    </aside>
  );
}

function LibrarySection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mb-[13px]"><h2 className="mx-1 mb-[5px] text-[10px] font-semibold uppercase tracking-[.04em] text-subtle-foreground">{title}</h2><div className="grid gap-0.5">{children}</div></section>;
}

function WorkflowLibraryButton({ type, active, onSelect }: { type: WorkflowNodeType; active: boolean; onSelect: () => void }) {
  const definition = WORKFLOW_NODE_DEFINITIONS[type];
  return <LibraryButton label={definition.label} description={definition.description} icon={definition.icon} active={active} onClick={onSelect} />;
}

function DiagramLibraryButton({ type, active, onSelect }: { type: DiagramElementType; active: boolean; onSelect: () => void }) {
  const definition = DIAGRAM_ELEMENT_DEFINITIONS[type];
  return <LibraryButton label={definition.label} description={definition.description} icon={definition.icon} active={active} onClick={onSelect} />;
}
