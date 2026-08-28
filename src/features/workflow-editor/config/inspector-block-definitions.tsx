import type { InspectorBlockDefinition, InspectorBlockProps } from "../types/inspector";
import type { NodeCapabilityId } from "../types/workflow-node";
import { NODE_CAPABILITY_DEFINITIONS } from "./capability-definitions";

function PlaceholderBlock({ node, capability }: InspectorBlockProps) {
  return <div className="grid gap-[5px] text-[11px] leading-[1.4] text-muted-foreground"><span>{NODE_CAPABILITY_DEFINITIONS[capability].description}</span><small className="text-[10px] text-[#98a2b3]">Configuration placeholder</small><code className="w-fit max-w-full overflow-hidden text-ellipsis rounded bg-[#f5f7fa] px-[5px] py-[3px] font-mono text-[10px] text-muted-foreground">{node.data.name}</code></div>;
}

const capabilityOrder: readonly NodeCapabilityId[] = ["setup", "assignment", "approvalPolicy", "form", "input", "output", "completion", "rules", "branches", "timing", "action", "notification", "retry", "escalation", "exception", "permissions", "appearance"];

export const INSPECTOR_BLOCK_DEFINITIONS = capabilityOrder.reduce((definitions, capability, order) => {
  definitions[capability] = { capability, label: NODE_CAPABILITY_DEFINITIONS[capability].label, order, render: PlaceholderBlock };
  return definitions;
}, {} as Record<NodeCapabilityId, InspectorBlockDefinition>);
