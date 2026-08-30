import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { InspectorBlockDefinition, InspectorBlockProps } from "../types/inspector";
import type { NodeCapabilityId } from "../types/workflow-node";
import { NODE_CAPABILITY_DEFINITIONS } from "./capability-definitions";

function PlaceholderBlock({ node, capability }: InspectorBlockProps) {
  const fieldId = `inspector-${node.id}-${capability}`;
  const usesSelect = ["rules", "timing", "action", "assignment", "approvalPolicy"].includes(capability);
  const usesTextarea = ["form", "notification", "exception"].includes(capability);
  const usesSwitch = ["completion", "retry", "escalation", "permissions"].includes(capability);

  return (
    <div className="inspector__block-content">
      <span>{NODE_CAPABILITY_DEFINITIONS[capability].description}</span>
      <small>Configuration placeholder · no workflow data is changed</small>
      {capability === "setup" ? (
        <div className="inspector__field"><Label htmlFor={fieldId}>Node name</Label><Input id={fieldId} value={node.data.name} readOnly aria-readonly="true" /></div>
      ) : null}
      {usesSelect ? (
        <div className="inspector__field"><Label htmlFor={fieldId}>Configuration</Label><Select disabled><SelectTrigger id={fieldId}><SelectValue placeholder="Not configured" /></SelectTrigger><SelectContent><SelectItem value="placeholder">Placeholder</SelectItem></SelectContent></Select></div>
      ) : null}
      {usesTextarea ? (
        <div className="inspector__field"><Label htmlFor={fieldId}>Details</Label><Textarea id={fieldId} readOnly placeholder="Configuration will appear here." aria-readonly="true" /></div>
      ) : null}
      {usesSwitch ? (
        <div className="inspector__switch-field"><Switch id={fieldId} disabled /><Label htmlFor={fieldId}>Enable when configured</Label></div>
      ) : null}
      {capability !== "setup" && !usesSelect && !usesTextarea && !usesSwitch ? <code>{node.data.name}</code> : null}
    </div>
  );
}

const capabilityOrder: readonly NodeCapabilityId[] = ["setup", "assignment", "approvalPolicy", "form", "input", "output", "completion", "rules", "branches", "timing", "action", "notification", "retry", "escalation", "exception", "permissions", "appearance"];

export const INSPECTOR_BLOCK_DEFINITIONS = capabilityOrder.reduce((definitions, capability, order) => {
  definitions[capability] = { capability, label: NODE_CAPABILITY_DEFINITIONS[capability].label, order, render: PlaceholderBlock };
  return definitions;
}, {} as Record<NodeCapabilityId, InspectorBlockDefinition>);
