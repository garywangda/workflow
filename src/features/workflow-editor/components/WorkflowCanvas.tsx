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
import { WorkflowContextMenu } from "./menus/WorkflowContextMenu";
import { WorkflowDeleteDialog } from "./menus/WorkflowDeleteDialog";
import { EditorTools } from "./tools/EditorTools";
import { WORKFLOW_NODE_ORIGIN, workflowNodeTypes } from "./nodes/node-types";
import { WorkflowNodePreview } from "./nodes/WorkflowNodePreview";

type EditorNode = WorkflowNode | DiagramNode;

// 画布的默认视口。节点和 Edge 的坐标都在 React Flow 的 flow 坐标系中维护。
const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 1 };

interface WorkflowCanvasProps {
  activeEditorTool: EditorTool;
  placementItem: PlacementItem | null;
  onEditorToolChange: (tool: EditorTool) => void;
  onPlacementItemChange: (item: PlacementItem | null) => void;
}

interface DeleteRequest {
  nodeIds: string[];
  edgeIds: string[];
}

interface ContextMenuState {
  nodeId: string;
  x: number;
  y: number;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
}

export function WorkflowCanvas({ activeEditorTool, placementItem, onEditorToolChange, onPlacementItemChange }: WorkflowCanvasProps) {
  // 画布是节点、Edge 和临时交互状态的唯一状态持有者。
  // 节点/Edge 的增删改由 React Flow 的 change handlers 驱动，便于后续接入持久化。
  const [nodes, setNodes, onNodesChange] = useNodesState<EditorNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [placementPosition, setPlacementPosition] = useState<XYPosition | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [suppressConnectionHandles, setSuppressConnectionHandles] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [deleteRequest, setDeleteRequest] = useState<DeleteRequest | null>(null);
  const { deleteElements, screenToFlowPosition } = useReactFlow<EditorNode, Edge>();
  const isHandTool = activeEditorTool === "hand";
  const isPlacementMode = placementItem !== null;
  const isSelectionDragEnabled = !isHandTool && !isPlacementMode;

  const positionFromClientPoint = useCallback((clientX: number, clientY: number) => {
    const canvas = document.querySelector<HTMLElement>(".workflow-canvas");
    if (!canvas) return { x: clientX, y: clientY };
    const bounds = canvas.getBoundingClientRect();
    return { x: clientX - bounds.left, y: clientY - bounds.top };
  }, []);

  // React Flow 官方的连接入口：释放在有效 Handle 上时，把新的 Connection 转成 Edge。
  // addEdge 会保留现有 Edge，并补齐 source/target 等连接字段。
  const handleConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) => addEdge(connection, currentEdges));
      setSuppressConnectionHandles(true);
    },
    [setEdges],
  );

  // 开始拖动连接线时显示所有节点的连接点，方便用户寻找目标 Handle。
  const handleConnectStart = useCallback(() => {
    setSuppressConnectionHandles(false);
    setIsConnecting(true);
  }, []);

  // React Flow 无论连接成功还是取消，都会结束连接状态。
  const handleConnectEnd = useCallback(() => setIsConnecting(false), []);

  // 成功连接后先隐藏连接点，避免新建 Edge 的瞬间仍被 Handle 覆盖。
  // 下一次鼠标移动会解除隐藏，恢复正常的 hover 行为。
  const handleCanvasMouseMoveCapture = useCallback(() => {
    if (suppressConnectionHandles) setSuppressConnectionHandles(false);
  }, [suppressConnectionHandles]);

  useEffect(() => {
    if (!isPlacementMode) setPlacementPosition(null);
  }, [isPlacementMode]);

  // React Flow 的默认 Delete 行为关闭后，由这里统一进入确认流程。
  // 只监听 Delete，不把 Enter 作为删除快捷键。
  useEffect(() => {
    const handleDeleteKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.key !== "Delete" || isEditableTarget(event.target)) return;

      const nodeIds = nodes.filter((node) => node.selected).map((node) => node.id);
      const edgeIds = edges.filter((edge) => edge.selected).map((edge) => edge.id);
      if (nodeIds.length === 0 && edgeIds.length === 0) return;

      event.preventDefault();
      setContextMenu(null);
      setDeleteRequest({ nodeIds, edgeIds });
    };

    window.addEventListener("keydown", handleDeleteKeyDown);
    return () => window.removeEventListener("keydown", handleDeleteKeyDown);
  }, [edges, nodes]);

  const positionFromEvent = useCallback((event: React.MouseEvent) => screenToFlowPosition({ x: event.clientX, y: event.clientY }), [screenToFlowPosition]);

  const handlePaneMouseMove = useCallback((event: React.MouseEvent) => {
    if (placementItem) setPlacementPosition(positionFromEvent(event));
  }, [placementItem, positionFromEvent]);

  // 画布空白处右键只负责取消放置模式，不显示浏览器默认菜单。
  const handlePaneContextMenu = useCallback((event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault();
    setContextMenu(null);
    if (placementItem) onPlacementItemChange(null);
  }, [onPlacementItemChange, placementItem]);

  // 节点右键打开项目菜单；如果此时正在放置节点，先取消预览，防止误放置。
  const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: EditorNode) => {
    event.preventDefault();
    event.stopPropagation();
    if (placementItem) onPlacementItemChange(null);
    const position = positionFromClientPoint(event.clientX, event.clientY);
    setContextMenu({ nodeId: node.id, x: position.x, y: position.y });
  }, [onPlacementItemChange, placementItem, positionFromClientPoint]);

  const handleNodeDeleteRequest = useCallback(() => {
    if (!contextMenu) return;
    setContextMenu(null);
    setDeleteRequest({ nodeIds: [contextMenu.nodeId], edgeIds: [] });
  }, [contextMenu]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteRequest) return;
    await deleteElements({
      nodes: deleteRequest.nodeIds.map((id) => ({ id })),
      edges: deleteRequest.edgeIds.map((id) => ({ id })),
    });
    setDeleteRequest(null);
  }, [deleteElements, deleteRequest]);

  // 节点库采用“点击选择类型，再点击画布放置”的两阶段交互。
  const handlePaneClick = useCallback((event: React.MouseEvent) => {
    setContextMenu(null);
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

  // Loose 模式允许四个方向的 Handle 同时作为连接起点和终点。
  // connectionRadius 决定鼠标靠近 Handle 多远时触发目标吸附。
  // connectionLineComponent 和 defaultEdgeOptions 分别控制拖动预览线与完成后的 Edge。
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
        onPaneContextMenu={handlePaneContextMenu}
        onNodeClick={() => setContextMenu(null)}
        onNodeContextMenu={handleNodeContextMenu}
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
        // 删除由自定义确认流程处理，避免 React Flow 直接删除选中元素。
        deleteKeyCode={null}
        zoomOnDoubleClick={false}
        preventScrolling
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Panel position="top-left" className="editor-tools-panel"><EditorTools activeEditorTool={activeEditorTool} onEditorToolChange={onEditorToolChange} /></Panel>
        {preview && placementPosition ? <ViewportPortal><WorkflowNodePreview type={preview} position={placementPosition} /></ViewportPortal> : null}
        <CanvasControls />
      </ReactFlow>
      {contextMenu ? <WorkflowContextMenu x={contextMenu.x} y={contextMenu.y} onDelete={handleNodeDeleteRequest} /> : null}
      {deleteRequest ? (
        <WorkflowDeleteDialog
          nodeCount={deleteRequest.nodeIds.length}
          edgeCount={deleteRequest.edgeIds.length}
          onCancel={() => setDeleteRequest(null)}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </div>
  );
}
