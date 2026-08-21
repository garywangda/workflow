import type { XYPosition } from "@xyflow/react";
import { ACTION_PRESETS } from "../config/action-presets";
import { WORKFLOW_NODE_DEFINITIONS } from "../config/workflow-node-definitions";
import type { ActionPresetId } from "../types/action-preset";
import type { WorkflowNode, WorkflowNodeType } from "../types/workflow-node";

interface CreateWorkflowNodeInput {
  type: WorkflowNodeType;
  position: XYPosition;
  presetId?: ActionPresetId;
}

function createNodeId() {
  // 节点 id 必须稳定且唯一，Edge 会通过 source/target id 引用节点。
  return `workflow-node-${globalThis.crypto.randomUUID()}`;
}

/** 根据节点定义或 Action preset 创建一个可直接交给 React Flow 的节点实例。 */
export function createWorkflowNode({ type, position, presetId }: CreateWorkflowNodeInput): WorkflowNode {
  const definition = WORKFLOW_NODE_DEFINITIONS[type];
  const preset = presetId ? ACTION_PRESETS[presetId] : undefined;

  return {
    id: createNodeId(),
    type,
    position,
    data: {
      name: preset?.label ?? definition.defaultName,
      capabilities: [...definition.capabilities],
      // 深拷贝默认配置，避免一个节点修改配置时污染其他节点或全局定义。
      config: structuredClone(preset?.defaultConfig ?? definition.defaultConfig),
      inputs: [],
      outputs: [],
      appearance: { semanticRole: definition.appearance.semanticRole, density: "default" },
      metadata: { schemaVersion: 1 },
    },
    selected: true,
    ariaLabel: `${definition.label} workflow node`,
  };
}
