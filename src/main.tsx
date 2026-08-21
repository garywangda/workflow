import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@xyflow/react/dist/style.css";
import "./styles/global.css";
import { WorkflowEditorPage } from "./features/workflow-editor/WorkflowEditorPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WorkflowEditorPage />
  </StrictMode>,
);
