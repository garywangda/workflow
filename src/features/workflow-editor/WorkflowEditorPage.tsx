import { ReactFlowProvider } from "@xyflow/react";
import { EditorHeader } from "./components/EditorHeader";
import { WorkflowEditorWorkspace } from "./components/WorkflowEditorWorkspace";
import "./styles/workflow-editor.css";
import "./styles/workflow-canvas.css";
import "./styles/node-library.css";
import "./styles/inspector.css";

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
