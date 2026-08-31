import { ChevronLeft, Search } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NODE_LIBRARY_PRESETS } from "@/features/workflow-editor/config/node-library-presets";
import { WORKFLOW_NODE_TOOLBAR_DEFINITIONS } from "@/features/workflow-editor/config/node-toolbar-definitions";
import type { WorkflowNodeToolbarType } from "@/features/workflow-editor/types/node-toolbar";
import { cn } from "@/lib/utils";

export function NodeLibrary() {
  const [selectedType, setSelectedType] = useState<WorkflowNodeToolbarType | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedTitleRef = useRef<HTMLHeadingElement>(null);
  const toolbarButtonRefs = useRef<Partial<Record<WorkflowNodeToolbarType, HTMLButtonElement | null>>>({});
  const restoreFocusTypeRef = useRef<WorkflowNodeToolbarType | null>(null);

  const selectedDefinition = WORKFLOW_NODE_TOOLBAR_DEFINITIONS.find(
    (definition) => definition.type === selectedType,
  );
  const selectedPresets = selectedType ? NODE_LIBRARY_PRESETS[selectedType] : [];
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredPresets = selectedPresets.filter((preset) =>
    preset.label.toLocaleLowerCase().includes(normalizedSearchQuery),
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
    setSearchQuery("");
    setSelectedPresetId(NODE_LIBRARY_PRESETS[type][0]?.id ?? null);
    setSelectedType(type);
  }

  function returnToFirstLevel() {
    restoreFocusTypeRef.current = selectedType;
    setSearchQuery("");
    setSelectedPresetId(null);
    setSelectedType(null);
  }

  return (
    <aside
      aria-label="Node toolbar"
      className="flex min-h-0 w-[208px] shrink-0 flex-col overflow-y-auto border-r border-border bg-panel px-2.5 pb-4 pt-3"
    >
      {selectedDefinition ? (
        <section aria-labelledby="node-toolbar-title" className="min-w-0">
          <div className="mb-2 flex min-w-0 items-center">
            <Button
              aria-label="Back"
              className="-ml-1.5 size-9 shrink-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
              onClick={returnToFirstLevel}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </Button>
            <h2
              className="node-library__secondary-title min-w-0 truncate font-bold uppercase tracking-wide text-foreground outline-none"
              id="node-toolbar-title"
              ref={selectedTitleRef}
              tabIndex={-1}
            >
              {selectedDefinition.label}
            </h2>
          </div>

          <div className="relative mb-2">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search nodes"
              className="node-library__search-input h-8 pl-9 shadow-none"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search..."
              type="search"
              value={searchQuery}
            />
          </div>

          <ul aria-label={`${selectedDefinition.label} presets`} className="grid gap-0">
            {filteredPresets.map((preset) => {
              const isSelected = preset.id === selectedPresetId;

              return (
                <li key={preset.id}>
                  <button
                    aria-pressed={isSelected}
                    className={cn(
                      "node-library__preset-button relative flex min-h-9 w-full cursor-pointer items-center rounded-md px-6 text-left font-medium text-secondary-foreground outline-none transition-colors duration-200 hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/45 motion-reduce:transition-none",
                      isSelected && "bg-primary/10 font-semibold text-primary hover:bg-primary/10",
                    )}
                    onClick={() => setSelectedPresetId(preset.id)}
                    type="button"
                  >
                    {isSelected ? (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1.5 left-2.5 top-1.5 w-0.5 rounded-full bg-primary"
                      />
                    ) : null}
                    <span className="truncate">{preset.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {filteredPresets.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              No nodes found
            </p>
          ) : null}
        </section>
      ) : (
        <>
          <header className="mx-1 mb-2 min-w-0">
            <h2 className="node-library__primary-title min-w-0 truncate font-bold text-foreground">Node Toolbar</h2>
          </header>

          <nav aria-label="Workflow node types" className="grid gap-0.5">
            {WORKFLOW_NODE_TOOLBAR_DEFINITIONS.map((definition) => {
              const Icon = definition.icon;

              return (
                <Button
                  className="node-library__toolbar-button group h-10 w-full justify-start gap-2.5 px-1 py-1.5 text-left font-semibold text-secondary-foreground hover:bg-muted hover:text-foreground focus-visible:ring-focus-ring/45 motion-reduce:transition-none"
                  key={definition.type}
                  onClick={() => openType(definition.type)}
                  ref={(element) => {
                    toolbarButtonRefs.current[definition.type] = element;
                  }}
                  type="button"
                  variant="ghost"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary motion-reduce:transition-none"
                  />
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
