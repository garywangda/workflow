import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tailwind.css";
import "@xyflow/react/dist/style.css";
import "./styles/global.css";
import "./features/workflow-editor/styles/workflow-editor.css";
import "./features/workflow-editor/styles/workflow-canvas.css";
import { WorkflowApp } from './WorkflowApp';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WorkflowApp />
  </StrictMode>,
);
