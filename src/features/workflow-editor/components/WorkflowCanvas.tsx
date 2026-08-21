import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  ConnectionLineType,
  Panel,
  ReactFlow,
  SelectionMode,
  ViewportPortal,
  addEdge,
  type OnConnect,
  type Edge,
  type XYPosition,
  MarkerType,
  useEdgesState,
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
import { WorkflowConnectionLine } from "./edges/WorkflowConnectionLine";
import { EditorTools } from "./tools/EditorTools";
import { WORKFLOW_NODE_ORIGIN, workflowNodeTypes } from "./nodes/node-types";
import { WorkflowNodePreview } from "./nodes/WorkflowNodePreview";

type EditorNode = WorkflowNode | DiagramNode;

const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 1 };

interface WorkflowCanvasProps {
  activeEditorTool: EditorTool;
  placementItem: PlacementItem | null;
  onEditorToolChange: (tool: EditorTool) => void;
  onPlacementItemChange: (item: PlacementItem | null) => void;
}

export function WorkflowCanvas({ activeEditorTool, placementItem, onEditorToolChange, onPlacementItemChange }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<EditorNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [placementPosition, setPlacementPosition] = useState<XYPosition | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [suppressConnectionHandles, setSuppressConnectionHandles] = useState(false);
  const { screenToFlowPosition } = useReactFlow<EditorNode, Edge>();
  const isHandTool = activeEditorTool === "hand";
  const isPlacementMode = placementItem !== null;
  const isSelectionDragEnabled = !isHandTool && !isPlacementMode;

  const handleConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) => addEdge(connection, currentEdges));
      setSuppressConnectionHandles(true);
    },
    [setEdges],
  );

  const handleConnectStart = useCallback(() => {
    setSuppressConnectionHandles(false);
    setIsConnecting(true);
  }, []);
  const handleConnectEnd = useCallback(() => setIsConnecting(false), []);

  const handleCanvasMouseMoveCapture = useCallback(() => {
    if (suppressConnectionHandles) setSuppressConnectionHandles(false);
  }, [suppressConnectionHandles]);

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
    <div
      className={`workflow-canvas workflow-canvas--tool-${activeEditorTool} ${isPlacementMode ? "workflow-canvas--placement" : ""} ${isConnecting ? "workflow-canvas--connecting" : ""} ${suppressConnectionHandles ? "workflow-canvas--suppress-connection-handles" : ""}`}
      aria-label="Workflow canvas"
      onMouseMoveCapture={handleCanvasMouseMoveCapture}
    >
      <ReactFlow<EditorNode, Edge>
        className="workflow-canvas__flow"
        nodes={nodes}
        edges={edges}
        nodeTypes={workflowNodeTypes}
        nodeOrigin={WORKFLOW_NODE_ORIGIN}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onConnectStart={handleConnectStart}
        onConnectEnd={handleConnectEnd}
        onPaneClick={handlePaneClick}
        onPaneMouseMove={handlePaneMouseMove}
        onPaneMouseLeave={() => setPlacementPosition(null)}
        defaultViewport={DEFAULT_VIEWPORT}
        minZoom={0.1}
        maxZoom={4}
        nodesConnectable
        connectionMode={ConnectionMode.Loose}
        connectionRadius={28}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineComponent={WorkflowConnectionLine}
        connectionLineStyle={{ stroke: "#2563eb", strokeWidth: 2 }}
        defaultEdgeOptions={{
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, color: "#526273" },
          style: { stroke: "#526273", strokeWidth: 1.6 },
        }}
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
