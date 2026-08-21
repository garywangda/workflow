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
import { CanvasControls } from "./CanvasControls";
import { WORKFLOW_NODE_ORIGIN, workflowNodeTypes } from "./nodes/node-types";
import { WorkflowNodePreview } from "./nodes/WorkflowNodePreview";
import { EditorToolBox } from "./toolbox/EditorToolBox";
import { isWorkflowNodeTool } from "../config/workflow-node-definitions";
import { createWorkflowNode } from "../factories/create-workflow-node";
import type { EditorToolId } from "../types/editor-tool";
import type { WorkflowNode } from "../types/workflow-node";

const EMPTY_EDGES: Edge[] = [];
const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 1 };

interface WorkflowCanvasProps {
  activeTool: EditorToolId;
  onToolChange: (tool: EditorToolId) => void;
}

export function WorkflowCanvas({ activeTool, onToolChange }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [placementPosition, setPlacementPosition] = useState<XYPosition | null>(null);
  const { screenToFlowPosition } = useReactFlow<WorkflowNode, Edge>();
  const isHandTool = activeTool === "hand";
  const isPlacementMode = isWorkflowNodeTool(activeTool);
  const isSelectionDragEnabled = !isHandTool && !isPlacementMode;

  useEffect(() => {
    if (!isPlacementMode) {
      setPlacementPosition(null);
    }
  }, [isPlacementMode]);

  const handlePaneMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isWorkflowNodeTool(activeTool)) {
        return;
      }

      setPlacementPosition(
        screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        }),
      );
    },
    [activeTool, screenToFlowPosition],
  );

  const handlePaneMouseLeave = useCallback(() => {
    setPlacementPosition(null);
  }, []);

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (!isWorkflowNodeTool(activeTool)) {
        return;
      }

      const newNode = createWorkflowNode({
        type: activeTool,
        position: screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        }),
      });

      setNodes((currentNodes) => [
        ...currentNodes.map((node) => ({
          ...node,
          selected: false,
        })),
        newNode,
      ]);
      setPlacementPosition(null);
      onToolChange("select");
    },
    [activeTool, onToolChange, screenToFlowPosition, setNodes],
  );

  return (
    <div className={`workflow-canvas workflow-canvas--tool-${activeTool}`} aria-label="Workflow canvas">
      <ReactFlow<WorkflowNode, Edge>
        className="workflow-canvas__flow"
        nodes={nodes}
        edges={EMPTY_EDGES}
        nodeTypes={workflowNodeTypes}
        nodeOrigin={WORKFLOW_NODE_ORIGIN}
        onNodesChange={onNodesChange}
        onPaneClick={handlePaneClick}
        onPaneMouseMove={handlePaneMouseMove}
        onPaneMouseLeave={handlePaneMouseLeave}
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
        <Panel position="top-left" className="toolbox-panel">
          <EditorToolBox activeTool={activeTool} onToolChange={onToolChange} />
        </Panel>
        {isPlacementMode && placementPosition ? (
          <ViewportPortal>
            <WorkflowNodePreview type={activeTool} position={placementPosition} />
          </ViewportPortal>
        ) : null}
        <CanvasControls />
      </ReactFlow>
    </div>
  );
}
