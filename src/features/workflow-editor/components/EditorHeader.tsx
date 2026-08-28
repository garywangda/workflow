import { ChevronLeft } from "lucide-react";

// 顶部栏只承载编辑器标题和全局操作入口，不拥有画布编辑状态。
export function EditorHeader() {
  return (
    <header className="relative z-20 grid h-[52px] shrink-0 grid-cols-[52px_minmax(0,1fr)_52px] items-center border-b border-border bg-panel">
      <button
        className="inline-grid size-9 cursor-pointer place-items-center justify-self-center rounded-control border border-transparent bg-transparent text-muted-foreground transition-colors duration-150 hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        type="button"
        aria-label="Back"
        title="Back"
      >
        <ChevronLeft size={19} strokeWidth={2} aria-hidden="true" />
      </button>
      <div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-foreground" aria-label="Workflow title">
        Untitled workflow
      </div>
      <div className="size-[52px]" aria-hidden="true" />
    </header>
  );
}
