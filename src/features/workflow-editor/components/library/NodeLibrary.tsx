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
    <button className="node-library__item" type="button" data-active={active ? "true" : "false"} onClick={onClick} title={description}>
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
    <aside className="node-library" aria-label="Node library">
      <div className="node-library__header">
        <span className="node-library__title">Node Library</span>
        <span className="node-library__hint">Click to place</span>
      </div>
      <label className="node-library__search">
        <Search size={15} aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search nodes..." aria-label="Search nodes" />
      </label>

      {favoriteItems.length > 0 ? (
        <LibrarySection title="Favorites">
          {favoriteItems.map((type) => <WorkflowLibraryButton key={type} type={type} active={active({ kind: "workflow-node", type })} onSelect={() => onPlacementItemChange({ kind: "workflow-node", type })} />)}
        </LibrarySection>
      ) : null}

      <div className="node-library__divider" />
      <span className="node-library__group-label">Workflow</span>
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

      <div className="node-library__divider" />
      <span className="node-library__group-label">Diagram</span>
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
  return <section className="node-library__section"><h2>{title}</h2><div className="node-library__items">{children}</div></section>;
}

function WorkflowLibraryButton({ type, active, onSelect }: { type: WorkflowNodeType; active: boolean; onSelect: () => void }) {
  const definition = WORKFLOW_NODE_DEFINITIONS[type];
  return <LibraryButton label={definition.label} description={definition.description} icon={definition.icon} active={active} onClick={onSelect} />;
}

function DiagramLibraryButton({ type, active, onSelect }: { type: DiagramElementType; active: boolean; onSelect: () => void }) {
  const definition = DIAGRAM_ELEMENT_DEFINITIONS[type];
  return <LibraryButton label={definition.label} description={definition.description} icon={definition.icon} active={active} onClick={onSelect} />;
}
