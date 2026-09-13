import { ReactFlowProvider } from "@xyflow/react";
import { EditorHeader } from "./components/EditorHeader";
import { WorkflowEditorWorkspace } from "./components/WorkflowEditorWorkspace";

// 页面入口只组装编辑器；样式顺序由 main.tsx 统一管理。
export function WorkflowEditorPage({ title, onBack }: { title?: string; onBack?: () => void } = {}) {
  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-app-background text-foreground" aria-label="Workflow editor">
      <EditorHeader title={title} onBack={onBack} />
      <ReactFlowProvider>
        <WorkflowEditorWorkspace />
      </ReactFlowProvider>
    </main>
  );
}
