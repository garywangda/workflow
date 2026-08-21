import { ReactFlowProvider } from "@xyflow/react";
import { EditorHeader } from "./components/EditorHeader";
import { WorkflowEditorWorkspace } from "./components/WorkflowEditorWorkspace";
import "./styles/workflow-editor.css";
import "./styles/workflow-canvas.css";
import "./styles/node-library.css";
import "./styles/inspector.css";

// 页面入口：提供 React Flow 上下文，并加载编辑器的四组样式。
export function WorkflowEditorPage() {
  return (
    <main className="workflow-editor" aria-label="Workflow editor">
      <EditorHeader />
      <ReactFlowProvider>
        <WorkflowEditorWorkspace />
      </ReactFlowProvider>
    </main>
  );
}
