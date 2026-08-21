import type { InspectorBlockDefinition, InspectorBlockProps } from "../types/inspector";
import type { NodeCapabilityId } from "../types/workflow-node";
import { NODE_CAPABILITY_DEFINITIONS } from "./capability-definitions";

// 当前每个能力使用占位区块；后续可按 capability 替换为真实配置表单。
function PlaceholderBlock({ node, capability }: InspectorBlockProps) {
  return <div className="inspector__block-content"><span>{NODE_CAPABILITY_DEFINITIONS[capability].description}</span><small>Configuration placeholder</small><code>{node.data.name}</code></div>;
}

const capabilityOrder: readonly NodeCapabilityId[] = ["setup", "assignment", "approvalPolicy", "form", "input", "output", "completion", "rules", "branches", "timing", "action", "notification", "retry", "escalation", "exception", "permissions", "appearance"];

export const INSPECTOR_BLOCK_DEFINITIONS = capabilityOrder.reduce((definitions, capability, order) => {
  definitions[capability] = { capability, label: NODE_CAPABILITY_DEFINITIONS[capability].label, order, render: PlaceholderBlock };
  return definitions;
}, {} as Record<NodeCapabilityId, InspectorBlockDefinition>);
