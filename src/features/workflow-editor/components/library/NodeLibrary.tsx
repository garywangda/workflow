import { ArrowLeft } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { WORKFLOW_NODE_TOOLBAR_DEFINITIONS } from "@/features/workflow-editor/config/node-toolbar-definitions";
import type { WorkflowNodeToolbarType } from "@/features/workflow-editor/types/node-toolbar";

export function NodeLibrary() {
  const [selectedType, setSelectedType] = useState<WorkflowNodeToolbarType | null>(null);
  const selectedTitleRef = useRef<HTMLHeadingElement>(null);
  const toolbarButtonRefs = useRef<Partial<Record<WorkflowNodeToolbarType, HTMLButtonElement | null>>>({});
  const restoreFocusTypeRef = useRef<WorkflowNodeToolbarType | null>(null);

  const selectedDefinition = WORKFLOW_NODE_TOOLBAR_DEFINITIONS.find(
    (definition) => definition.type === selectedType,
  );

  useLayoutEffect(() => {
    if (selectedType) {
      selectedTitleRef.current?.focus();
      return;
    }

    const restoreFocusType = restoreFocusTypeRef.current;
    if (restoreFocusType) {
      toolbarButtonRefs.current[restoreFocusType]?.focus();
      restoreFocusTypeRef.current = null;
    }
  }, [selectedType]);

  function openType(type: WorkflowNodeToolbarType) {
    setSelectedType(type);
  }

  function returnToFirstLevel() {
    restoreFocusTypeRef.current = selectedType;
    setSelectedType(null);
  }

  return (
    <aside
      aria-label="Node toolbar"
      className="flex min-h-0 w-[232px] shrink-0 flex-col overflow-y-auto border-r border-border bg-panel px-3 pb-6 pt-4"
    >
      {selectedDefinition ? (
        <section aria-labelledby="node-toolbar-placeholder-title" className="min-w-0">
          <Button
            className="-ml-1 mb-3 h-11 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={returnToFirstLevel}
            type="button"
            variant="ghost"
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>

          <div className="mb-4 flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-muted/60 text-primary">
              <selectedDefinition.icon aria-hidden="true" className="size-[18px]" />
            </span>
            <h2
              className="min-w-0 truncate text-sm font-bold text-foreground outline-none"
              id="node-toolbar-placeholder-title"
              ref={selectedTitleRef}
              tabIndex={-1}
            >
              {selectedDefinition.label}
            </h2>
          </div>

          <div className="rounded-lg border border-dashed border-border-strong bg-muted/35 px-3 py-4">
            <p className="text-xs font-semibold text-foreground">Node options coming next</p>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
              {selectedDefinition.description}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Options for this node type will appear here.
            </p>
          </div>
        </section>
      ) : (
        <>
          <header className="mx-1 mb-3 flex min-w-0 items-baseline justify-between gap-2">
            <h2 className="min-w-0 truncate text-sm font-bold text-foreground">Node Toolbar</h2>
            <span className="shrink-0 text-[10px] font-medium text-muted-foreground">Choose a type</span>
          </header>

          <nav aria-label="Workflow node types" className="grid gap-1">
            {WORKFLOW_NODE_TOOLBAR_DEFINITIONS.map((definition) => {
              const Icon = definition.icon;

              return (
                <Button
                  className="group h-11 w-full justify-start gap-2.5 px-2 py-2 text-left text-xs font-semibold text-secondary-foreground hover:bg-muted hover:text-foreground focus-visible:ring-focus-ring/45 motion-reduce:transition-none"
                  key={definition.type}
                  onClick={() => openType(definition.type)}
                  ref={(element) => {
                    toolbarButtonRefs.current[definition.type] = element;
                  }}
                  type="button"
                  variant="ghost"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-md border border-border bg-muted/60 text-muted-foreground transition-colors group-hover:border-border-strong group-hover:bg-panel group-hover:text-primary motion-reduce:transition-none">
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>
                  <span className="min-w-0 truncate">{definition.label}</span>
                </Button>
              );
            })}
          </nav>
        </>
      )}
    </aside>
  );
}
