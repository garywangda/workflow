import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  SelectionMode,
  ViewportPortal,
  type Edge,
  type XYPosition,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import { createDiagramElement } from "../factories/create-diagram-element";
import { createWorkflowNode } from "../factories/create-workflow-node";
import type { EditorTool } from "../types/editor-tool";
import type { DiagramNode } from "../types/diagram-element";
import type { PlacementItem } from "../types/placement";
import type { WorkflowNode } from "../types/workflow-node";
import { CanvasControls } from "./CanvasControls";
import { EditorTools } from "./tools/EditorTools";
import { WORKFLOW_NODE_ORIGIN, workflowNodeTypes } from "./nodes/node-types";
import { WorkflowNodePreview } from "./nodes/WorkflowNodePreview";

type EditorNode = WorkflowNode | DiagramNode;

const EMPTY_EDGES: Edge[] = [];
const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 1 };

interface WorkflowCanvasProps {
  activeEditorTool: EditorTool;
  placementItem: PlacementItem | null;
  onEditorToolChange: (tool: EditorTool) => void;
  onPlacementItemChange: (item: PlacementItem | null) => void;
}

export function WorkflowCanvas({ activeEditorTool, placementItem, onEditorToolChange, onPlacementItemChange }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<EditorNode>([]);
  const [placementPosition, setPlacementPosition] = useState<XYPosition | null>(null);
  const { screenToFlowPosition } = useReactFlow<EditorNode, Edge>();
  const isHandTool = activeEditorTool === "hand";
  const isPlacementMode = placementItem !== null;
  const isSelectionDragEnabled = !isHandTool && !isPlacementMode;

  useEffect(() => {
    if (!isPlacementMode) setPlacementPosition(null);
  }, [isPlacementMode]);

  const positionFromEvent = useCallback((event: React.MouseEvent) => screenToFlowPosition({ x: event.clientX, y: event.clientY }), [screenToFlowPosition]);

  const handlePaneMouseMove = useCallback((event: React.MouseEvent) => {
    if (placementItem) setPlacementPosition(positionFromEvent(event));
  }, [placementItem, positionFromEvent]);

  const handlePaneClick = useCallback((event: React.MouseEvent) => {
    if (!placementItem) return;
    const position = positionFromEvent(event);
    let newNode: EditorNode;
    if (placementItem.kind === "workflow-node") {
      newNode = createWorkflowNode({ type: placementItem.type, position });
    } else if (placementItem.kind === "action-preset") {
      newNode = createWorkflowNode({ type: "action", presetId: placementItem.presetId, position });
    } else {
      newNode = createDiagramElement({ type: placementItem.type, position });
    }
    setNodes((currentNodes) => [...currentNodes.map((node) => ({ ...node, selected: false })), newNode]);
    setPlacementPosition(null);
    onPlacementItemChange(null);
    onEditorToolChange("select");
  }, [onEditorToolChange, onPlacementItemChange, placementItem, positionFromEvent, setNodes]);

  const preview = placementItem?.kind === "workflow-node" ? placementItem.type : null;

  return (
    <div className={`workflow-canvas workflow-canvas--tool-${activeEditorTool} ${isPlacementMode ? "workflow-canvas--placement" : ""}`} aria-label="Workflow canvas">
      <ReactFlow<EditorNode, Edge>
        className="workflow-canvas__flow"
        nodes={nodes}
        edges={EMPTY_EDGES}
        nodeTypes={workflowNodeTypes}
        nodeOrigin={WORKFLOW_NODE_ORIGIN}
        onNodesChange={onNodesChange}
        onPaneClick={handlePaneClick}
        onPaneMouseMove={handlePaneMouseMove}
        onPaneMouseLeave={() => setPlacementPosition(null)}
        defaultViewport={DEFAULT_VIEWPORT}
        minZoom={0.1}
        maxZoom={4}
        nodesConnectable={false}
        panOnScroll
        selectionOnDrag={isSelectionDragEnabled}
        panOnDrag={isHandTool}
        selectionMode={SelectionMode.Partial}
        zoomOnDoubleClick={false}
        preventScrolling
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Panel position="top-left" className="editor-tools-panel"><EditorTools activeEditorTool={activeEditorTool} onEditorToolChange={onEditorToolChange} /></Panel>
        {preview && placementPosition ? <ViewportPortal><WorkflowNodePreview type={preview} position={placementPosition} /></ViewportPortal> : null}
        <CanvasControls />
      </ReactFlow>
    </div>
  );
}
